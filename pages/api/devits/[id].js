import { firestore } from "../../../firebase/admin"

export default (request, response) => {
  const { query } = request
  const { id } = query

  firestore
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

      response.json({
        ...data,
        id,
        createdAt: +createdAt.toDate(),
      })
    })
    .catch(() => {
      response.status(404).end()
    })
}
