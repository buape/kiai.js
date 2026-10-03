export type DenylistCreateType = "channel" | "role" | "user"
export type DenylistType = DenylistCreateType | "internal"

export type DenylistEntry = {
	id: string
	guildId: string
	roleId: string | null
	userId: string | null
	channelId: string | null
}

export type Denylists = {
	guildId: string
	users: { id: string; userId: string }[]
	roles: { id: string; roleId: string }[]
	channels: { id: string; channelId: string }[]
}

export type DeletedDenylistEntry = {
	guildId: string
	channelId: string | null
	roleId: string | null
	userId: string | null
	id: string
}
