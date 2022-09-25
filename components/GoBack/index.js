import Link from "next/link"
import styles from "styles/devit.module.css"
import ArrowLeft from "components/Icons/ArrowLeft"

export default function GoBack({ url, children }) {
  return (
    <section className={styles.go_back}>
      <Link href={url}>
        <a title="Atrás">
          <ArrowLeft width={32} height={32} />
        </a>
      </Link>
      {children}
    </section>
  )
}
