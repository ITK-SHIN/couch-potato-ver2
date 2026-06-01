import { describe, expect, it } from "vitest";
import { parseYoutubeId } from "./youtube";

describe("parseYoutubeId", () => {
  it("parses watch URL", () => {
    expect(parseYoutubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
  });

  it("parses youtu.be", () => {
    expect(parseYoutubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("parses bare id", () => {
    expect(parseYoutubeId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("returns null for invalid", () => {
    expect(parseYoutubeId("not-a-url")).toBeNull();
  });
});
