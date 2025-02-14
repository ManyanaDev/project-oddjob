import type { CollectionBeforeChangeHook, CollectionConfig, PayloadRequest } from 'payload'
import type { Task, User } from '@/payload-types'
/**
 * USer can be:
 * - Child
 * - Parent
 * - Teacher
 * - Adult
 * - Admin
 */
function canCreate({ roles }: { roles: User['role'][] }, req: PayloadRequest) {
  if (!req.user) {
    return false
  }
  if (roles.includes(req.user.role)) {
    return true
  }
  return false
}

const updateAssignedBy: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (req.user?.role === 'parent') {
    data.assignedBy = req.user.id
  }
  return data
}

const updateCompletedOn: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (data.status === 'completed') {
    data.completedOn = new Date()
  } else {
    data.completedOn = null
  }
  return data
}

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req }) => canCreate({ roles: ['parent', 'admin'] }, req),
  },
  hooks: {
    beforeChange: [updateAssignedBy, updateCompletedOn],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        // belongs to child
        // {
        //   name: 'child',
        //   type: 'relationship',
        //   relationTo: 'users',
        //   hasMany: false,
        //   required: true,
        //   filterOptions: ({ user }) => {
        //     if (!user) {
        //       return false
        //     }

        //     return {
        //       role: {
        //         equals: 'child',
        //       },
        //     }
        //   },
        // },
        // reward
        {
          name: 'reward',
          type: 'number',
          defaultValue: 0,
          min: 0,
          max: 100,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        // points
        {
          name: 'points',
          type: 'number',
        },
      ],
    },

    // description
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
