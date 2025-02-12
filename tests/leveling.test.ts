import { describe, expect, test } from "bun:test"
import { ids, verifyClient } from "./_setup"

describe("Leveling", () => {
	describe("XP Management", () => {
		describe("getMember()", () => {
			test("gets member XP data", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape
				const member = await client.leveling.getMember(ids.server, userId)
				expect(member).toBeDefined()
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
				const initialXp = initialMember.xp

				await client.leveling.addXp(ids.server, userId, 100)
				const memberAfterAdd = await client.leveling.getMember(
					ids.server,
					userId
				)
				expect(memberAfterAdd.xp).toBe(initialXp + 100)
			})

			test("throws error for negative XP", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape

				await expect(
					client.leveling.addXp(ids.server, userId, -100)
				).rejects.toThrow("XP must be a positive integer")
			})

			test("throws error for non-integer XP", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape

				await expect(
					client.leveling.addXp(ids.server, userId, 10.5)
				).rejects.toThrow("XP must be a positive integer")
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
				const initialXp = initialMember.xp

				await client.leveling.removeXp(ids.server, userId, 50)
				const memberAfterRemove = await client.leveling.getMember(
					ids.server,
					userId
				)
				expect(memberAfterRemove.xp).toBe(initialXp - 50)
			})

			test("throws error for negative XP", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape

				await expect(
					client.leveling.removeXp(ids.server, userId, -50)
				).rejects.toThrow("XP must be a positive integer")
			})

			test("throws error for non-integer XP", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape

				await expect(
					client.leveling.removeXp(ids.server, userId, 25.5)
				).rejects.toThrow("XP must be a positive integer")
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
				expect(memberAfterSet.xp).toBe(1000)
			})

			test("throws error for negative XP", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape

				await expect(
					client.leveling.setXp(ids.server, userId, -1000)
				).rejects.toThrow("XP must be a non-negative integer")
			})

			test("throws error for non-integer XP", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape

				await expect(
					client.leveling.setXp(ids.server, userId, 500.5)
				).rejects.toThrow("XP must be a non-negative integer")
			})

			test("allows setting XP to zero", async () => {
				const client = await verifyClient()
				const userId = ids.users.buape

				await client.leveling.setXp(ids.server, userId, 0)
				const memberAfterSet = await client.leveling.getMember(
					ids.server,
					userId
				)
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
				await expect(
					client.leveling.getLeaderboard(ids.server, -1, undefined)
				).rejects.toThrow("Start parameter must be non-negative")
			})

			test("throws error for negative end index", async () => {
				const client = await verifyClient()
				await expect(
					client.leveling.getLeaderboard(ids.server, undefined, -1)
				).rejects.toThrow("End parameter must be non-negative")
			})

			test("throws error when start >= end", async () => {
				const client = await verifyClient()
				await expect(
					client.leveling.getLeaderboard(ids.server, 5, 5)
				).rejects.toThrow("Start parameter must be less than end parameter")
				await expect(
					client.leveling.getLeaderboard(ids.server, 6, 5)
				).rejects.toThrow("Start parameter must be less than end parameter")
			})
		})
	})
})
