import { useEffect, useState } from "react"
import Button from "components/Button"
import useUser from "hooks/useUser"
import styles from "styles/devit.module.css"
import { addDevit, uploadImage, TaskEvent } from "@/firebase/client"
import { useRouter } from "next/router"
import { getDownloadURL } from "firebase/storage"
import ImagePreview from "components/ImagePreview"
import Avatar from "components/Avatar"
import Head from "next/head"
import GoBack from "components/GoBack"
import Loading from "components/Loading"

const COMPOSE_STATUS = {
  USET_NOT_KNOW: 0,
  LOADING: 1,
  SUCCESS: 2,
  ERROR: -1,
}

const DRAG_IMAGE_STATES = {
  ERROR: -1,
  NONE: 0,
  DRAG_OVER: 1,
  UPLOADING: 2,
  COMPLETE: 3,
}

export default function ComposeDevit() {
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState(COMPOSE_STATUS.USET_NOT_KNOW)
  const [drag, setDrag] = useState(DRAG_IMAGE_STATES.NONE)
  const [task, setTask] = useState(null)
  const [imgURL, setImgURL] = useState(null)
  const user = useUser()
  const router = useRouter()

  const handleChange = (event) => {
    const { value } = event.target
    setMessage(value)
  }

  const handleClick = async (event) => {
    event.preventDefault()
    setStatus(COMPOSE_STATUS.LOADING)
    await addDevit({
      avatar: user.avatar,
      content: message,
      userId: user.uid,
      name: user.name,
      img: imgURL,
    })
      .then(() => {
        router.push("/home")
      })
      .catch((error) => {
        console.log("addDevit error", error)
        setStatus(COMPOSE_STATUS.ERROR)
      })
  }

  const handleDragEnter = (event) => {
    event.preventDefault()
    setDrag(DRAG_IMAGE_STATES.DRAG_OVER)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setDrag(DRAG_IMAGE_STATES.NONE)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDrag(DRAG_IMAGE_STATES.NONE)
    const file = event.dataTransfer.files[0]
    const task = uploadImage(file)
    setTask(task)
  }

  const isButtonDisabled = !message.length || status === COMPOSE_STATUS.LOADING

  useEffect(() => {
    if (task) {
      let onProgress = (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log(`Upload is ${progress}% done`)
      }
      let onError = () => {
        console.log("onError")
      }
      let onComplete = () => {
        console.log("onComplete")
        getDownloadURL(task.snapshot.ref).then(setImgURL)
      }

      task.on(TaskEvent, onProgress, onError, onComplete)
    }
  }, [task])

  if (status === COMPOSE_STATUS.LOADING) return <Loading />

  return (
    <>
      <Head>
        <title>Crear un devit / Devtter</title>
      </Head>
      <GoBack url="/home">
        <div className={styles.button}>
          <Button disabled={isButtonDisabled} onClick={handleClick}>
            Devitear
          </Button>
        </div>
      </GoBack>
      <section className={styles.container}>
        {user && (
          <section className={styles.containerAvatar}>
            <Avatar src={user.avatar} />
          </section>
        )}
        <form className={styles.form}>
          <textarea
            onChange={handleChange}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            placeholder="Qué estas pensando?"
            className={[
              styles.textarea,
              drag === DRAG_IMAGE_STATES.DRAG_OVER ? styles.dashed : "",
            ].join(" ")}
            value={message}
          ></textarea>
          {imgURL && (
            <ImagePreview url={imgURL} handleClick={() => setImgURL(null)} />
          )}
        </form>
      </section>
    </>
  )
}
