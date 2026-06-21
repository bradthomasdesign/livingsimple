import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import vercel from "@astrojs/vercel";

const site =
  process.env.SITE_URL || process.env.PUBLIC_SITE_URL || "https://www.livingsimple.io";

export default defineConfig({
  site,
  adapter: vercel(),
  integrations: [mdx(), react(), keystatic()],
  vite: {
    plugins: [tailwindcss()],
  },
});
