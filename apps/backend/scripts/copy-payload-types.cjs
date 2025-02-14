/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

/**
 * @param {string} sourcePath
 * @param {string} destinationPath
 */
const copyPayloadTypes = (sourcePath, destinationPath) => {
  const payloadTypes = fs.readFileSync(sourcePath, 'utf8')
  fs.writeFileSync(destinationPath, payloadTypes)
}

copyPayloadTypes(
  path.join(__dirname, '../../../apps/backend/src/payload-types.ts'),
  path.join(__dirname, '../../../packages/types/src/payload/payload-types.d.ts'),
)
