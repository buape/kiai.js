import type { LeaderboardTime } from "../../types"

export type AutoLeaderboard = {
	id: string
	guildId: string
	channelId: string
	messageId: string | null
	type: string
	time: LeaderboardTime
	description: string | null
}

export type CreateAutoLeaderboard = {
	channelId: string
	type: "xp" | "message" | "voice" | "streak"
	time: LeaderboardTime
	description?: string | null
}
