import { describe, expect, test } from "bun:test"
import { readFileSync, readdirSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import ts from "typescript"

describe("OpenAPI operation coverage", () => {
	test("maps every production v3 spec operation to an SDK request", async () => {
		const response = await fetch("https://www.kiai.app/api/v3/docs/json")
		if (!response.ok) {
			throw new Error(`Failed to fetch production OpenAPI spec: ${response.status}`)
		}
		const spec = (await response.json()) as {
			paths: Record<string, Record<string, unknown>>
		}
		const operations = new Set<string>()
		const requestPattern =
			/request<([\s\S]*?)>\(\s*(?:"([^"]+)"|`([^`]+)`)(?:\s*,\s*"(GET|POST|PATCH|PUT|DELETE)")?/g
		const sourceFiles: string[] = []

		const collectSourceFiles = (directory: string) => {
			for (const entry of readdirSync(directory, { withFileTypes: true })) {
				const path = join(directory, entry.name)
				if (entry.isDirectory()) collectSourceFiles(path)
				else if (path.endsWith(".ts")) sourceFiles.push(path)
			}
		}

		collectSourceFiles("src")

		for (const file of sourceFiles) {
			const source = readFileSync(file, "utf8")
			for (const match of source.matchAll(requestPattern)) {
				const path = (match[2] ?? match[3])
					.replace(/\$\{encodeURIComponent\((\w+)\)\}/g, "{$1}")
					.replace(/\$\{(\w+)\}/g, "{$1}")
				const method = match[4] ?? "GET"
				operations.add(`${method} ${path}`)
			}
		}

		const specOperations = Object.entries(spec.paths).flatMap(([path, methods]) =>
			Object.keys(methods).map(
				(method) => `${method.toUpperCase()} ${path.replace(/^\/api\/v3/, "")}`
			)
		)

		expect([...operations].sort()).toEqual(specOperations.sort())
	}, 20_000)

	test("maps SDK response type aliases to matching production schemas", async () => {
		const response = await fetch("https://www.kiai.app/api/v3/docs/json")
		if (!response.ok) {
			throw new Error(`Failed to fetch production OpenAPI spec: ${response.status}`)
		}
		const spec = (await response.json()) as { paths: Record<string, unknown> }
		const responseTypesByOperation = new Map<string, Set<string>>()
		const requestPattern =
			/request<([\s\S]*?)>\(\s*(?:"([^"]+)"|`([^`]+)`)(?:\s*,\s*"(GET|POST|PATCH|PUT|DELETE)")?/g
		const sourceFiles: string[] = []

		const collectSourceFiles = (directory: string) => {
			for (const entry of readdirSync(directory, { withFileTypes: true })) {
				const path = join(directory, entry.name)
				if (entry.isDirectory()) collectSourceFiles(path)
				else if (path.endsWith(".ts")) sourceFiles.push(path)
			}
		}

		collectSourceFiles("src")

		for (const file of sourceFiles) {
			const source = readFileSync(file, "utf8")
			for (const match of source.matchAll(requestPattern)) {
				const path = (match[2] ?? match[3])
					.replace(/\$\{encodeURIComponent\((\w+)\)\}/g, "{$1}")
					.replace(/\$\{(\w+)\}/g, "{$1}")
				const operation = `${match[4] ?? "GET"} ${path}`
				const responseTypes = responseTypesByOperation.get(operation) ?? new Set()
				responseTypes.add(match[1].trim())
				responseTypesByOperation.set(operation, responseTypes)
			}
		}

		const typeFiles = sourceFiles
			.filter((file) => file === "src/types.ts" || file.endsWith("/types.ts"))
			.map((file) => resolve(file))
		const program = ts.createProgram(typeFiles, {
			strictNullChecks: true,
			target: ts.ScriptTarget.ESNext,
			module: ts.ModuleKind.ESNext,
			moduleResolution: ts.ModuleResolutionKind.Bundler,
			skipLibCheck: true
		})
		const checker = program.getTypeChecker()
		const typeAliases = new Map<string, ts.TypeAliasDeclaration>()

		for (const sourceFile of program.getSourceFiles()) {
			for (const statement of sourceFile.statements) {
				if (ts.isTypeAliasDeclaration(statement)) {
					typeAliases.set(statement.name.text, statement)
				}
			}
		}

		const makeUnion = (types: unknown[]) => {
			const flattenedTypes = types.flatMap((type) => {
				const contract = type as { kind?: string; variants?: unknown[] }
				return contract.kind === "union" ? (contract.variants ?? []) : [type]
			})
			const hasTrue = flattenedTypes.some(
				(type) => JSON.stringify(type) === '{"kind":"literal","value":true}'
			)
			const hasFalse = flattenedTypes.some(
				(type) => JSON.stringify(type) === '{"kind":"literal","value":false}'
			)
			const normalizedTypes = flattenedTypes.filter(
				(type) =>
					!hasTrue ||
					!hasFalse ||
					(JSON.stringify(type) !== '{"kind":"literal","value":true}' &&
						JSON.stringify(type) !== '{"kind":"literal","value":false}')
			)
			if (hasTrue && hasFalse) normalizedTypes.push({ kind: "boolean" })
			const uniqueTypes = new Map(normalizedTypes.map((type) => [JSON.stringify(type), type]))
			const variants = [...uniqueTypes.entries()]
				.sort(([left], [right]) => left.localeCompare(right))
				.map(([, type]) => type)
			return variants.length === 1 ? variants[0] : { kind: "union", variants }
		}

		const typeToContract = (type: ts.Type, depth = 0, omitUndefined = false): unknown => {
			if (depth > 32) throw new Error("Type alias is recursively nested too deeply")
			if (type.isUnion()) {
				return makeUnion(
					type.types
						.filter((variant) => !omitUndefined || !(variant.flags & ts.TypeFlags.Undefined))
						.map((variant) => typeToContract(variant, depth + 1))
				)
			}
			if (type.flags & ts.TypeFlags.StringLiteral) {
				return { kind: "literal", value: (type as ts.StringLiteralType).value }
			}
			if (type.flags & ts.TypeFlags.NumberLiteral) {
				return { kind: "literal", value: (type as ts.NumberLiteralType).value }
			}
			if (type.flags & ts.TypeFlags.BooleanLiteral) {
				return { kind: "literal", value: checker.typeToString(type) === "true" }
			}
			if (type.flags & ts.TypeFlags.Null) return { kind: "null" }
			if (type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) {
				return { kind: "any" }
			}
			if (type.flags & ts.TypeFlags.StringLike) return { kind: "string" }
			if (type.flags & ts.TypeFlags.NumberLike) return { kind: "number" }
			if (type.flags & ts.TypeFlags.BooleanLike) return { kind: "boolean" }
			if (type.flags & ts.TypeFlags.Undefined) return { kind: "undefined" }

			const symbolName = type.aliasSymbol?.name ?? type.getSymbol()?.name
			if (symbolName === "Date") return { kind: "date" }
			if (checker.isArrayType(type)) {
				const itemType = checker.getTypeArguments(type as ts.TypeReference)[0]
				if (!itemType) throw new Error("Array response type has no item type")
				return { kind: "array", items: typeToContract(itemType, depth + 1) }
			}

			if (type.flags & ts.TypeFlags.Object) {
				const properties = Object.fromEntries(
					checker
						.getPropertiesOfType(type)
						.sort((left, right) => left.name.localeCompare(right.name))
						.map((property) => {
							const location = property.valueDeclaration ?? property.declarations?.[0]
							if (!location) {
								throw new Error(`Missing declaration for property ${property.name}`)
							}
							const optional = Boolean(property.flags & ts.SymbolFlags.Optional)
							const propertyType = checker.getTypeOfSymbolAtLocation(property, location)
							return [
								property.name,
								{
									optional,
									type: typeToContract(propertyType, depth + 1, optional)
								}
							]
						})
				)
				const indexType = checker.getIndexTypeOfType(type, ts.IndexKind.String)
				return {
					kind: "object",
					properties,
					...(indexType ? { index: typeToContract(indexType, depth + 1) } : {})
				}
			}

			throw new Error(`Unsupported TypeScript response type: ${checker.typeToString(type)}`)
		}

		const asObject = (value: unknown): Record<string, unknown> =>
			value && typeof value === "object" && !Array.isArray(value)
				? (value as Record<string, unknown>)
				: {}

		const schemaToContract = (input: unknown, depth = 0): unknown => {
			if (depth > 32) throw new Error("OpenAPI schema is nested too deeply")
			const schema = asObject(input)
			if (typeof schema.$ref === "string") {
				const ref = schema.$ref.replace(/^#\//, "").split("/")
				let resolved: unknown = spec
				for (const part of ref) resolved = asObject(resolved)[part]
				return schemaToContract(resolved, depth + 1)
			}
			const unionSchemas = schema.anyOf ?? schema.oneOf
			if (Array.isArray(unionSchemas)) {
				if (
					unionSchemas.length === 2 &&
					unionSchemas.every((variant) => {
						const value = asObject(variant)
						return (
							value.type === "integer" || (value.type === "string" && value.format === "integer")
						)
					})
				) {
					return { kind: "number" }
				}
				const variants = unionSchemas.map((variant) => schemaToContract(variant, depth + 1))
				if (schema.nullable === true) variants.push({ kind: "null" })
				return makeUnion(variants)
			}
			if (Array.isArray(schema.allOf)) {
				const parts = schema.allOf.map((part) => schemaToContract(part, depth + 1))
				const objectParts = parts.every((part) => asObject(part).kind === "object")
				if (objectParts) {
					return {
						kind: "object",
						properties: Object.assign({}, ...parts.map((part) => asObject(part).properties))
					}
				}
				return { kind: "intersection", parts }
			}
			if (Object.hasOwn(schema, "const")) {
				return { kind: "literal", value: schema.const }
			}
			if (Array.isArray(schema.enum)) {
				return makeUnion(schema.enum.map((value) => ({ kind: "literal", value })))
			}
			if (schema.nullable === true) {
				return makeUnion([
					schemaToContract({ ...schema, nullable: false }, depth + 1),
					{ kind: "null" }
				])
			}
			if (schema.type === "null") return { kind: "null" }
			if (schema.type === "string") return { kind: "string" }
			if (schema.type === "number" || schema.type === "integer") {
				return { kind: "number" }
			}
			if (schema.type === "boolean") return { kind: "boolean" }
			if (schema.type === "Date") return { kind: "date" }
			if (schema.type === "array") {
				return {
					kind: "array",
					items: schemaToContract(schema.items, depth + 1)
				}
			}
			if (schema.type === "object" || schema.properties || schema.patternProperties) {
				const schemaProperties = asObject(schema.properties)
				const required = new Set(Array.isArray(schema.required) ? schema.required : [])
				const properties = Object.fromEntries(
					Object.entries(schemaProperties)
						.sort(([left], [right]) => left.localeCompare(right))
						.map(([name, propertySchema]) => [
							name,
							{
								optional: !required.has(name),
								type: schemaToContract(propertySchema, depth + 1)
							}
						])
				)
				const patterns = asObject(schema.patternProperties)
				const indexSchema =
					Object.values(patterns)[0] ??
					(typeof schema.additionalProperties === "object"
						? schema.additionalProperties
						: undefined)
				return {
					kind: "object",
					properties,
					...(indexSchema !== undefined ? { index: schemaToContract(indexSchema, depth + 1) } : {})
				}
			}
			return { kind: "any" }
		}

		const sdkTypeToContract = (expression: string): unknown => {
			const type = expression.trim().replace(/^\((.*)\)$/, "$1")
			if (type.endsWith("[]")) {
				return {
					kind: "array",
					items: sdkTypeToContract(type.slice(0, -2))
				}
			}
			const union = type.split(" | ")
			if (union.length > 1) {
				return makeUnion(union.map(sdkTypeToContract))
			}
			if (type === "null") return { kind: "null" }
			const alias = typeAliases.get(type)
			if (!alias) throw new Error(`No exported SDK type alias found for ${type}`)
			return typeToContract(checker.getTypeFromTypeNode(alias.type))
		}

		const findContractDifference = (
			left: unknown,
			right: unknown,
			path = "response"
		): string | undefined => {
			if (JSON.stringify(left) === JSON.stringify(right)) return undefined
			if (Array.isArray(left) && Array.isArray(right)) {
				for (let index = 0; index < Math.max(left.length, right.length); index++) {
					const difference = findContractDifference(left[index], right[index], `${path}[${index}]`)
					if (difference) return difference
				}
				return `${path}: array lengths differ`
			}
			if (left && right && typeof left === "object" && typeof right === "object") {
				const leftObject = left as Record<string, unknown>
				const rightObject = right as Record<string, unknown>
				const keys = [...new Set([...Object.keys(leftObject), ...Object.keys(rightObject)])].sort()
				for (const key of keys) {
					if (!(key in leftObject) || !(key in rightObject)) {
						return `${path}.${key}: property missing on one side`
					}
					const difference = findContractDifference(
						leftObject[key],
						rightObject[key],
						`${path}.${key}`
					)
					if (difference) return difference
				}
			}
			return `${path}: ${JSON.stringify(left)} !== ${JSON.stringify(right)}`
		}

		const mismatches: string[] = []
		const missingTypeExports = new Set<string>()
		const typeAliasOperations = new Map<string, Set<string>>()

		for (const [operation, responseTypes] of responseTypesByOperation) {
			const [method, path] = operation.split(" ", 2)
			const endpoint = asObject(spec.paths[`/api/v3${path}`])
			const operationSpec = asObject(endpoint[method.toLowerCase()])
			const responses = asObject(operationSpec.responses)
			const successResponse = Object.entries(responses)
				.filter(([status]) => /^2\d\d$/.test(status))
				.map(([, result]) => asObject(result))
				.find((result) => asObject(asObject(result.content)["application/json"]).schema)
			const content = asObject(successResponse?.content)
			const json = asObject(content["application/json"])
			const responseSchema = asObject(json.schema)
			if (!Object.keys(responseSchema).length) {
				mismatches.push(`${operation}: missing production JSON response schema`)
				continue
			}

			const dataSchema = asObject(responseSchema.properties).data ?? responseSchema
			const productionContract = schemaToContract(dataSchema)
			for (const responseType of responseTypes) {
				const aliasNames = responseType.match(/\b[A-Z]\w*\b/g) ?? []
				for (const aliasName of aliasNames) {
					const aliasOperations = typeAliasOperations.get(aliasName) ?? new Set()
					aliasOperations.add(operation)
					typeAliasOperations.set(aliasName, aliasOperations)
				}
				const sdkContract = sdkTypeToContract(responseType)
				const difference = findContractDifference(sdkContract, productionContract)
				if (difference) mismatches.push(`${operation} (${responseType}): ${difference}`)
			}
		}

		const rootExports = new Set(
			[
				...readFileSync("src/index.ts", "utf8").matchAll(
					/export (?:type )?\* from ["']([^"']+)["']/g
				)
			].map((match) => match[1])
		)
		const handlerExports = readFileSync("src/handlers/index.ts", "utf8")
		for (const aliasName of typeAliasOperations.keys()) {
			const alias = typeAliases.get(aliasName)
			if (
				!alias ||
				!ts.getModifiers(alias)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
			) {
				missingTypeExports.add(`${aliasName}: type alias is not exported`)
				continue
			}
			const modulePath = `./${relative(resolve("src"), alias.getSourceFile().fileName)
				.replaceAll("\\", "/")
				.slice(0, -3)}`
			if (modulePath === "./types") {
				if (!rootExports.has(modulePath)) {
					missingTypeExports.add(`${aliasName}: shared types are not re-exported`)
				}
				continue
			}

			const featurePath = modulePath.replace(/\/types$/, "")
			const featureName = featurePath.replace(/^\.\/handlers\//, "./")
			const featureIndex = readFileSync(resolve("src", featurePath.slice(2), "index.ts"), "utf8")
			if (!/export type \* from ["']\.\/types["']/.test(featureIndex)) {
				missingTypeExports.add(`${aliasName}: feature types are not re-exported`)
			}
			if (!new RegExp(`export \\* from ["']${featureName}["']`).test(handlerExports)) {
				missingTypeExports.add(`${aliasName}: feature is not re-exported by handlers`)
			}
			if (!rootExports.has("./handlers")) {
				missingTypeExports.add(`${aliasName}: handlers are not re-exported at package root`)
			}
		}

		const specOperations = Object.entries(spec.paths).flatMap(([path, methods]) =>
			Object.keys(asObject(methods)).map(
				(method) => `${method.toUpperCase()} ${path.replace(/^\/api\/v3/, "")}`
			)
		)
		expect([...responseTypesByOperation.keys()].sort()).toEqual(specOperations.sort())
		expect(typeAliasOperations.size).toBeGreaterThan(0)
		expect([...missingTypeExports]).toEqual([])
		expect(mismatches).toEqual([])
	}, 20_000)
})
