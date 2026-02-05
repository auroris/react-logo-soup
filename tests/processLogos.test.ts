import { describe, test, expect } from "bun:test";
import { processLogos } from "../src/processLogos";

const createMockImageClass = (width: number, height: number, shouldFail = false) => {
  return class MockImage {
    crossOrigin = "";
    src = "";
    naturalWidth = width;
    naturalHeight = height;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    constructor() {
      setTimeout(() => {
        if (shouldFail) {
          if (this.onerror) this.onerror();
        } else {
          if (this.onload) this.onload();
        }
      }, 0);
    }
  } as unknown as typeof Image;
};

const originalImage = globalThis.Image;

describe("processLogos", () => {
  test("returns empty array for empty logos", async () => {
    const result = await processLogos({ logos: [] });
    expect(result).toEqual([]);
  });

  test("normalizes logos when images load successfully", async () => {
    globalThis.Image = createMockImageClass(200, 100);

    const result = await processLogos({
      logos: [
        "https://example.com/logo1.png",
        "https://example.com/logo2.png",
      ],
      baseSize: 48,
      scaleFactor: 0.5,
    });

    expect(result).toHaveLength(2);
    expect(result[0]?.src).toBe("https://example.com/logo1.png");
    expect(result[0]?.originalWidth).toBe(200);
    expect(result[0]?.originalHeight).toBe(100);
    expect(result[0]?.normalizedWidth).toBeGreaterThan(0);
    expect(result[0]?.normalizedHeight).toBeGreaterThan(0);

    globalThis.Image = originalImage;
  });

  test("handles image load errors", async () => {
    globalThis.Image = createMockImageClass(0, 0, true);

    try {
      await processLogos({
        logos: ["https://example.com/broken.png"],
      });
      expect(true).toBe(false); // should not reach here
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }

    globalThis.Image = originalImage;
  });

  test("accepts LogoSource objects", async () => {
    globalThis.Image = createMockImageClass(100, 100);

    const result = await processLogos({
      logos: [{ src: "https://example.com/logo.png", alt: "Test Logo" }],
    });

    expect(result[0]?.alt).toBe("Test Logo");

    globalThis.Image = originalImage;
  });

  test("uses default values for baseSize and scaleFactor", async () => {
    globalThis.Image = createMockImageClass(100, 100);

    const result = await processLogos({
      logos: ["https://example.com/logo.png"],
      densityAware: false,
    });

    expect(result[0]?.normalizedWidth).toBe(48);
    expect(result[0]?.normalizedHeight).toBe(48);

    globalThis.Image = originalImage;
  });
});
