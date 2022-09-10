import Avatar from "../../components/Avatar"
import styles from "../../styles/devit.module.css"

export default function Devit({
  id,
  avatar,
  username,
  content,
  email,
  createdAt,
}) {
  return (
    <article className={styles.article}>
      <div className={styles.avatar}>
        <Avatar src={avatar} alt={username} />
      </div>

      <section className={styles.section}>
        <header>
          <strong>{username}</strong>
          <span className={styles.date}>{createdAt}</span>
        </header>
        <p>{content}</p>
      </section>
    </article>
  )
}
