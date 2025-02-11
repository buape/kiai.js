import { describe, expect, test } from "bun:test"
import { verifyClient, ids } from "./_setup"

describe("Denylist", () => {
	test("CRUD operations", async () => {
		const client = await verifyClient()

		// Clear any existing denylists first
		await client.denylist.deleteAllDenylists(ids.server)

		// Get denylists (should be empty)
		const initialDenylists = await client.denylist.getDenylists(ids.server)
		expect(initialDenylists.users).toHaveLength(0)
		expect(initialDenylists.roles).toHaveLength(0)
		expect(initialDenylists.channels).toHaveLength(0)

		// Create a role denylist
		await client.denylist.createDenylist(ids.server, {
			type: "role",
			id: ids.roles["Role 1"]
		})

		// Get denylists (should have one)
		const denylistsAfterCreate = await client.denylist.getDenylists(ids.server)
		expect(denylistsAfterCreate.roles).toHaveLength(1)
		expect(denylistsAfterCreate.roles[0].roleId).toBe(ids.roles["Role 1"])

		// Create a user denylist
		await client.denylist.createDenylist(ids.server, {
			type: "user",
			id: ids.users.buape
		})

		// Get denylists (should have two)
		const denylistsAfterSecondCreate = await client.denylist.getDenylists(
			ids.server
		)
		expect(denylistsAfterSecondCreate.roles).toHaveLength(1)
		expect(denylistsAfterSecondCreate.users).toHaveLength(1)

		// Delete first denylist
		await client.denylist.deleteDenylistById(
			ids.server,
			"role",
			ids.roles["Role 1"]
		)

		// Get denylists (should have one)
		const denylistsAfterDelete = await client.denylist.getDenylists(ids.server)
		expect(denylistsAfterDelete.roles).toHaveLength(0)
		expect(denylistsAfterDelete.users).toHaveLength(1)
		expect(denylistsAfterDelete.users[0].userId).toBe(ids.users.buape)

		// Clear all denylists
		await client.denylist.deleteAllDenylists(ids.server)

		// Get denylists (should be empty)
		const finalDenylists = await client.denylist.getDenylists(ids.server)
		expect(finalDenylists.users).toHaveLength(0)
		expect(finalDenylists.roles).toHaveLength(0)
		expect(finalDenylists.channels).toHaveLength(0)
	})
})
