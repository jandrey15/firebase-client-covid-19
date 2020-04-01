import firebase from './config.js'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

// const firebase = firebase.initializeApp(firebase)
// Doc -> https://firebase.google.com/docs/firestore/security/get-started?hl=es-419

class Firebase {
  constructor () {
    this.auth = firebase.auth()
    this.db = firebase.firestore()
    this.storage = firebase.storage()
  }

  doCreateUserEmailPass = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)

  doAutEmailPass = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)

  doSignOut = () => this.auth.signOut()

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password)

  doCurrentUser = () => this.auth.currentUser // Verificar si esta autenticado.

  doCreateUserDb = (uid, displayName, email, photoURL) => {
    // https://firebase.google.com/docs/firestore/manage-data/add-data
    const dateNow = new Date()
    // console.log(dateNow)
    // db.collection("cities").doc("new-city-id").set(data);
    return this.db
      .collection('users')
      .doc(uid)
      .set({
        uid: uid,
        displayName: displayName,
        email: email,
        lastLogin: dateNow,
        photoURL: photoURL,
        roles: {
          admin: false,
          editor: false,
          subscriber: true
        }
      })
  }

  doStorageRef = (file) => {
    const storageRef = this.storage.ref(`covid-19/${file.name}`)
    const task = storageRef.put(file)
    return task
  }
}

export default Firebase