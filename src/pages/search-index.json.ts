import { getCollection, render } from 'astro:content';
import { getSlug } from '../lib/blog';

function plainText(markdown: string) {
  return markdown
    .replace(/^---[\s\S]*?---/m, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_>#|~-]/g, ' ')
    .replace(/\$+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sectionTexts(markdown: string) {
  const parts = markdown.split(/^#{1,6}\s+.+$/gm);
  return parts.slice(1).map((part) => plainText(part));
}

export async function GET() {
  const posts = (await getCollection('blog')).filter(
    (post) => !post.data.draft && !post.data.tags.includes('demo')
  );
  const index = await Promise.all(posts.map(async (post) => {
    const { headings } = await render(post);
    const sections = sectionTexts(post.body ?? '');
    return {
      slug: getSlug(post.id),
      title: post.data.title,
      description: post.data.description,
      tags: post.data.tags,
      body: plainText(post.body ?? ''),
      sections: headings.map((heading, index) => ({
        heading: heading.text,
        anchor: heading.slug,
        text: sections[index] ?? '',
      })),
    };
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
