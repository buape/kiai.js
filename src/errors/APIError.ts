import type { ErrorResponse } from "../types"

/**
 * @extends Error
 * @property {string} name The type of error (APIError)
 * @property {number} status HTTP status of the error
 * @property {string} message The message of this error
 */

export class APIError extends Error {
	error: string
	code: number
	message: string

	constructor(status: number, data: ErrorResponse) {
		super()
		this.name = this.constructor.name
		this.error = data.error
		this.code = data.code || status
		this.message = data.message
	}
}
