import type { LeaderboardTime } from "../../types"

export type LevelData = {
	id: string
	userId: string
	guildId: string
	level: number
	currentLevel: number
	nextLevel: number
	nextLevelXp: number
	xp: number
	prestige: number
	messages: number
	messagesSent: number
	voice: number
	voiceMinutes: number
	rankCardBackground: string | null
	streak: number
	currentXpStreak: number
	streakDoneToday: boolean
}

export type LeaderboardEntry = {
	id: string
	userId: string
	guildId: string
	rank: number
	level: number
	currentLevel: number
	nextLevel: number
	nextLevelXp: number
	xp: number
	prestige: number
	messages: number
	messagesSent: number
	voice: number
	voiceMinutes: number
	streak: number
	currentXpStreak: number
	score: number
}

export type Leaderboard = LeaderboardEntry[]
export type LeaderboardType = "xp" | "message" | "voice" | "streak" | "prestige"

export type LeaderboardOptions = {
	start?: number
	end?: number
	type?: LeaderboardType
	time?: LeaderboardTime
	startPeriod?: number
	endPeriod?: number
}

export type PrestigeResponse = {
	success: boolean
	oldLevel: number
	oldPrestige: number
	prestige: number
	currentLevel: number
	xp: number
}

export type GuildStats = {
	startWeek: number
	currentWeek: number
	trend: {
		kiaiWeek: number
		weekLabel: string
		weekStart: string
		totalXp: number
		totalMessages: number
		totalVoiceMinutes: number
		activeUsers: number
	}[]
}
