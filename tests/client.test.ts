import { describe, expect, test } from "bun:test"
import { verifyClient, ids } from "./_setup"
import type { VirtualMessage } from "../src"

describe("KiaiClient Core Methods", () => {
	test("getRoot() returns API information", async () => {
		const client = await verifyClient()
		const root = await client.getRoot()

		expect(root).toBeDefined()
		expect(root.message).toBeDefined()
		expect(root.documentation).toBeDefined()
		expect(root.version).toBeDefined()
	})

	test("getMe() returns application information", async () => {
		const client = await verifyClient()
		const me = await client.getMe()

		expect(me).toBeDefined()
		expect(me.id).toBeDefined()
		expect(me.userId).toBeDefined()
		expect(me.rateLimit).toBeDefined()
		expect(me.permissions).toBeDefined()
	})

	test("createVirtualMessage() creates a virtual message", async () => {
		const client = await verifyClient()

		const message: VirtualMessage = {
			channel: {
				id: ids.channel
			},
			member: {
				id: ids.users.buape,
				roleIds: [ids.roles["Role 1"], ids.roles["Role 2"]]
			},
			guild: {
				id: ids.server
			}
		}

		const result = await client.createVirtualMessage(message)
		expect(result.success).toBeDefined()
	})
})
