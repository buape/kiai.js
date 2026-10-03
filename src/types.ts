/**
 * Shared types
 */
export type ApiDate = Date | number | string

export type APIResponse<T> = {
	data: T
	status: number
	headers: Record<string, string>
}

export type SuccessResponse = {
	success: boolean
}

export type CountResponse = {
	count: number
}

export type RootResponse = {
	message: string
	documentation: string
	version: number
}

export type ErrorResponse = {
	error: string
	code: number
	message: string
}

export type RatelimitErrorResponse = ErrorResponse & {
	resetAfter: number
}

export type RateLimitError = {
	name: string
	status: number
	message: string
	resetAfter: number
}

export type LeaderboardTime = "ALL" | "WEEK" | "MONTH"
