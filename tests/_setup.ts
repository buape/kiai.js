import { expect } from "bun:test"
import { KiaiClient } from "../src"
import { ids } from "./_ids"

export const getClient = () => {
	const apiKey = process.env.TEST_API_KEY
	if (!apiKey) throw new Error("TEST_API_KEY environment variable not set")

	const client = new KiaiClient(apiKey, { debug: !!process.env.DEBUG })
	return client
}

export const verifyClient = async () => {
	const client = getClient()
	const me = await client.getMe()

	expect(me.id).toBe(ids.applicationId)
	return client
}

export { ids }
