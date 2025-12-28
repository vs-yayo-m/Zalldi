import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

async function createAdmin() {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@zalldi.com',
      'Admin@123456'
    )
    
    const user = userCredential.user
    
    await setDoc(doc(db, 'users', user.uid), {
      email: 'admin@zalldi.com',
      displayName: 'Admin',
      role: 'admin',
      phoneNumber: '+9779821072912',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    console.log('✅ Admin user created successfully!')
    console.log('Email: admin@zalldi.com')
    console.log('Password: Admin@123456')
  } catch (error) {
    console.error('Error:', error.message)
  }
}

createAdmin()