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
    // paths: [{ params: { id: "TylvfbihjCTABPou2Ba8" } }],
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
        response.status(404).end()
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

// export async function getServerSideProps(context) {
//   const { params, res } = context
//   const { id } = params

//   const apiResponse = await fetch(`http://localhost:3000/api/devits/${id}`)
//   if (apiResponse.ok) {
//     const props = await apiResponse.json()
//     return { props }
//   }
//   if (res) {
//     res.writeHead(301, { Location: "/home" }).end()
//   }
// }

// DevitPage.getInitialProps = (context) => {
//   const { query, res } = context
//   const { id } = query

//   return fetch(`http://localhost:3000/api/devits/${id}`).then((response) => {
//     if (response.ok) return response.json()
//     if (res) {
//       res.writeHead(404).end()
//     }
//   })
// }
