import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "My delightful docs site",
      customCss: [
        './src/styles/custom.css',
      ],
    }),
    mdx(),
  ],
});
