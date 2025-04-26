/**
 * Base response types
 */
export type APIResponse<T> = {
	data: T
	status: number
	headers: Record<string, string>
}

export type SuccessResponse = {
	success: string
}

export type CountResponse = {
	count: number
}

export type RootResponse = {
	message: string
	documentation: string
	version: number
}

/**
 * Auth types
 */
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

/**
 * Error types
 */
export type ErrorResponse = {
	error: string
	code: number
	message: string
}

export type RatelimitErrorResponse = ErrorResponse & {
	resetAfter: number
}

/**
 * Leveling types
 */
export type LevelData = {
	id: string
	guildId: string
	currentLevel: number
	nextLevel: number
	nextLevelXp: number
	xp: number
}

export type Leaderboard = LevelData[]

/**
 * Leaderboard Role types
 */
export type LeaderboardRole = {
	id: string
	guildId: string
	roleId: string
	type:
		| "FIRST"
		| "SECOND"
		| "THIRD"
		| "FIRST_THROUGH_THIRD"
		| "FIRST_THROUGH_FIFTH"
	time: "ALL" | "WEEK" | "MONTH"
}

/**
 * Settings types
 */
export type XpDropClaimAction = "EDIT_MESSAGE" | "DELETE_MESSAGE"

export type GuildSettings = {
	id: string
	name: string
	levelUpChannel: string | null
	sendLevelUpMessages: boolean
	autoDeleteLevelUpMessages: boolean
	messageXpEnabled: boolean
	globalMulti: number
	minXp: number
	maxXp: number
	levelCap: number | null
	cooldown: number
	resetXpOnLeave: boolean
	resetXpOnBan: boolean
	stackRoleRewards: boolean
	nicknameFormat: string | null
	xpStreakEnabled: boolean
	xpStreakMinDays: number
	xpStreakDayRequired: number
	xpStreakChannel: string | null
	xpStreakBonus: number
	xpStreakMessage: string
	xpDecayEnabled: boolean
	xpDecayInterval: number
	xpDecayAmount: number
	xpDropEnabled: boolean
	xpDropClaimAction: XpDropClaimAction
	xpDropXpMin: number
	xpDropXpMax: number
	xpDropMessage: string
	xpDropAmount: number
	xpDropTimeBetweenDrops: number
	xpDropExpiresAfter: number
	xpDropCount: number
	xpDropLastDrop: Date | null
	rankCardBackground: string | null
	rankCardPrimaryColor: string | null
	rankCardSecondaryColor: string | null
	weeklyLeaderboardsEnabled: boolean
	monthlyLeaderboardsEnabled: boolean
	weekStartsOnMonday: boolean
	leaderboardVanity: string | null
	xpFormula: string
	voiceXpEnabled: boolean
	voiceXpPerMinute: number
	voiceXpUserMinimum: number
	proxyTupperboxChannel: string | null
	pluralKitEnabled: boolean
	pluralKitFronterOnly: boolean
}

/**
 * Reward types
 */
export type BaseReward = {
	id: string
	guildId: string
	requiredRoleId?: string
	level: number
}

export type RoleReward = BaseReward & {
	roleId: string
	removeRole: boolean
}

export type MessageReward = BaseReward & {
	message: string
	channelId: string
}

export type MoneyReward = BaseReward & {
	amount: number
	bank: boolean
}

export type Reward = RoleReward | MessageReward | MoneyReward

/**
 * Multiplier types
 */
export type BaseMultiplier = {
	type: string
	guildId: string
	multiplier: number
}

export type RoleMultiplier = BaseMultiplier & {
	roleId: string
}

export type ChannelMultiplier = BaseMultiplier & {
	channelId: string
}

export type GuildMultiplier = BaseMultiplier & {}

export type Multiplier = RoleMultiplier | ChannelMultiplier | GuildMultiplier

export type MultiplierResponse = {
	guildId: string
	multipliers: Multiplier[]
	global: number
}

/**
 * Permission types
 */
export enum ApiPermission {
	Levels = 1 << 0,
	Multipliers = 1 << 1,
	Export = 1 << 2,
	Denylist = 1 << 3,
	Rewards = 1 << 4
}

/**
 * Virtual message types
 */
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

/**
 * Denylist types
 */
export type DenylistEntry = {
	id: string
	guildId: string
	roleId?: string
	userId?: string
	channelId?: string
}

export type Denylists = {
	guildId: string
	users: DenylistEntry[]
	roles: DenylistEntry[]
	channels: DenylistEntry[]
}

export type RateLimitError = {
	name: string
	status: number
	message: string
	resetAfter: number
}
