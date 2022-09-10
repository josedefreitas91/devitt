import { initializeApp } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCasNJqbeV_vdjXLoQMCg3tTXtaWiVjNSI",
  authDomain: "devtter-aeef4.firebaseapp.com",
  projectId: "devtter-aeef4",
  storageBucket: "devtter-aeef4.appspot.com",
  messagingSenderId: "494013204611",
  appId: "1:494013204611:web:cb70c1526aefe32a0573b6",
  measurementId: "G-0SMGNYL4Y5",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const mapUserFromFirebaseAuth = (user) => {
  const { displayName, email, photoURL, uid } = user
  return {
    name: displayName,
    avatar: photoURL,
    email,
    uid,
  }
}

export const loginWithGitHub = () => {
  const githubProvider = new GithubAuthProvider()

  return signInWithPopup(auth, githubProvider)
}

export const authStateChanged = (onChange) => {
  return onAuthStateChanged(auth, (user) => {
    console.log("onAuthStateChanged", user)
    const normalizedUser = user ? mapUserFromFirebaseAuth(user) : null
    onChange(normalizedUser)
  })
}

export const addDevit = async ({ avatar, content, userId, name }) => {
  try {
    return await addDoc(collection(db, "devits"), {
      avatar,
      content,
      userId,
      name,
      createdAt: Timestamp.fromDate(new Date()),
      likesCount: 0,
      sharedCount: 0,
    })
  } catch (e) {
    console.error("Error adding document: ", e)
    return new Promise((reject) => reject(e))
  }
}

export const fetchLatestsDevits = async () => {
  return getDocs(collection(db, "devits")).then(({ docs }) => {
    return docs.map((doc) => {
      const id = doc.id
      const data = doc.data()
      const { createdAt } = data
      const intl = new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "America/Lima",
      })
      const normalizedCreatedAt = intl.format(
        new Date(createdAt.seconds * 1000)
      )

      return {
        ...data,
        id,
        createdAt: normalizedCreatedAt,
      }
    })
  })
}
