import {defineArrayMember} from 'sanity'

export default {
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title of the blog post',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug of the blog post',
      type: 'slug',
      options: {
        source: 'title',
      },
    },
    {
      name: 'titleImage',
      title: 'Title image',
      type: 'image',
    },
    {
      name: 'smallDescription',
      title: 'Small Description of the blog post',
      type: 'text',
    },
    {
      name: 'content',
      title: 'Content of the blog post',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
        }),
        defineArrayMember({
          type: 'youtube',
        }),
      ],
    },
    {
      name: 'author',
      title: 'Author of the blog post',
      type: 'string',
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      options: {
        dateFormat: 'DD-MMM-YYYY',
        timeFormat: 'HH:mm A',
        timeStep: 15,
        calendarTodayLabel: 'Today',
      },
    },
  ],
  initialValue: {
    publishedAt: new Date().toISOString(),
    author: 'Shaykh Abu Remlah Aadam Al-Amreekee',
  },
}
