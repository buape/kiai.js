import type { RatelimitErrorResponse } from "../types"

/**
 * @extends Error
 * @property {string} name The type of error (RatelimitError)
 * @property {number} status HTTP status of the error
 * @property {number} resetAfter The time remaining for your ratelimit to expire in milliseconds
 * @property {string} message The message of this error
 */

export class RatelimitError extends Error {
	name: string
	status: number
	resetAfter: number
	message: string

	constructor(
		status: number,
		resetAfter: number,
		data: RatelimitErrorResponse
	) {
		super()
		this.name = this.constructor.name
		this.status = status
		this.resetAfter = resetAfter
		this.message =
			data.message ||
			`You are currently ratelimited! Try again in ${formatTime(resetAfter)}`
	}
}

function formatTime(seconds: number): string {
	if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`
	const minutes = Math.floor(seconds / 60)
	if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`
	const hours = Math.floor(minutes / 60)
	return `${hours} hour${hours === 1 ? "" : "s"}`
}
