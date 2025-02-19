import type { CollectionSlug, Config } from 'payload'

export type PluginCalendarConfig = {
  /**
   * List of collections to add a custom field
   */
  collections?: Partial<Record<CollectionSlug, true>>
  disabled?: boolean
  /**
   * Event:
   * The plugin will render events based on params:
   * - collection (eg chores)
   * - selector (eg date)
   * - options ( eg colour)
   * - if repeating, the event will be rendered for each day / month in the repeating period
   */
  events?: {
    [collection: string]: {
      selector: string
      options: {
        theme: 'pikachu' | 'charmander' | 'bulbasaur'
      }
    }
  }
}

export const pluginCalendar =
  (pluginOptions: PluginCalendarConfig) =>
  (config: Config): Config => {
    if (!config.collections) {
      config.collections = []
    }

    /**
     * If the plugin is disabled, we still want to keep added collections/fields so the database schema is consistent which is important for migrations.
     * If your plugin heavily modifies the database schema, you may want to remove this property.
     */
    if (pluginOptions.disabled) {
      return config
    }

    if (!config.endpoints) {
      config.endpoints = []
    }

    if (!config.admin) {
      config.admin = {}
    }

    if (!config.admin.components) {
      config.admin.components = {}
    }

    if (!config.admin.components.views) {
      config.admin.components.views = {}
    }

    if (!config.admin.components.beforeDashboard) {
      config.admin.components.beforeDashboard = []
    }

    if (!config.admin.components.afterNavLinks) {
      config.admin.components.afterNavLinks = []
    }

    // config.admin.components.beforeDashboard.push(
    //   `@oddjob/plugin-calendar/client#BeforeDashboardClient`,
    // )
    // config.admin.components.beforeDashboard.push(
    //   `@oddjob/plugin-calendar/rsc#BeforeDashboardServer`,
    // )

    console.log(pluginOptions.events)

    config.admin.components.views.calendar = {
      Component: {
        exportName: 'Calendar',
        path: '@oddjob/plugin-calendar/rsc#Calendar',
        serverProps: {
          events: pluginOptions.events,
        },
      },
      path: '/calendar',
    }

    config.admin.components.afterNavLinks.push({
      path: '@oddjob/plugin-calendar/rsc#CalendarNavLink',
      exportName: 'CalendarNavLink',
      serverProps: {
        label: 'Calendar',
        href: '/admin/calendar',
      },
    })

    config.endpoints.push({
      handler: () => {
        return Response.json({ message: 'Hello from custom endpoint' })
      },
      method: 'get',
      path: '/my-plugin-endpoint',
    })

    const incomingOnInit = config.onInit

    config.onInit = async (payload) => {
      // Ensure we are executing any existing onInit functions before running our own.
      if (incomingOnInit) {
        await incomingOnInit(payload)
      }

      try {
        const collections = Object.keys(pluginOptions.events || {})
        console.log('collections', collections)
        for (const collection of collections) {
          console.log('collection', collection)
          const { totalDocs } = await payload.count({
            collection: collection as CollectionSlug,
          })

          console.log('totalDocs', totalDocs)

          // if (totalDocs === 0) {
          //     await payload.create({
          //       collection: collection as CollectionSlug,
          //       data: {
          //         id: 'seeded-by-plugin',
          //       },
          //     })
          //   }
        }
      } catch (error) {
        console.error(error)
      }
    }

    return config
  }
