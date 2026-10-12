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

/**
 * API application permission bit flags.
 */
export const ApiPermission = {
	Levels: 1 << 0,
	Multipliers: 1 << 1,
	Export: 1 << 2,
	Denylist: 1 << 3,
	Rewards: 1 << 4,
	Cooldowns: 1 << 5,
	XpDrops: 1 << 6,
	LevelUpMessages: 1 << 7,
	AutoLeaderboards: 1 << 8
} as const

export type ApiPermission = (typeof ApiPermission)[keyof typeof ApiPermission]
