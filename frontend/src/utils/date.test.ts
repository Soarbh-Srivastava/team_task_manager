import { describe, expect, it } from "vitest";
import { formatDateIso } from "./date";

describe("date utils", () => {
  it("formats ISO strings into locale dates", () => {
    expect(formatDateIso("2026-05-03T00:00:00.000Z")).toBeTruthy();
  });

  it("returns an empty string for missing values", () => {
    expect(formatDateIso(undefined)).toBe("");
  });
});
