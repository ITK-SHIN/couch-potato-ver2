import { describe, expect, it } from "vitest";
import { defaultSiteContent } from "../data/defaultSiteContent";
import { resolveSeoMeta } from "./siteSeo";

describe("resolveSeoMeta", () => {
  it("uses hero fields when seo is empty", () => {
    const meta = resolveSeoMeta(defaultSiteContent);
    expect(meta.title).toContain("COUCHPOTATO");
    expect(meta.description).toBe(defaultSiteContent.hero.description);
    expect(meta.ogImage).toBe(defaultSiteContent.hero.backgroundImage);
  });

  it("prefers explicit seo fields", () => {
    const meta = resolveSeoMeta({
      ...defaultSiteContent,
      seo: {
        title: "Custom Title",
        description: "Custom desc",
      },
    });
    expect(meta.title).toBe("Custom Title");
    expect(meta.description).toBe("Custom desc");
  });
});
