import type { ApiDate } from "../../types"

export type ApplicationPermission = {
	guildId: string
	permissions: number
	permissionsArray: {
		name: string
		hex: string
		int: number
		description: string
	}[]
	authorizedBy: string
}

export type MeResponse = {
	id: string
	userId: string
	rateLimit: number
	permissions: ApplicationPermission[]
}

export type GuildExportResponse = { levels: LevelExport[]; guild: GuildExport }

export type LevelExport = {
	userId: string
	guildId: string
	avatarUrl: string
	createdAt: ApiDate
	updatedAt: ApiDate
	xp: number
	prestige: number
	messagesSent: number
	voiceMinutes: number
	rankCardBackground: string | null
	lastXp: ApiDate | null
	reactionsGivenToday: number
	xpToday: number
	currentXpStreak: number
	streakDoneToday: boolean
}

export type GuildExport = {
	id: string
	levelUpChannel: string | null
	levelUpMessages: unknown[]
	cooldown: number
	resetXpOnLeave: boolean
	resetXpOnBan: boolean
	xpFormula: string
	voiceXpEnabled: boolean
	voiceXpPerMinute: number
	stackRoleRewards: boolean
	roleRewards: unknown[]
	denylists: unknown[]
	multipliers: unknown[]
}

export type PremiumStatus = { premium: boolean }
export type BlacklistStatus = { blacklisted: boolean }

export type FeaturePreview = {
	key: string
	status: "enabled" | "rollout" | "disabled"
	enabled: boolean
	fullyRolledOut: boolean
}

export type XpDropResponse = {
	dropped: boolean
	channelId: string
	amount: number
}

export type VirtualMessage = {
	channel: {
		id: string
		parentId?: string
	}
	member: {
		id: string
		roleIds: string[]
	}
	guild: {
		id: string
	}
	message: {
		id: string
		content?: string
	}
}
