import type { ApiDate } from "../../types"

export type CooldownOverride = {
	id: string
	guildId: string
	cooldown: number
	roleId: string
	expiresAt: ApiDate | null
	createdAt: ApiDate
	updatedAt: ApiDate
}

export type CooldownsResponse = {
	guildId: string
	server: number
	overrides: CooldownOverride[]
}

export type SetServerCooldownResponse = { cooldown: number }
export type ClearCooldownsResponse = { count: number; server: number }
export type SetRoleCooldownResponse = CooldownOverride
