import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAkUJIjawrBxUalpPjSXeRtCVf_LCvYuUA",
    authDomain: "bufete-hi1457.firebaseapp.com",
    projectId: "bufete-hi1457",
    storageBucket: "bufete-hi1457.appspot.com",
    messagingSenderId: "528124383597",
    appId: "1:528124383597:web:f341674b4ea8610d2aca64"
};

// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Obtener una instancia de Firestore
const db = getFirestore(firebaseApp);

export { db };
