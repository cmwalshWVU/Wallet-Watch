import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import 'firebase/firestore';
const admin = require('firebase-admin');

var config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const Firebase  = firebase.initializeApp(config);

// if (!firebase.apps.length) {
//   firebase.initializeApp(config);
// }

export default Firebase

// var serviceAccount = require("key.json")

var serviceAccount = {
  type: "service_account",
  projectId: process.env.REACT_APP_PROJECT_ID,
  private_key_id: process.env.REACT_PRIVATE_KEY_ID,
  private_key: process.env.REACT_PRIVATE_KEY,
  client_email: process.env.REACT_CLIENT_EMAIL,
  client_id: process.env.REACT_CLIENT_ID,
  auth_uri: process.env.REACT_AUTH_URI,
  token_uri: process.env.REACT_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.REACT_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.REACT_CLIENT_CERT_URL
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.REACT_DATABASE_URL
  });


export const auth = Firebase.auth();
export const firestore = Firebase.firestore();
export const adminAuth = admin.auth();