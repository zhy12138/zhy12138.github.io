import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;
export type TagSummary = {
  tag: string;
  count: number;
};
export type AdjacentBlogPosts = {
  previous?: BlogPost;
  next?: BlogPost;
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

function sortPostsChronologically(a: BlogPost, b: BlogPost) {
  const dateDiff = a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
  if (dateDiff !== 0) return dateDiff;
  return getSlug(a.id).localeCompare(getSlug(b.id), 'zh-CN');
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

export function getAdjacentPostsBySharedNonFunctionalTag(
  currentPost: BlogPost,
  posts: BlogPost[]
): AdjacentBlogPosts {
  const currentTags = new Set(currentPost.data.tags.filter((tag) => !isFunctionalTag(tag)));
  if (currentTags.size === 0) return {};

  const relatedPosts = posts
    .filter((post) => {
      if (post.data.draft) return false;
      if (post.id === currentPost.id) return true;
      return post.data.tags.some((tag) => currentTags.has(tag));
    })
    .sort(sortPostsChronologically);
  const currentIndex = relatedPosts.findIndex((post) => post.id === currentPost.id);

  if (currentIndex < 0) return {};

  return {
    previous: relatedPosts[currentIndex - 1],
    next: relatedPosts[currentIndex + 1],
  };
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
