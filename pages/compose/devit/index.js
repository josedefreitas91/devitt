import { useState } from "react"
import Button from "../../../components/Button"
import useUser from "../../../hooks/useUser"
import styles from "../../../styles/devit.module.css"
import { addDevit } from "../../../firebase/client"
import { useRouter } from "next/router"

export const COMPOSE_STATUS = {
  USET_NOT_KNOW: 0,
  LOADING: 1,
  SUCCESS: 2,
  ERROR: -1,
}

export default function ComposeDevit() {
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState(COMPOSE_STATUS.USET_NOT_KNOW)
  const user = useUser()
  const router = useRouter()

  const handleChange = (event) => {
    const { value } = event.target
    setMessage(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus(COMPOSE_STATUS.LOADING)
    await addDevit({
      avatar: user.avatar,
      content: message,
      userId: user.uid,
      name: user.name,
    })
      .then((response) => {
        console.log("addDevit response:", response)
        router.push("/")
      })
      .catch((error) => {
        console.log("addDevit error:", error)
        setStatus(COMPOSE_STATUS.ERROR)
      })
  }

  const isButtonDisabled = !message.length || status === COMPOSE_STATUS.LOADING

  return (
    <>
      <form onSubmit={handleSubmit}>
        <textarea
          onChange={handleChange}
          placeholder="Qué estas pensando?"
          className={styles.textarea}
          value={message}
        ></textarea>
        <div className={styles.button}>
          <Button disabled={isButtonDisabled}>Devitear</Button>
        </div>
      </form>
    </>
  )
}
