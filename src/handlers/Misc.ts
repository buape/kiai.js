import type { MeResponse, SuccessResponse, VirtualMessage } from "../types"
import { BaseHandler } from "./BaseHandler"

export class Misc extends BaseHandler {
	/**
	 * Get information about the current application
	 */
	public async getSelf() {
		return await this._handler.request<MeResponse>("/me", "GET")
	}

	/**
	 * Post a virtual message
	 * @param message The message to post
	 */
	public async postVirtualMessage(message: VirtualMessage) {
		const result = await this._handler.request<SuccessResponse>(
			`/virtual_message`,
			"POST",
			{},
			message
		)
		return result
	}
}
