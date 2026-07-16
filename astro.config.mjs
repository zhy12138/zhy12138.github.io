import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

export default defineConfig({
  site: 'https://zhy12138.github.io',
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['pseudocode', 'pseudo'],
    },
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
});
