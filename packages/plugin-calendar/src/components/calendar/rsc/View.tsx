import type { AdminViewProps, CollectionSlug, Payload } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'

import { CalendarClient, Event } from '../client/View'
import { PluginCalendarConfig } from '../../../index'

async function getCalendarEvents(
  collections: PluginCalendarConfig['events'],
  payload: Payload,
): Promise<Event[]> {
  const events = [] as Event[]

  for (const collection in collections) {
    const { docs } = await payload.find({ collection: collection as CollectionSlug })
    docs.forEach((doc) => {
      events.push({
        id: doc.id.toString(),
        // name: (doc.task as any)?.name,
        name: '',
        dueDate: '', // doc.dueDate,
        theme: collections[collection].options.theme,
      })
    })
  }

  return events
}

export const Calendar: React.FC<
  AdminViewProps & {
    events: PluginCalendarConfig['events']
  }
> = async ({ initPageResult, params, searchParams, events }) => {
  const { payload } = initPageResult.req

  const eventItems = await getCalendarEvents(events, payload)
  console.log('eventItems', eventItems)

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <CalendarClient events={eventItems} />
      </Gutter>
    </DefaultTemplate>
  )
}
