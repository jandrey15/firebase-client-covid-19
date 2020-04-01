// import firebase from 'firebase'
import * as firebase from 'firebase/app'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: '1:631538804769:web:f1e9c0404e5e1a9b5edb60'
}

// Initialize Firebase
// firebase.initializeApp(config)
// module.exports = config
export default firebase.initializeApp(config)