import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import Devit from "components/Devit"
import { listenLatestsDevits } from "@/firebase/client"
import useUser from "hooks/useUser"
import styles from "styles/home.module.css"
import Home from "components/Icons/Home"
import Search from "components/Icons/Search"
import Create from "components/Icons/Create"

export default function HomePage() {
  const [timeline, setTimeline] = useState([])
  const user = useUser()

  useEffect(() => {
    let unsubscribe
    if (user) {
      unsubscribe = listenLatestsDevits(setTimeline)
    }
    return () => unsubscribe && unsubscribe()
  }, [user])

  return (
    <>
      <Head>
        <title>Inicio / Devtter</title>
      </Head>
      <header className={styles.header}>
        <h2 className={styles.title}>Home</h2>
      </header>

      <section className={styles.section}>
        {timeline.map(({ id, avatar, name, content, createdAt, img }) => (
          <Devit
            key={id}
            id={id}
            avatar={avatar}
            name={name}
            img={img}
            content={content}
            createdAt={createdAt}
          />
        ))}
      </section>

      <nav className={styles.nav}>
        <Link href="/">
          <a>
            <Home width={32} height={32} />
          </a>
        </Link>
        <Link href="/">
          <a>
            <Search width={32} height={32} />
          </a>
        </Link>
        <Link href="/compose/devit">
          <a>
            <Create width={32} height={32} />
          </a>
        </Link>
      </nav>
    </>
  )
}
