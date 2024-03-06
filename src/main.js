import { createApp } from 'vue';
import App from './App.vue';
import { db } from './firebase'; // Importa la instancia de Firestore desde firebase.js
import { collection, addDoc } from 'firebase/firestore';

// Función para agregar un usuario a Firestore


// Llamar a la función para agregar un usuario (esto es solo un ejemplo, puedes eliminarlo si prefieres)


// Crear la aplicación Vue.js


async function agregarUsuario(nombre, correo) {
    try {
        // Agregar un nuevo documento a la colección "usuarios"
        const docRef = await addDoc(collection(db, "usuarios"), {
            nombre: nombre,
            correo: correo,
            // Puedes agregar más campos aquí según sea necesario
        });
        console.log("Documento agregado con ID:", docRef.id);
    } catch (error) {
        console.error("Error al agregar documento:", error);
    }
}

export const frutas = [
      { nombre: 'Manzana', color: 'Rojo' },
      { nombre: 'Plátano', color: 'Amarillo' },
      { nombre: 'Uva', color: 'Morado' },
      { nombre: 'Naranja', color: 'Naranja' }
    ]
  ;

const app = createApp(App);
app.mount('#app');