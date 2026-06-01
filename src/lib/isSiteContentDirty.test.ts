import { describe, expect, it } from "vitest";
import { defaultSiteContent } from "../data/defaultSiteContent";
import { isSiteContentDirty } from "./isSiteContentDirty";

describe("isSiteContentDirty", () => {
  it("returns false for identical content", () => {
    expect(isSiteContentDirty(defaultSiteContent, defaultSiteContent)).toBe(
      false
    );
  });

  it("returns true when draft differs", () => {
    const draft = {
      ...defaultSiteContent,
      hero: { ...defaultSiteContent.hero, title: "CHANGED" },
    };
    expect(isSiteContentDirty(defaultSiteContent, draft)).toBe(true);
  });
});
