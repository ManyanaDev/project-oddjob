import type { ServerSideEditViewProps } from 'payload'

import { Column, Gutter, Table } from '@payloadcms/ui'
import React from 'react'

const columns: Column[] = [
  {
    accessor: 'task',
    active: true,
    field: {
      name: 'task',
      type: 'text',
    },
    Heading: <p>Task</p>,
    renderedCells: [],
  },
  {
    accessor: 'assignedOn',
    active: true,
    field: {
      name: 'assignedOn',
      type: 'date',
    },
    Heading: <p>Assigned On</p>,
    renderedCells: [],
  },
  {
    accessor: 'dueDate',
    active: true,
    field: {
      name: 'dueDate',
      type: 'date',
    },
    Heading: <p>Due Date</p>,
    renderedCells: [],
  },
  {
    accessor: 'completed',
    active: true,
    field: {
      name: 'completed',
      type: 'checkbox',
    },
    Heading: <p>Completed</p>,
    renderedCells: [],
  },
  {
    accessor: 'completedOn',
    active: true,
    field: {
      name: 'completedOn',
      type: 'date',
    },
    Heading: <p>Completed On</p>,
    renderedCells: [],
  },
  {
    accessor: 'assignedBy',
    active: true,
    field: {
      name: 'assignedBy',
      type: 'relationship',
      relationTo: 'users',
    },
    Heading: <p>Assigned By</p>,
    renderedCells: [],
  },
  {
    accessor: 'repeat',
    active: true,
    field: {
      name: 'repeat',
      type: 'checkbox',
    },
    Heading: <p>Repeat</p>,
    renderedCells: [],
  },
  {
    accessor: 'frequency',
    active: true,
    field: {
      name: 'frequency',
      type: 'select',
      options: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    Heading: <p>Frequency</p>,
    renderedCells: [],
  },
  {
    accessor: 'every',
    active: true,
    field: {
      name: 'every',
      type: 'number',
    },
    Heading: <p>Every</p>,
    renderedCells: [],
  },
  {
    accessor: 'daysOfWeek',
    active: true,
    field: {
      name: 'daysOfWeek',
      type: 'select',
      options: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    },
    Heading: <p>Days of Week</p>,
    renderedCells: [],
  },
  {
    accessor: 'createdAt',
    active: true,
    field: {
      name: 'createdAt',
      type: 'date',
    },
    Heading: <p>Created At</p>,
    renderedCells: [],
  },
]

export const View: React.FC<ServerSideEditViewProps> = async ({ payload, doc }) => {
  const chores = await payload.find({
    collection: 'chores',
    where: {
      child: {
        equals: doc.id,
      },
    },
  })

  const tableData = chores.docs.map((chore) => {
    return {
      task: typeof chore.task === 'string' ? chore.task : chore.task.name,
      assignedOn: chore.assignedOn,
      dueDate: chore.dueDate,
      completed: chore.completed,
      completedOn: chore.completedOn,
      assignedBy: typeof chore.assignedBy === 'string' ? chore.assignedBy : chore.assignedBy?.email,
      repeat: chore.repeat,
      frequency: chore.frequency,
      every: chore.every,
      daysOfWeek: chore.daysOfWeek,
      createdAt: chore.createdAt,
    }
  })

  const columnsWithRenderedCells = columns.map((column) => {
    return {
      ...column,
      renderedCells: tableData.map((row) => {
        // console.log(row[column.accessor as keyof typeof row])
        return row[column.accessor as keyof typeof row]?.toString()
      }),
    }
  })

  return (
    <Gutter>
      <div className="h-[400px] w-full">
        <Table data={tableData} columns={columnsWithRenderedCells} appearance="default" />
      </div>
    </Gutter>
  )
}
