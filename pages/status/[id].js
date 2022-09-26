import { useRouter } from "next/router"
import Devit from "components/Devit"
import GoBack from "components/GoBack"
import { firestore } from "@/firebase/admin"
import Loading from "components/Loading"

export default function DevitPage(props) {
  const router = useRouter()

  if (router.isFallback) return <Loading />

  return (
    <>
      <GoBack url="/home" />
      <Devit {...props} />
    </>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const { params } = context
  const { id } = params

  return firestore
    .collection("devits")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        throw new Error("Devit not found")
      }

      const id = doc.id
      const data = doc.data()
      const { createdAt } = data

      const props = {
        ...data,
        id,
        createdAt: +createdAt.toDate(),
      }

      return { props }
    })
    .catch(() => {
      return { props: {} }
    })
}
