import { APIError } from "./errors/APIError"
import { RatelimitError } from "./errors/RatelimitError"
import type { ErrorResponse, RatelimitErrorResponse } from "./types"

export class RequestHandler {
	baseURL: string
	apiKey: string
	debug: boolean
	fetchFunction: (
		url: URL | string,
		init?: RequestInit | undefined
	) => Promise<Response>

	constructor(
		baseURL: string,
		apiKey: string,
		debug = false,
		fetchFunction: (
			url: URL | string,
			init?: RequestInit | undefined
		) => Promise<Response> = fetch
	) {
		this.baseURL = baseURL
		this.apiKey = apiKey
		this.debug = debug
		this.fetchFunction = fetchFunction
	}

	async request<T>(
		endpoint: string,
		method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" = "GET",
		query = {},
		// biome-ignore lint/suspicious/noExplicitAny: This can truly be any
		body: { [key: string]: any } = {},
		noError = false,
		customBaseUrl?: string
	): Promise<T> {
		const url = `${customBaseUrl ?? this.baseURL}${endpoint}${new URLSearchParams(query).toString()}`
		const options = {
			method,
			headers: {
				Authorization: this.apiKey,
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: method === "GET" ? undefined : JSON.stringify(body)
		}

		if (this.debug) {
			console.debug(
				`Sending request to ${url}\nMethod:\n  ${
					options.method
				}\nParams:\n  ${JSON.stringify(query)}`
			)
		}

		const res = await this.fetchFunction(url, options)
		const headers: Record<string, string> = {}
		res.headers.forEach((value, key) => {
			headers[key] = value
		})

		if (res.status >= 200 && res.status < 300) {
			const response = (await res.json()) as { data?: T } | T
			if (this.debug) console.debug("Success: \n", response)
			// Handle both wrapped and unwrapped responses
			return (
				response && typeof response === "object" && "data" in response
					? response.data
					: response
			) as T
		}

		let errorData: ErrorResponse
		try {
			const parsed = (await res.json()) as Partial<ErrorResponse>
			errorData = {
				error: typeof parsed.error === "string" ? parsed.error : res.statusText,
				code: typeof parsed.code === "number" ? parsed.code : res.status,
				message:
					typeof parsed.message === "string" ? parsed.message : res.statusText
			}
		} catch {
			errorData = {
				error: res.statusText,
				code: res.status,
				message: res.statusText
			}
		}

		if (res.status === 429) {
			if (noError) return errorData as T
			const resetAfter = Number.parseInt(
				res.headers.get("x-ratelimit-reset-after") ?? "0"
			)
			const ratelimitData: RatelimitErrorResponse = {
				...errorData,
				resetAfter
			}
			throw new RatelimitError(res.status, resetAfter, ratelimitData)
		}

		if (this.debug) console.debug("API Error: \n", res, errorData)
		throw new APIError(res.status, errorData)
	}
}
