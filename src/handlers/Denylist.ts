import type { CountResponse, Denylist, DenylistEntry } from "../types"
import { BaseHandler } from "."

export class DenylistHandler extends BaseHandler {
	/**
	 * Get all denylists for a guild
	 * @param guildId The guild ID to get denylists for
	 */
	async getDenylists(guildId: string) {
		const result = await this._handler.request<Denylist>(`/${guildId}/denylist`)
		return result
	}

	/**
	 * Create a new denylist entry
	 * @param guildId The guild ID to create the entry in
	 * @param data The entry data
	 */
	async createDenylist(
		guildId: string,
		data: { type: "channel" | "role" | "user"; id: string }
	) {
		const result = await this._handler.request<DenylistEntry>(
			`/${guildId}/denylist`,
			"POST",
			{},
			{
				type: data.type,
				id: data.id
			}
		)
		return result
	}

	/**
	 * Delete all denylists for a guild
	 * @param guildId The guild ID to delete denylists from
	 */
	async deleteAllDenylists(guildId: string) {
		const result = await this._handler.request<CountResponse>(
			`/${guildId}/denylist`,
			"DELETE",
			{},
			{ type: "all" }
		)
		return result
	}

	/**
	 * Delete all denylists for a guild by type
	 * @param guildId The guild ID to delete denylists from
	 * @param type The type of denylists to delete
	 */
	async deleteAllDenylistsByType(
		guildId: string,
		type: "channel" | "role" | "user"
	) {
		const result = await this._handler.request<CountResponse>(
			`/${guildId}/denylist/type/${type}`,
			"DELETE"
		)
		return result
	}

	/**
	 * Delete a specific denylist entry
	 * @param guildId The guild ID the entry is in
	 * @param id The ID of the entry to delete, this can be the internal ID, user ID, channel ID or role ID
	 */
	async deleteDenylistById(
		guildId: string,
		type: "channel" | "role" | "user" | "internal",
		id: string
	) {
		const result = await this._handler.request<DenylistEntry>(
			`/${guildId}/denylist/${type}/${id}`,
			"DELETE"
		)
		return result
	}
}
