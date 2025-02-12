import { describe, expect, test } from "bun:test"
import type { ChannelMultiplier, RoleMultiplier } from "../src"
import { ids, verifyClient } from "./_setup"

describe("Multipliers", () => {
	describe("clearAllMultipliers()", () => {
		test("clears all multipliers", async () => {
			const client = await verifyClient()
			await client.multipliers.clearAllMultipliers(ids.server)

			const multipliers = await client.multipliers.getMultipliers(ids.server)
			expect(multipliers.multipliers).toHaveLength(0)
		})
	})

	describe("createMultiplier()", () => {
		test("creates role multiplier", async () => {
			const client = await verifyClient()

			const roleMultiplierData: RoleMultiplier = {
				type: "role",
				guildId: ids.server,
				roleId: ids.roles["Role 1"],
				multiplier: 1.5
			}
			await client.multipliers.createMultiplier(ids.server, roleMultiplierData)

			const multipliers = await client.multipliers.getMultipliers(ids.server)
			expect(multipliers.multipliers).toHaveLength(1)
			const firstMultiplier = multipliers.multipliers[0]
			if (!("roleId" in firstMultiplier))
				throw new Error("Role multiplier isn't a role multiplier")
			expect(firstMultiplier.roleId).toBe(ids.roles["Role 1"])
			expect(firstMultiplier.multiplier).toBe(1.5)
		})

		test("creates channel multiplier", async () => {
			const client = await verifyClient()

			const channelMultiplierData: ChannelMultiplier = {
				type: "channel",
				guildId: ids.server,
				channelId: ids.channel,
				multiplier: 2
			}
			await client.multipliers.createMultiplier(
				ids.server,
				channelMultiplierData
			)

			const multipliers = await client.multipliers.getMultipliers(ids.server)
			expect(multipliers.multipliers).toHaveLength(2)
		})
	})

	describe("getMultiplier()", () => {
		test("gets specific multiplier", async () => {
			const client = await verifyClient()

			const roleMultiplier = await client.multipliers.getMultiplier(
				ids.server,
				"role",
				ids.roles["Role 1"]
			)
			if (!("roleId" in roleMultiplier))
				throw new Error("Role multiplier isn't a role multiplier")
			expect(roleMultiplier.roleId).toBe(ids.roles["Role 1"])
			expect(roleMultiplier.multiplier).toBe(1.5)
		})
	})

	describe("getMultipliers()", () => {
		test("gets all multipliers", async () => {
			const client = await verifyClient()
			const multipliers = await client.multipliers.getMultipliers(ids.server)
			expect(Array.isArray(multipliers.multipliers)).toBe(true)
		})
	})
})
