import Link from "next/link"
import { useRouter } from "next/router"
import Avatar from "../../components/Avatar"
import useDateTimeFormat from "../../hooks/useDataTimeFormat"
import useTimeAgo from "../../hooks/useTimeAgo"
import styles from "../../styles/devit.module.css"
import ImagePreview from "../ImagePreview"

export default function Devit({
  id,
  avatar,
  username,
  content,
  email,
  createdAt,
  img,
}) {
  const timeAgo = useTimeAgo(createdAt)
  const createdAtFormated = useDateTimeFormat(createdAt)
  const router = useRouter()

  const handleArticleClick = (e) => {
    e.preventDefault()
    router.push(`/status/${id}`)
  }

  return (
    <article className={styles.article} onClick={handleArticleClick}>
      <div className={styles.avatar}>
        <Avatar src={avatar} alt={username} />
      </div>

      <section className={styles.section}>
        <header>
          <strong>{username}</strong>
          <Link href={`/status/${id}`}>
            <a className={styles.link}>
              <time className={styles.time} title={createdAtFormated}>
                {timeAgo}
              </time>
            </a>
          </Link>
        </header>
        <p>{content}</p>
        {img && <ImagePreview url={img} imageOnly={true} />}
      </section>
    </article>
  )
}
