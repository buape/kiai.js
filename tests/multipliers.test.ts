import { afterAll, beforeEach, describe, expect, test } from "bun:test"
import type { ChannelMultiplier, Multiplier, RoleMultiplier } from "../src"
import { ids, verifyClient } from "./_setup"

describe("Multipliers", () => {
	beforeEach(async () => {
		const client = await verifyClient()
		await client.multipliers.clearAllMultipliers(ids.server)
	})

	describe("clearAllMultipliers()", () => {
		test("clears all multipliers", async () => {
			const client = await verifyClient()
			await client.multipliers.clearAllMultipliers(ids.server)

			const multipliers = await client.multipliers.getMultipliers(ids.server)
			expect(multipliers.multipliers).toHaveLength(0)
		})
	})

	describe("createMultiplier()", () => {
		test("creates role multiplier with standard value", async () => {
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

		test("creates role multiplier with high value", async () => {
			const client = await verifyClient()

			const roleMultiplierData: RoleMultiplier = {
				type: "role",
				guildId: ids.server,
				roleId: ids.roles["Role 2"],
				multiplier: 5.0
			}
			await client.multipliers.createMultiplier(ids.server, roleMultiplierData)

			const multipliers = await client.multipliers.getMultipliers(ids.server)
			expect(multipliers.multipliers).toHaveLength(1)
			const highMultiplier = multipliers.multipliers[0]
			if (!("roleId" in highMultiplier))
				throw new Error("Role multiplier not found")
			expect(highMultiplier.roleId).toBe(ids.roles["Role 2"])
			expect(highMultiplier.multiplier).toBe(5.0)
		})

		test("creates channel multiplier with standard value", async () => {
			const client = await verifyClient()

			const channelMultiplierData: ChannelMultiplier = {
				type: "channel",
				guildId: ids.server,
				channelId: ids.channel,
				multiplier: 2.0
			}
			await client.multipliers.createMultiplier(
				ids.server,
				channelMultiplierData
			)

			const multipliers = await client.multipliers.getMultipliers(ids.server)
			expect(multipliers.multipliers).toHaveLength(1)
			const channelMultiplier = multipliers.multipliers[0]
			if (!("channelId" in channelMultiplier))
				throw new Error("Channel multiplier not found")
			expect(channelMultiplier.channelId).toBe(ids.channel)
			expect(channelMultiplier.multiplier).toBe(2.0)
		})

		test("creates channel multiplier with low value", async () => {
			const client = await verifyClient()

			const channelMultiplierData: ChannelMultiplier = {
				type: "channel",
				guildId: ids.server,
				channelId: ids.channel,
				multiplier: 0.5
			}
			await client.multipliers.createMultiplier(
				ids.server,
				channelMultiplierData
			)

			const multipliers = await client.multipliers.getMultipliers(ids.server)
			expect(multipliers.multipliers).toHaveLength(1)
			const lowMultiplier = multipliers.multipliers[0]
			if (!("channelId" in lowMultiplier))
				throw new Error("Channel multiplier not found")
			expect(lowMultiplier.channelId).toBe(ids.channel)
			expect(lowMultiplier.multiplier).toBe(0.5)
		})
	})

	describe("getMultiplier()", () => {
		test("gets specific role multiplier", async () => {
			const client = await verifyClient()

			// Create a role multiplier first
			const roleMultiplierData: RoleMultiplier = {
				type: "role",
				guildId: ids.server,
				roleId: ids.roles["Role 1"],
				multiplier: 1.5
			}
			await client.multipliers.createMultiplier(ids.server, roleMultiplierData)

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

		test("gets specific channel multiplier", async () => {
			const client = await verifyClient()

			// Create a channel multiplier first
			const channelMultiplierData: ChannelMultiplier = {
				type: "channel",
				guildId: ids.server,
				channelId: ids.channel,
				multiplier: 2.0
			}
			await client.multipliers.createMultiplier(
				ids.server,
				channelMultiplierData
			)

			const channelMultiplier = await client.multipliers.getMultiplier(
				ids.server,
				"channel",
				ids.channel
			)
			if (!("channelId" in channelMultiplier))
				throw new Error("Channel multiplier isn't a channel multiplier")
			expect(channelMultiplier.channelId).toBe(ids.channel)
			expect(channelMultiplier.multiplier).toBe(2.0)
		})

		test("gets multiplier by internal id", async () => {
			const client = await verifyClient()

			// Create a multiplier first
			const roleMultiplierData: RoleMultiplier = {
				type: "role",
				guildId: ids.server,
				roleId: ids.roles["Role 1"],
				multiplier: 1.5
			}
			const created = (await client.multipliers.createMultiplier(
				ids.server,
				roleMultiplierData
			)) as Multiplier & { id: string }

			const retrievedMultiplier = await client.multipliers.getMultiplier(
				ids.server,
				"internal",
				created.id
			)
			expect(retrievedMultiplier.multiplier).toBe(1.5)
		})
	})

	describe("getMultipliers()", () => {
		test("gets all multipliers", async () => {
			const client = await verifyClient()
			const multipliers = await client.multipliers.getMultipliers(ids.server)
			expect(Array.isArray(multipliers.multipliers)).toBe(true)
		})
	})

	afterAll(async () => {
		const client = await verifyClient()
		await client.multipliers.clearAllMultipliers(ids.server)
	})
})
