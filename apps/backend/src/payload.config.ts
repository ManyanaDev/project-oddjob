// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { pluginCalendar } from '@workspace/plugin-calendar'

import { Tasks } from './collections/Tasks'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Chores } from './collections/Chores'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoLogin: {
      email: 'jack@manyana.io',
      password: 'Password1!',
    },
  },
  collections: [Users, Media, Tasks, Chores],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    pluginCalendar({
      collections: {
        chores: true,
      },
      events: {
        chores: {
          selector: 'dueDate',
          options: {
            theme: 'bulbasaur',
          },
        },
      },
    }),
    // storage-adapter-placeholder
  ],
})
