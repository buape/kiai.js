import { describe, expect, test, afterAll } from "bun:test"
import { ids, verifyClient } from "./_setup"

describe("Denylist", () => {
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
			expect(denylists.roles).toHaveLength(1)
			expect(denylists.users).toHaveLength(1)
			expect(denylists.users[0].userId).toBe(ids.users.buape)
		})
	})

	describe("deleteDenylistById()", () => {
		test("deletes specific denylist", async () => {
			const client = await verifyClient()

			await client.denylist.deleteDenylistById(
				ids.server,
				"role",
				ids.roles["Role 1"]
			)

			const denylists = await client.denylist.getDenylists(ids.server)
			expect(denylists.roles).toHaveLength(0)
			expect(denylists.users).toHaveLength(1)
			expect(denylists.users[0].userId).toBe(ids.users.buape)
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

	afterAll(async () => {
		const client = await verifyClient()
		await client.denylist.deleteAllDenylists(ids.server)
	})
})
