import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.zhangjiajie-national-park.com",
  trailingSlash: "always",
  integrations: [sitemap({ lastmod: new Date('2026-08-05') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
