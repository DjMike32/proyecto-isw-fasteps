// * Librerias para crear la app de vue
import { createApp } from "vue";
import App from "./App.vue";

// * Librerias para el manejo de la BD de Firebase
import { db } from "./firebase"; // Importa la instancia de Firestore desde firebase.js
import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// * Router para gestionar las rutas de las vistas
import router from "./router/router";
import { useRouter } from "vue-router";
import { getAuth } from "firebase/auth";

// * Libreria para los iconos de fontAwesome
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

const auth = getAuth();
// ! Función para agregar usuarios
export async function agregarUsuario(nombre, correo) {
  try {
    //  Agregar un nuevo documento a la colección "usuarios"
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
    //  Obtener referencia al documento del usuario que se va a eliminar
    const usuarioRef = doc(db, "usuarios", idUsuario);

    // Eliminar el documento del usuario
    await deleteDoc(usuarioRef);

    console.log("Usuario eliminado con éxito");
    alert("Usuario eliminado con éxito");
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
  }
}

library.add(fas, far, fab);

const app = createApp(App);
app.component("fa", FontAwesomeIcon);
app.use(router).mount("#app");
