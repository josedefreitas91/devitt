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
  query,
  orderBy,
  addDoc,
  Timestamp,
  onSnapshot,
  limitToLast,
} from "firebase/firestore"
import { getStorage, ref, uploadBytesResumable } from "firebase/storage"
export {
  _TaskEvent as TaskEvent,
  _TaskState as TaskState,
} from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_MEASUREMENTID,
}

const APP_NAME = "[DEFAULT]"
let app = null
try {
  app = initializeApp(firebaseConfig)
} catch {
  app = getApp(APP_NAME)
}

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
    const normalizedUser = user ? mapUserFromFirebaseAuth(user) : null
    onChange(normalizedUser)
  })
}

export const addDevit = async ({ avatar, content, userId, name, img }) => {
  try {
    return await addDoc(collection(db, "devits"), {
      avatar,
      content,
      createdAt: Timestamp.fromDate(new Date()),
      img,
      likesCount: 0,
      name,
      sharedCount: 0,
      userId,
    })
  } catch (e) {
    return new Promise((reject) => reject(e))
  }
}

const mapDevitFromFirebaseToDevitObject = (doc) => {
  const id = doc.id
  const data = doc.data()
  const { createdAt } = data

  return {
    ...data,
    id,
    createdAt: +createdAt.toDate(),
  }
}

export const listenLatestsDevits = (callback) => {
  const queryOrdered = query(
    collection(db, "devits"),
    orderBy("createdAt", "desc"),
    limitToLast(20)
  )
  return onSnapshot(queryOrdered, {
    next: ({ docs }) => {
      const newDevits = docs.map(mapDevitFromFirebaseToDevitObject)
      callback(newDevits)
    },
    error: () => {
      console.log("listenLatestsDevits error")
    },
  })
}

export const uploadImage = (file) => {
  const storage = getStorage()
  const storageRef = ref(storage, `images/${file.name}`)

  return uploadBytesResumable(storageRef, file)
}
