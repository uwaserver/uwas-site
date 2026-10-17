import type { MetadataRoute } from "next";
import { docs } from "@/lib/content";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/features/",
    "/use-cases/",
    "/architecture/",
    "/download/",
    "/docs/",
    ...docs.map((d) => `/docs/${d.slug}/`),
    "/changelog/",
    "/brand/",
    "/license/",
    "/enterprise/",
    "/privacy/",
  ].map((path) => ({
    url: `https://uwaserver.com${path}`,
    changeFrequency: path === "/changelog/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/docs/" ? 0.9 : 0.7,
  }));
}
