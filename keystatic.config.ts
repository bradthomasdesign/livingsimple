import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: { owner: 'bradthomasdesign', name: 'livingsimple' },
  },
  ui: {
    brand: { name: 'Living Simple — CMS' },
  },
  collections: {
    blog: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true }),
        date: fields.date({ label: 'Date' }),
        readingTime: fields.integer({ label: 'Reading Time (minutes)', defaultValue: 5 }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Minimalism', value: 'minimalism' },
            { label: 'Tiny Living', value: 'tiny-living' },
            { label: 'Mindfulness', value: 'mindfulness' },
            { label: 'Sustainability', value: 'sustainability' },
            { label: 'Essays', value: 'essays' },
          ],
          defaultValue: 'essays',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.fields.value.value ?? 'Tag',
        }),
        author: fields.text({ label: 'Author Slug', defaultValue: 'living-simple' }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
        content: fields.mdx({ label: 'Content' }),
      },
    }),
  },
});
