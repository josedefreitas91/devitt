import styles from "styles/image_preview.module.css"

export default function ImagePreview({ url, handleClick, imageOnly = false }) {
  if (imageOnly) {
    return <img src={url} className={styles.imgOnly} />
  }
  return (
    <section className={styles.section}>
      <button className={styles.button} onClick={handleClick}>
        x
      </button>
      <img src={url} className={styles.img} />
    </section>
  )
}
