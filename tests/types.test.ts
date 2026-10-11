import { describe, expect, test } from "bun:test"
import { ApiPermission } from "../src"

describe("ApiPermission", () => {
	test("exports API permission bit flags", () => {
		expect(ApiPermission.Levels).toBe(1 << 0)
		expect(ApiPermission.Multipliers).toBe(1 << 1)
		expect(ApiPermission.Export).toBe(1 << 2)
		expect(ApiPermission.Denylist).toBe(1 << 3)
		expect(ApiPermission.Rewards).toBe(1 << 4)
	})
})
