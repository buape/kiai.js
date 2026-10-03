import type { ApiDate } from "../../types"

export type LevelUpMessage = {
	id?: string
	guildId?: string
	level?: number
	messageKitData: unknown
	createdAt?: ApiDate
	updatedAt?: ApiDate
}
