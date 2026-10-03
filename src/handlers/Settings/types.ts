export type XpDropClaimAction = string

export type GuildSettings = {
	id: string
	messageXpEnabled: boolean
	cooldown: number
	minXp: number
	maxXp: number
	levelCap: number | null
	resetXpOnLeave: boolean
	resetXpOnBan: boolean
	xpFormula: string
	privateThreadXpEnabled: boolean
	voiceXpEnabled: boolean
	voiceXpPerMinute: number
	voiceXpUserMinimum: number
	xpDecayEnabled: boolean
	xpDecayInterval: number
	xpDecayAmount: number
	xpDropEnabled: boolean
	xpDropAmount: number
	xpDropTimeBetweenDropsMin: number
	xpDropTimeBetweenDropsMax: number
	xpDropExpiresAfter: number
	xpDropXpMin: number
	xpDropXpMax: number
	xpDropMessageKitData: unknown
	xpDropClaimAction: XpDropClaimAction
	reactionXpEnabled: boolean
	reactionXpDailyMax: number
	reactionXpGiven: number
	reactionXpReceived: number
	reactionXpGivenSuper: number
	reactionXpReceivedSuper: number
	stackRoleRewards: boolean
	reverseRoleRewardsOnLevelDown: boolean
	reverseMoneyRewardsOnLevelDown: boolean
	reverseNicknameRewardsOnLevelDown: boolean
	levelUpChannel: string | null
	sendLevelUpMessages: boolean
	autoDeleteLevelUpMessages: boolean
	nicknameFormat: string | null
	showNextRoleReward: boolean
	rankCardTotalXp: boolean
	leaderboardThumbnail: boolean
	rankCardBackground: string | null
	rankCardPrimaryColor: string | null
	rankCardSecondaryColor: string | null
	xpStreakEnabled: boolean
	xpStreakChannel: string | null
	xpStreakSendMessage: boolean
	xpStreakMinDays: number
	xpStreakDayRequired: number
	xpStreakBonus: number
	xpStreakMessage: string
	prestigeEnabled: boolean
	prestigeAutomatic: boolean
	prestigeCustomName: string | null
	prestigeRequirementFormula: string
	weeklyLeaderboardsEnabled: boolean
	monthlyLeaderboardsEnabled: boolean
	weekStartsOnMonday: boolean
	proxyTupperboxChannel: string | null
	pluralKitEnabled: boolean
	pluralBuddyEnabled: boolean
	pluralGgEnabled: boolean
	pluralKitFronterOnly: boolean
	alwaysEphemeral: boolean
}
