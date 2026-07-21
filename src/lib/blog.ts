import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;
export type TagSummary = {
  tag: string;
  count: number;
};

const functionalTags = new Set(['课程笔记', '地图', '专栏']);

export function getSlug(id: string) {
  return id.replace(/\.mdx?$/, '');
}

export function hasDemoTag(post: BlogPost) {
  return post.data.tags.includes('demo');
}

export function sortPostsForBlog(a: BlogPost, b: BlogPost) {
  const aIsDemo = hasDemoTag(a);
  const bIsDemo = hasDemoTag(b);

  if (aIsDemo !== bIsDemo) return aIsDemo ? 1 : -1;
  return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
}

export function getTagHref(tag: string) {
  return `/blog/tags/${encodeURIComponent(tag)}/`;
}

export function getTagClass(tag: string) {
  return {
    'is-course-note-tag': tag === '课程笔记',
    'is-map-tag': tag === '地图',
    'is-column-tag': tag === '专栏',
  };
}

export function isFunctionalTag(tag: string) {
  return functionalTags.has(tag);
}

export function sortTags(a: string, b: string) {
  const aIsFunctional = isFunctionalTag(a);
  const bIsFunctional = isFunctionalTag(b);

  if (aIsFunctional !== bIsFunctional) return aIsFunctional ? -1 : 1;
  return a.localeCompare(b, 'zh-CN');
}

export function getTagSummaries(posts: BlogPost[]) {
  const counts = new Map<string, number>();

  posts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });

  return Array.from(counts, ([tag, count]) => ({ tag, count })).sort((a, b) =>
    sortTags(a.tag, b.tag)
  );
}
