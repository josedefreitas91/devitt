import styles from "../../styles/button.module.css"

export default function Button({ children, disabled, onClick }) {
  return (
    <>
      <button className={styles.button} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    </>
  )
}
