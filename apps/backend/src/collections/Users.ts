import type { CollectionConfig } from 'payload'

/**
 * USer can be:
 * - Child
 * - Parent
 * - Teacher
 * - Adult
 * - Admin
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    components: {
      views: {
        edit: {
          customView: {
            Component: '@/components/children/edit/server/View#View',
            path: '/chores',
            tab: {
              href: '/chores',
              label: 'Chores',
            },
          },
        },
      },
    },
  },
  auth: true,
  access: {
    read: () => true,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Parent', value: 'parent' },
        { label: 'Child', value: 'child' },
        { label: 'Teacher', value: 'teacher' },
        { label: 'Adult', value: 'adult' },
        { label: 'Admin', value: 'admin' },
      ],
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
