import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAkUJIjawrBxUalpPjSXeRtCVf_LCvYuUA",
  authDomain: "bufete-hi1457.firebaseapp.com",
  projectId: "bufete-hi1457",
  storageBucket: "bufete-hi1457.appspot.com",
  messagingSenderId: "528124383597",
  appId: "1:528124383597:web:f341674b4ea8610d2aca64",
};

// Inicializar Firebase

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage();
const storageRef = ref(storage, "prueba-fotos-bufetes");

uploadBytes(storageRef);

// Obtener una instancia de Firestore

export { db, storage };
