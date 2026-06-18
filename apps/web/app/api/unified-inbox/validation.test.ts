import { describe, it, expect } from "vitest";
import { encodeCursor, decodeCursor } from "./validation";

describe("unified-inbox cursor", () => {
  it("round-trips a date and id", () => {
    const date = new Date("2026-06-18T08:00:00.000Z");
    const cursor = encodeCursor(date, "abc123");

    const decoded = decodeCursor(cursor);
    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe("abc123");
    expect(decoded?.date.toISOString()).toBe(date.toISOString());
  });

  it("returns null for invalid base64", () => {
    expect(decodeCursor("not-valid-base64-json!!!")).toBeNull();
  });

  it("returns null when the date is missing", () => {
    const bad = Buffer.from(JSON.stringify({ id: "x" })).toString("base64");
    expect(decodeCursor(bad)).toBeNull();
  });
});
