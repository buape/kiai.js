import type { RequestHandler } from "../RequestHandler"

/**
 * This is the base class for all handlers.
 * It is not intended to be used directly.
 * @internal
 */
export class BaseHandler {
	public _handler: RequestHandler
	constructor(handler: RequestHandler) {
		this._handler = handler
	}
}
