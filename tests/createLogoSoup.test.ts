import { describe, test, expect } from "bun:test";
import { createLogoSoup } from "../src/createLogoSoup";

const createMockImageClass = (width: number, height: number) => {
  return class MockImage {
    crossOrigin = "";
    src = "";
    naturalWidth = width;
    naturalHeight = height;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    constructor() {
      setTimeout(() => {
        if (this.onload) this.onload();
      }, 0);
    }
  } as unknown as typeof Image;
};

const originalImage = globalThis.Image;

describe("createLogoSoup", () => {
  test("returns an HTMLDivElement", async () => {
    globalThis.Image = createMockImageClass(100, 100);

    const el = await createLogoSoup({
      logos: ["https://example.com/logo.png"],
    });

    expect(el).toBeInstanceOf(HTMLDivElement);

    globalThis.Image = originalImage;
  });

  test("creates img elements for each logo", async () => {
    globalThis.Image = createMockImageClass(100, 100);

    const el = await createLogoSoup({
      logos: [
        "https://example.com/logo1.png",
        "https://example.com/logo2.png",
      ],
    });

    const imgs = el.querySelectorAll("img");
    expect(imgs.length).toBe(2);

    globalThis.Image = originalImage;
  });

  test("applies className to container", async () => {
    globalThis.Image = createMockImageClass(100, 100);

    const el = await createLogoSoup({
      logos: ["https://example.com/logo.png"],
      className: "my-logos",
    });

    expect(el.className).toBe("my-logos");

    globalThis.Image = originalImage;
  });

  test("applies custom styles to container", async () => {
    globalThis.Image = createMockImageClass(100, 100);

    const el = await createLogoSoup({
      logos: ["https://example.com/logo.png"],
      style: { backgroundColor: "red" },
    });

    expect(el.style.backgroundColor).toBe("red");

    globalThis.Image = originalImage;
  });

  test("wraps each logo in an inline-block span", async () => {
    globalThis.Image = createMockImageClass(100, 100);

    const el = await createLogoSoup({
      logos: ["https://example.com/logo.png"],
    });

    const span = el.querySelector("span");
    expect(span).not.toBeNull();
    expect(span!.style.display).toBe("inline-block");

    globalThis.Image = originalImage;
  });

  test("returns empty div for empty logos", async () => {
    const el = await createLogoSoup({ logos: [] });

    expect(el).toBeInstanceOf(HTMLDivElement);
    expect(el.children.length).toBe(0);
  });

  test("calls onNormalized with processed logos", async () => {
    globalThis.Image = createMockImageClass(100, 100);

    let normalizedResult: unknown = null;
    await createLogoSoup({
      logos: ["https://example.com/logo.png"],
      onNormalized: (logos) => {
        normalizedResult = logos;
      },
    });

    expect(normalizedResult).not.toBeNull();
    expect(Array.isArray(normalizedResult)).toBe(true);

    globalThis.Image = originalImage;
  });

  test("uses custom renderImage function", async () => {
    globalThis.Image = createMockImageClass(100, 100);

    const el = await createLogoSoup({
      logos: ["https://example.com/logo.png"],
      renderImage: (props) => {
        const picture = document.createElement("picture");
        const img = document.createElement("img");
        img.src = props.src;
        img.alt = props.alt;
        picture.appendChild(img);
        return picture;
      },
    });

    const picture = el.querySelector("picture");
    expect(picture).not.toBeNull();

    globalThis.Image = originalImage;
  });

  test("outerHTML produces a string for DOM insertion", async () => {
    globalThis.Image = createMockImageClass(100, 100);

    const el = await createLogoSoup({
      logos: ["https://example.com/logo.png"],
    });

    const html = el.outerHTML;
    expect(typeof html).toBe("string");
    expect(html).toContain("<div");
    expect(html).toContain("<img");

    globalThis.Image = originalImage;
  });
});
