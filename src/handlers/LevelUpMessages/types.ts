import type { ApiDate } from "../../types"

/**
 * The customisation data for a level-up message.
 *
 * The Kiai API returns this as an opaque object; this type models the fields
 * that the level-up message editor exposes, including the images that are
 * rendered at the bottom of the message.
 */
export type LevelUpMessageKitData = {
	content: string
	images: string[]
}

export type LevelUpMessage = {
	id?: string
	guildId?: string
	level?: number
	messageKitData: LevelUpMessageKitData
	createdAt?: ApiDate
	updatedAt?: ApiDate
}
