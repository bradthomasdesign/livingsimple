import { getCollection } from "astro:content";

const siteUrl = (
  import.meta.env.SITE_URL ||
  import.meta.env.PUBLIC_SITE_URL ||
  "https://www.livingsimple.io"
).replace(/\/$/, "");

export const authors = [
  {
    slug: "living-simple",
    name: "Living Simple",
    bio: "Writing about intentional living, minimalism, and finding more in less.",
    longBio:
      "Living Simple is a space for anyone drawn to a quieter, more intentional life — whether that means downsizing, decluttering, slowing down, or just asking what actually matters. Essays, reflections, and practical ideas published regularly.",
    avatar: "/images/avatar.jpg",
  },
];

export const categories = [
  { slug: "minimalism", name: "Minimalism" },
  { slug: "tiny-living", name: "Tiny Living" },
  { slug: "mindfulness", name: "Mindfulness" },
  { slug: "sustainability", name: "Sustainability" },
  { slug: "essays", name: "Essays" },
];

export const tags = [
  { slug: "minimalism", name: "Minimalism" },
  { slug: "decluttering", name: "Decluttering" },
  { slug: "tiny-house", name: "Tiny House" },
  { slug: "meditation", name: "Meditation" },
  { slug: "intentional-living", name: "Intentional Living" },
  { slug: "sustainability", name: "Sustainability" },
  { slug: "slow-living", name: "Slow Living" },
  { slug: "wellness", name: "Wellness" },
];

const isoDate = (date) => date?.toISOString().slice(0, 10);

export const imageSrc = (image) => (typeof image === "string" ? image : image?.src);

export const normalizePost = (entry) => ({
  slug: entry.id,
  ...entry.data,
  date: isoDate(entry.data.date),
  updated: isoDate(entry.data.updated),
});

export const posts = async () => (await getCollection("blog")).map(normalizePost);

export const getPost = async (slug) => (await posts()).find((post) => post.slug === slug);
export const getAuthor = (slug) => authors.find((author) => author.slug === slug);
export const getCategory = (slug) => categories.find((category) => category.slug === slug);
export const getTag = (slug) => tags.find((tag) => tag.slug === slug);
export const postsByCategory = async (slug) =>
  (await sortedPosts()).filter((post) => post.category === slug);
export const postsByTag = async (slug) =>
  (await sortedPosts()).filter((post) => post.tags.includes(slug));
export const postsByAuthor = async (slug) =>
  (await sortedPosts()).filter((post) => post.author === slug);
export const sortedPosts = async () =>
  [...(await posts())].sort((a, b) => (a.date < b.date ? 1 : -1));
export const featuredPost = async () => {
  const sorted = await sortedPosts();
  return sorted.find((post) => post.featured) ?? sorted[0];
};
export const popularPosts = async () => (await sortedPosts()).slice(0, 4);
export const relatedPosts = async (post, n = 3) =>
  (await sortedPosts())
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((a, b) => {
      const score = (candidate) =>
        (candidate.category === post.category ? 2 : 0) +
        candidate.tags.filter((tag) => post.tags.includes(tag)).length;
      return score(b) - score(a);
    })
    .slice(0, n);

export const adjacentPosts = async (post) => {
  const sorted = await sortedPosts();
  const index = sorted.findIndex((candidate) => candidate.slug === post.slug);
  return { prev: sorted[index + 1], next: sorted[index - 1] };
};

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const SITE = {
  name: "Living Simple",
  description:
    "A blog about minimalism, tiny living, mindfulness, and the art of doing more with less.",
  url: siteUrl,
};
