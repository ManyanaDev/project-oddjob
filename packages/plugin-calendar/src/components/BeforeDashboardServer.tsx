import type { ServerComponentProps } from 'payload'

// import styles from './BeforeDashboardServer.module.css'

export const BeforeDashboardServer: React.FC<ServerComponentProps> = async (props) => {
  const { payload } = props

  const { docs } = await payload.find({ collection: 'plugin-collection' })

  return (
    <div>
      <h1>Added by the plugin: Before Dashboard Server</h1>
      Docs from Local API:
      {docs.map((doc) => (
        <div key={doc.id}>{doc.id}</div>
      ))}
    </div>
  )
}
