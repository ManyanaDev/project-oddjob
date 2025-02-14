import type { CollectionBeforeChangeHook, CollectionConfig, PayloadRequest } from 'payload'
import type { Chore, Task, User } from '@/payload-types'
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

export const Chores: CollectionConfig = {
  slug: 'chores',
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
        // task
        {
          name: 'task',
          type: 'relationship',
          relationTo: 'tasks',
          hasMany: false,
          required: true,
        },
        // child
        {
          name: 'child',
          type: 'relationship',
          relationTo: 'users',
          hasMany: false,
          required: true,
          filterOptions: ({ user }) => {
            if (!user) {
              return false
            }
            return {
              role: {
                equals: 'child',
              },
            }
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        // assigned on
        {
          name: 'assignedOn',
          type: 'date',
          required: true,
          defaultValue: () => new Date(),
          admin: {
            width: '50%',
          },
        },

        // assigned by
        {
          name: 'assignedBy',
          type: 'relationship',
          relationTo: 'users',
          hasMany: false,
          admin: {
            readOnly: true,
            width: '50%',
          },
          defaultValue: ({ req }) => req.user?.id,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        // repeat checkbox
        {
          name: 'repeat',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      type: 'row',
      admin: {
        condition: (data, siblingData) => !data.repeat,
      },
      fields: [
        // due date
        {
          name: 'dueDate',
          type: 'date',
          admin: {
            width: '50%',
          },
          validate: (value, options) => {
            // must be after assignedOn
            const assignedOn = (options.siblingData as Chore).assignedOn?.toString()

            if (value && assignedOn && new Date(value) < new Date(assignedOn)) {
              return 'Due date must be after assigned on'
            }
            return true
          },
        },
      ],
    },
    {
      type: 'row',
      admin: {
        condition: (data, siblingData) => data.repeat,
      },
      fields: [
        // frequency
        {
          name: 'frequency',
          type: 'select',
          options: ['daily', 'weekly', 'monthly', 'yearly'],
          defaultValue: 'daily',
          admin: {
            width: '40%',
          },
        },
        // every x days
        {
          name: 'every',
          type: 'number',
          defaultValue: 1,
          admin: {
            width: '10%',
          },
        },
        // days of week
        {
          name: 'daysOfWeek',
          type: 'select',
          admin: {
            width: '50%',
          },
          options: [
            {
              label: 'Monday',
              value: 'monday',
            },
            {
              label: 'Tuesday',
              value: 'tuesday',
            },
            {
              label: 'Wednesday',
              value: 'wednesday',
            },
            {
              label: 'Thursday',
              value: 'thursday',
            },
            {
              label: 'Friday',
              value: 'friday',
            },
            {
              label: 'Saturday',
              value: 'saturday',
            },
            {
              label: 'Sunday',
              value: 'sunday',
            },
          ],
          hasMany: true,
        },
      ],
    },
    // status
    {
      name: 'completed',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      type: 'row',
      fields: [
        // completed on
        {
          name: 'completedOn',
          type: 'date',
          admin: {
            readOnly: true,
            width: '50%',
          },
        },
      ],
    },
  ],
}
