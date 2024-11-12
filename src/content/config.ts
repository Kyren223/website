import { defineCollection, z } from "astro:content";

export const collections = {
  blogs: defineCollection({
    type: "content",
  }),
};
