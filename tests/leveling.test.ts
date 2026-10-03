import { describe, expect, test } from "bun:test"
import { ids, verifyClient } from "./_setup"

describe("Leveling", () => {
	describe("XP Management", () => {
		describe("getMember()", () => {
			test("gets member XP data", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape
				const member = await client.leveling.getMember(ids.server, userId)
				if (member === null) throw new Error("Member data not found")
				expect(member.xp).toBeDefined()
			})
		})

		describe("addXp()", () => {
			test("adds XP to member", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape
				const initialMember = await client.leveling.getMember(
					ids.server,
					userId
				)
				if (initialMember === null) throw new Error("Member data not found")
				const initialXp = initialMember.xp

				await client.leveling.addXp(ids.server, userId, 100)
				const memberAfterAdd = await client.leveling.getMember(
					ids.server,
					userId
				)
				if (memberAfterAdd === null)
					throw new Error("Member data not found after adding XP")
				expect(memberAfterAdd.xp).toBe(initialXp + 100)
			})

			test("rejects XP below the v3 minimum", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape

				expect(client.leveling.addXp(ids.server, userId, -100)).rejects.toThrow(
					"XP must be greater than 0 and at most 100000000"
				)
			})

			test("accepts fractional XP", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape

				await client.leveling.addXp(ids.server, userId, 10.5)
				await client.leveling.removeXp(ids.server, userId, 10.5)
			})
		})

		describe("removeXp()", () => {
			test("removes XP from member", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape
				const initialMember = await client.leveling.getMember(
					ids.server,
					userId
				)
				if (initialMember === null) throw new Error("Member data not found")
				const initialXp = initialMember.xp

				await client.leveling.removeXp(ids.server, userId, 50)
				const memberAfterRemove = await client.leveling.getMember(
					ids.server,
					userId
				)
				if (memberAfterRemove === null)
					throw new Error("Member data not found after removing XP")
				expect(memberAfterRemove.xp).toBe(initialXp - 50)
			})

			test("rejects XP below the v3 minimum", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape

				expect(
					client.leveling.removeXp(ids.server, userId, -50)
				).rejects.toThrow("XP must be greater than 0 and at most 100000000")
			})

			test("accepts fractional XP", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape

				await client.leveling.removeXp(ids.server, userId, 25.5)
				await client.leveling.addXp(ids.server, userId, 25.5)
			})
		})

		describe("setXp()", () => {
			test("sets member XP to specific value", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape

				await client.leveling.setXp(ids.server, userId, 1000)
				const memberAfterSet = await client.leveling.getMember(
					ids.server,
					userId
				)
				if (memberAfterSet === null)
					throw new Error("Member data not found after setting XP")
				expect(memberAfterSet.xp).toBe(1000)
			})

			test("throws error for negative XP", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape

				expect(
					client.leveling.setXp(ids.server, userId, -1000)
				).rejects.toThrow("XP must be between 0 and 100000000")
			})

			test("accepts fractional XP", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape
				const member = await client.leveling.getMember(ids.server, userId)
				if (member === null) throw new Error("Member data not found")

				await client.leveling.setXp(ids.server, userId, 500.5)
				const memberAfterSet = await client.leveling.getMember(
					ids.server,
					userId
				)
				if (memberAfterSet === null)
					throw new Error("Member data not found after setting XP")
				expect(memberAfterSet.xp).toBe(500.5)
				await client.leveling.setXp(ids.server, userId, member.xp)
			})

			test("allows setting XP to zero", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape

				await client.leveling.setXp(ids.server, userId, 0)
				const memberAfterSet = await client.leveling.getMember(
					ids.server,
					userId
				)
				if (memberAfterSet === null)
					throw new Error("Member data not found after setting XP")
				expect(memberAfterSet.xp).toBe(0)
			})
		})
	})

	describe("Leaderboard", () => {
		describe("getLeaderboard()", () => {
			test("gets full leaderboard when no parameters provided", async () => {
				const client = await verifyClient()
				const fullLeaderboard = await client.leveling.getLeaderboard(
					ids.server,
					undefined,
					undefined
				)
				expect(Array.isArray(fullLeaderboard)).toBe(true)
			})

			test("gets leaderboard with start index only", async () => {
				const client = await verifyClient()
				const leaderboardWithStart = await client.leveling.getLeaderboard(
					ids.server,
					1,
					undefined
				)
				expect(Array.isArray(leaderboardWithStart)).toBe(true)
			})

			test("gets leaderboard with end index only", async () => {
				const client = await verifyClient()
				const leaderboardWithEnd = await client.leveling.getLeaderboard(
					ids.server,
					undefined,
					10
				)
				expect(Array.isArray(leaderboardWithEnd)).toBe(true)
				expect(leaderboardWithEnd.length).toBeLessThanOrEqual(10)
			})

			test("gets leaderboard with both start and end index", async () => {
				const client = await verifyClient()
				const leaderboardWithRange = await client.leveling.getLeaderboard(
					ids.server,
					1,
					5
				)
				expect(Array.isArray(leaderboardWithRange)).toBe(true)
				expect(leaderboardWithRange.length).toBeLessThanOrEqual(4) // 5 - 1 = 4 entries
			})

			test("throws error for negative start index", async () => {
				const client = await verifyClient()
				expect(
					client.leveling.getLeaderboard(ids.server, -1, undefined)
				).rejects.toThrow("start must be a positive integer")
			})

			test("throws error for negative end index", async () => {
				const client = await verifyClient()
				expect(
					client.leveling.getLeaderboard(ids.server, undefined, -1)
				).rejects.toThrow("end must be a positive integer")
			})
		})
	})
})
