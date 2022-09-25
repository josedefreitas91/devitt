import "styles/globals.css"
import styles from "styles/index.module.css"

function App({ Component, pageProps }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Component {...pageProps} />
      </main>
    </div>
  )
}

export default App
