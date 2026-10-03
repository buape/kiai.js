import type { SuccessResponse } from "../../types"
import { BaseHandler } from "../BaseHandler"

export type * from "./types"
import type {
	BlacklistStatus,
	FeaturePreview,
	GuildExportResponse,
	MeResponse,
	PremiumStatus,
	VirtualMessage,
	XpDropResponse
} from "./types"

export class Misc extends BaseHandler {
	/** Get information about the current application. */
	async getSelf(options: { guildId?: string; locale?: string } = {}) {
		return this._handler.request<MeResponse>(
			"/me",
			"GET",
			Object.fromEntries(Object.entries(options).filter(([, value]) => value !== undefined))
		)
	}

	/** Send a virtual message to the API. */
	async postVirtualMessage(message: VirtualMessage) {
		return this._handler.request<SuccessResponse>("/virtual_message", "POST", {}, message)
	}

	async exportGuild(guildId: string) {
		return this._handler.request<GuildExportResponse>(`/${encodeURIComponent(guildId)}/export`)
	}

	async getGuildPremium(guildId: string) {
		return this._handler.request<PremiumStatus>(`/${encodeURIComponent(guildId)}/premium`)
	}

	async getMemberPremium(guildId: string, userId: string) {
		return this._handler.request<PremiumStatus>(
			`/${encodeURIComponent(guildId)}/members/${encodeURIComponent(userId)}/premium`
		)
	}

	async getGuildBlacklist(guildId: string) {
		return this._handler.request<BlacklistStatus>(`/${encodeURIComponent(guildId)}/blacklist`)
	}

	async getMemberBlacklist(guildId: string, userId: string) {
		return this._handler.request<BlacklistStatus>(
			`/${encodeURIComponent(guildId)}/members/${encodeURIComponent(userId)}/blacklist`
		)
	}

	async getFeaturePreviews(guildId: string) {
		return this._handler.request<FeaturePreview[]>(
			`/${encodeURIComponent(guildId)}/feature-previews`
		)
	}

	async triggerXpDrop(guildId: string, channelId: string, amount: number) {
		return this._handler.request<XpDropResponse>(
			`/${encodeURIComponent(guildId)}/xp-drops`,
			"POST",
			{},
			{ channelId, amount }
		)
	}
}
