import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAskh6l_6VF_4476ziFD__4L-ypvnpTeqM",
  authDomain: "myapp-be0c9.firebaseapp.com",
  projectId: "myapp-be0c9",
  storageBucket: "myapp-be0c9.appspot.com",
  messagingSenderId: "703805700316",
  appId: "1:703805700316:web:59af62f3751dc91ab05c19"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);


const db = getFirestore(app);

export { auth, db };
