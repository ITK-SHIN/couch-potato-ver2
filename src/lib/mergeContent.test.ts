import { describe, expect, it } from "vitest";
import { mergeSiteContent } from "./mergeContent";

describe("mergeSiteContent", () => {
  it("fills defaults for empty partial", () => {
    const merged = mergeSiteContent({});
    expect(merged.hero.title).toBeTruthy();
    expect(merged.portfolio.items.length).toBeGreaterThan(0);
  });

  it("merges process step imageFit default", () => {
    const merged = mergeSiteContent({
      process: {
        title: "T",
        subtitle: "S",
        steps: [
          {
            num: "01",
            title: "A",
            sub: "B",
            image: "http://x",
            items: [],
          },
        ],
      },
    });
    expect(merged.process.steps[0].imageFit).toBe("cover");
  });
});
