'use client'
import type { UIFieldServerComponent } from 'payload'

export const MarkAsComplete: UIFieldServerComponent = (props) => {
  function handleUpdate() {
    console.log(props)
  }

  return (
    <button className={``} onClick={handleUpdate} type="button">
      Mark as complete
    </button>
  )
}
