import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

import starlight from "@astrojs/starlight";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    starlight({
      title: "My delightful docs site",
      customCss: ["./src/styles/custom.css"],
    }),
    mdx(),
  ],
});

