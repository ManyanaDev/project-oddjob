import type { CollectionConfig } from 'payload'

export const markAsComplete: CollectionConfig['fields'] = [
  {
    name: 'markAsComplete',
    type: 'ui',
    label: 'Mark as complete',
    admin: {
      components: {
        Field: '@/components/mark-as-complete/server/Field#MarkAsComplete',
        Label: '@/components/mark-as-complete/server/Label#MarkAsComplete',
      },
    },
  },
]
