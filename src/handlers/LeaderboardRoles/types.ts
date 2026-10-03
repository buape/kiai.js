import type { LeaderboardTime } from "../../types"

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
	time: LeaderboardTime
}

export type SyncLeaderboardRolesResponse = {
	success: boolean
	roles: number
}
