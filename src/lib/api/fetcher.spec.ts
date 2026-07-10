import { describe, it, expect, beforeEach } from "vitest";
import { getCached, setCached, clearCache } from "./cache";

describe("cache", () => {
  beforeEach(() => {
    clearCache();
  });

  it("should cache and retrieve values", () => {
    const key = "test-key";
    const value = { id: 1, name: "test" };

    setCached(key, value);
    const retrieved = getCached(key);

    expect(retrieved).toEqual(value);
  });

  it("should return undefined for missing keys", () => {
    const retrieved = getCached("nonexistent");
    expect(retrieved).toBeUndefined();
  });

  it("should clear cache", () => {
    setCached("test", { data: "value" });
    clearCache();
    expect(getCached("test")).toBeUndefined();
  });
});
