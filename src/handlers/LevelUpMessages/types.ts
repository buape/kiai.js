import type { ApiDate } from "../../types"

/**
 * Delivery flags for a message built with Message Kit.
 *
 * `silent` suppresses the notification ping; `ephemeral` only shows the
 * message to the triggering user.
 */
export type MessageKitFlags = {
	silent: boolean
	ephemeral: boolean
}

/** A media reference (image / video / file) used by a Message Kit component. */
export type MessageKitMedia = {
	url: string
}

/** An image entry inside a {@link MessageKitMediaGallery} component. */
export type MessageKitMediaItem = {
	media: MessageKitMedia
	description?: string
}

/**
 * A single message component in a Message Kit draft.
 *
 * Message Kit is the editor Kiai uses to customise level-up messages. Each
 * component is discriminated by its `type` (e.g. `"TextDisplay"`,
 * `"MediaGallery"`, `"Thumbnail"`, `"Button"`). Components are nested via
 * `components` / `items` on container types, and image media is carried by the
 * `MediaGallery` and `Thumbnail` components.
 */
export type MessageKitComponent =
	| {
			type: "TextDisplay"
			content: string
			id?: string
	  }
	| {
			type: "MediaGallery"
			items: MessageKitMediaItem[]
			id?: string
	  }
	| {
			type: "Thumbnail"
			media: MessageKitMedia
			description?: string
			id?: string
	  }
	| {
			type: "Button"
			style?: number | string
			label?: string
			custom_id?: string
			disabled?: boolean
			emoji?: unknown
			id?: string
	  }
	| {
			type: "Container"
			components: MessageKitComponent[]
			accent_color?: string | null
			spoiler?: boolean
			id?: string
	  }
	| {
			type: "ActionRow"
			components: MessageKitComponent[]
			id?: string
	  }
	| {
			type: "Section"
			components: MessageKitComponent[]
			accessory?: MessageKitComponent
			id?: string
	  }
	| {
			type: "Separator"
			spacing?: string
			divider?: boolean
			id?: string
	  }
	| {
			type: "File"
			file: MessageKitMedia
			spoiler?: boolean
			id?: string
	  }
	// Any other Message Kit component type (e.g. the various select menus).
	| {
			type: string
			id?: string
			[key: string]: unknown
	  }

/**
 * The customisation data for a level-up message.
 *
 * Kiai stores this as the opaque Message Kit draft produced by the level-up
 * message editor. It is not a plain `{ content, images }` object: the message
 * body is broken into `items` (message components, including any images
 * rendered at the bottom of the message), alongside delivery `flags` and
 * optional `attachments` / `actions`.
 */
export type LevelUpMessageKitData = {
	items: MessageKitComponent[]
	flags: MessageKitFlags
	attachments?: unknown[]
	actions?: Array<{
		id?: string
		name?: string
		details?: unknown
	}>
}

export type LevelUpMessage = {
	id?: string
	guildId?: string
	level?: number
	messageKitData: LevelUpMessageKitData
	createdAt?: ApiDate
	updatedAt?: ApiDate
}
