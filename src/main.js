import { createApp } from "vue";
import App from "./App.vue";
import { db } from "./firebase"; // Importa la instancia de Firestore desde firebase.js
import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import router from "./router/router";
// Función para agregar un usuario a Firestore

// Llamar a la función para agregar un usuario

// Crear la aplicación Vue.js

export async function agregarUsuario(nombre, correo) {
  try {
    // Agregar un nuevo documento a la colección "usuarios"
    const docRef = await addDoc(collection(db, "usuarios"), {
      nombre: nombre,
      correo: correo,
    });
    console.log("Documento agregado con ID:", docRef.id);
    alert("Usuario agregado con exito");
  } catch (error) {
    console.error("Error al agregar documento:", error);
  }
}

export async function eliminarUsuario(idUsuario) {
  try {
    // Obtener referencia al documento del usuario que se va a eliminar
    const usuarioRef = doc(db, "usuarios", idUsuario);

    // Eliminar el documento del usuario
    await deleteDoc(usuarioRef);

    console.log("Usuario eliminado con éxito");
    alert("Usuario eliminado con éxito");
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
  }
}

const react = () => ``;

const app = createApp(App);
app.use(router).mount("#app");
