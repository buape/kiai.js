import type { ApiDate } from "../../types"

export type Multiplier = {
	id: string
	createdAt: ApiDate
	updatedAt: ApiDate
	guildId: string
	channelId: string | null
	roleId: string | null
	multiplier: number
	expiresAt: ApiDate | null
}

export type CreateMultiplier = {
	multiplier: number
	expiresAt?: string | number | Date
} & (
	| { channelId: string; roleId?: never }
	| { roleId: string; channelId?: never }
)

/** @deprecated Use CreateMultiplier; the v3 API infers the type from channelId or roleId. */
export type RoleMultiplier = Extract<CreateMultiplier, { roleId: string }> & {
	guildId?: string
	type?: "role"
}

/** @deprecated Use CreateMultiplier; the v3 API infers the type from channelId or roleId. */
export type ChannelMultiplier = Extract<
	CreateMultiplier,
	{ channelId: string }
> & { guildId?: string; type?: "channel" }

export type MultiplierResponse = {
	guildId: string
	multipliers: Multiplier[]
	global: number
}

export type GlobalMultiplierResponse = { global: number }
