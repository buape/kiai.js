import { describe, expect, test } from "bun:test"
import type { VirtualMessage } from "../src"
import { ids, verifyClient } from "./_setup"

describe("Misc", () => {
	describe("getSelf()", () => {
		test("returns application information", async () => {
			const client = await verifyClient()
			const self = await client.misc.getSelf()

			expect(self).toBeDefined()
			expect(self.id).toBeDefined()
			expect(self.userId).toBeDefined()
			expect(self.rateLimit).toBeDefined()
			expect(self.permissions).toBeDefined()
		})
	})

	describe("postVirtualMessage()", () => {
		test("creates a virtual message", async () => {
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

			const result = await client.misc.postVirtualMessage(message)
			expect(result.success).toBeTrue()
		})
	})
})
