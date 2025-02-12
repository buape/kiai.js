import { afterAll, beforeEach, describe, expect, test } from "bun:test"
import { ids, verifyClient } from "./_setup"

describe("Denylist", () => {
	beforeEach(async () => {
		const client = await verifyClient()
		await client.denylist.deleteAllDenylists(ids.server)
	})

	describe("deleteAllDenylists()", () => {
		test("clears all denylists", async () => {
			const client = await verifyClient()
			await client.denylist.deleteAllDenylists(ids.server)

			const denylists = await client.denylist.getDenylists(ids.server)
			expect(denylists.users).toHaveLength(0)
			expect(denylists.roles).toHaveLength(0)
			expect(denylists.channels).toHaveLength(0)
		})
	})

	describe("createDenylist()", () => {
		test("creates role denylist", async () => {
			const client = await verifyClient()

			await client.denylist.createDenylist(ids.server, {
				type: "role",
				id: ids.roles["Role 1"]
			})

			const denylists = await client.denylist.getDenylists(ids.server)
			expect(denylists.roles).toHaveLength(1)
			expect(denylists.roles[0].roleId).toBe(ids.roles["Role 1"])
		})

		test("creates user denylist", async () => {
			const client = await verifyClient()

			await client.denylist.createDenylist(ids.server, {
				type: "user",
				id: ids.users.buape
			})

			const denylists = await client.denylist.getDenylists(ids.server)
			expect(denylists.users).toHaveLength(1)
			expect(denylists.users[0].userId).toBe(ids.users.buape)
		})

		test("creates channel denylist", async () => {
			const client = await verifyClient()

			await client.denylist.createDenylist(ids.server, {
				type: "channel",
				id: ids.channel
			})

			const denylists = await client.denylist.getDenylists(ids.server)
			expect(denylists.channels).toHaveLength(1)
			expect(denylists.channels[0].channelId).toBe(ids.channel)
		})
	})

	describe("deleteDenylistById()", () => {
		test("deletes specific role denylist", async () => {
			const client = await verifyClient()

			// Create a role denylist
			await client.denylist.createDenylist(ids.server, {
				type: "role",
				id: ids.roles["Role 1"]
			})

			await client.denylist.deleteDenylistById(
				ids.server,
				"role",
				ids.roles["Role 1"]
			)

			const denylists = await client.denylist.getDenylists(ids.server)
			expect(denylists.roles).toHaveLength(0)
		})

		test("deletes specific user denylist", async () => {
			const client = await verifyClient()

			// Create a user denylist
			await client.denylist.createDenylist(ids.server, {
				type: "user",
				id: ids.users.buape
			})

			await client.denylist.deleteDenylistById(
				ids.server,
				"user",
				ids.users.buape
			)

			const denylists = await client.denylist.getDenylists(ids.server)
			expect(denylists.users).toHaveLength(0)
		})

		test("deletes specific channel denylist", async () => {
			const client = await verifyClient()

			// Create a channel denylist
			await client.denylist.createDenylist(ids.server, {
				type: "channel",
				id: ids.channel
			})

			await client.denylist.deleteDenylistById(
				ids.server,
				"channel",
				ids.channel
			)

			const denylists = await client.denylist.getDenylists(ids.server)
			expect(denylists.channels).toHaveLength(0)
		})

		test("deletes specific denylist by internal id", async () => {
			const client = await verifyClient()

			// Create a new denylist to get its internal ID
			const created = await client.denylist.createDenylist(ids.server, {
				type: "role",
				id: ids.roles["Role 1"]
			})

			await client.denylist.deleteDenylistById(
				ids.server,
				"internal",
				created.id
			)

			const denylists = await client.denylist.getDenylists(ids.server)
			expect(denylists.roles).toHaveLength(0)
		})
	})

	describe("getDenylists()", () => {
		test("gets all denylists", async () => {
			const client = await verifyClient()
			const denylists = await client.denylist.getDenylists(ids.server)
			expect(Array.isArray(denylists.users)).toBe(true)
			expect(Array.isArray(denylists.roles)).toBe(true)
			expect(Array.isArray(denylists.channels)).toBe(true)
		})
	})

	describe("deleteAllDenylistsByType()", () => {
		test("deletes all role denylists", async () => {
			const client = await verifyClient()

			// Create denylists of different types
			await client.denylist.createDenylist(ids.server, {
				type: "role",
				id: ids.roles["Role 1"]
			})
			await client.denylist.createDenylist(ids.server, {
				type: "role",
				id: ids.roles["Role 2"]
			})
			await client.denylist.createDenylist(ids.server, {
				type: "user",
				id: ids.users.buape
			})
			await client.denylist.createDenylist(ids.server, {
				type: "channel",
				id: ids.channel
			})

			// Delete all role denylists
			const deleteResult = await client.denylist.deleteAllDenylistsByType(
				ids.server,
				"role"
			)
			expect(deleteResult.count).toBe(2)

			const denylists = await client.denylist.getDenylists(ids.server)
			expect(denylists.roles).toHaveLength(0)
			expect(denylists.users).toHaveLength(1)
			expect(denylists.channels).toHaveLength(1)
		})

		test("deletes all user denylists", async () => {
			const client = await verifyClient()

			// Create multiple user denylists
			await client.denylist.createDenylist(ids.server, {
				type: "user",
				id: ids.users.buape
			})
			await client.denylist.createDenylist(ids.server, {
				type: "channel",
				id: ids.channel
			})

			// Delete all user denylists
			const deleteResult = await client.denylist.deleteAllDenylistsByType(
				ids.server,
				"user"
			)
			expect(deleteResult.count).toBe(1)

			const denylists = await client.denylist.getDenylists(ids.server)
			expect(denylists.users).toHaveLength(0)
			expect(denylists.channels).toHaveLength(1)
		})

		test("deletes all channel denylists", async () => {
			const client = await verifyClient()

			// Create multiple channel denylists
			await client.denylist.createDenylist(ids.server, {
				type: "channel",
				id: ids.channel
			})

			// Delete all channel denylists
			const deleteResult = await client.denylist.deleteAllDenylistsByType(
				ids.server,
				"channel"
			)
			expect(deleteResult.count).toBe(1)

			const denylists = await client.denylist.getDenylists(ids.server)
			expect(denylists.channels).toHaveLength(0)
		})
	})

	afterAll(async () => {
		const client = await verifyClient()
		await client.denylist.deleteAllDenylists(ids.server)
	})
})
