import { describe, expect, test } from "bun:test"
import type { VirtualMessage } from "../src"
import { ids, verifyClient } from "./_setup"

describe("KiaiClient Core Methods", () => {
	test("getRoot() returns API information", async () => {
		const client = await verifyClient()
		const root = await client.getRoot()

		expect(root).toBeDefined()
		expect(root.message).toBeDefined()
		expect(root.documentation).toBeDefined()
		expect(root.version).toBeDefined()
	})
})
