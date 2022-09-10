import { useEffect, useState } from "react"
import Devit from "../../components/Devit"
import { fetchLatestsDevits } from "../../firebase/client"
import useUser from "../../hooks/useUser"
import styles from "../../styles/home.module.css"

export default function HomePage() {
  const [timeline, setTimeline] = useState([])
  const user = useUser()

  useEffect(() => {
    user && fetchLatestsDevits().then(setTimeline)
  }, [user])

  return (
    <>
      <header className={styles.header}>
        <h2 className={styles.title}>Home</h2>
      </header>

      <section className={styles.section}>
        {timeline.map(({ id, avatar, name, content, createdAt }) => (
          <Devit
            key={id}
            id={id}
            avatar={avatar}
            username={name}
            content={content}
            createdAt={createdAt}
          />
        ))}
      </section>

      <nav className={styles.nav}></nav>
    </>
  )
}
