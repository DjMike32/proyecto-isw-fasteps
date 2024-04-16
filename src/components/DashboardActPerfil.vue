<script setup>
    import { ref } from "vue";
    import { db, auth } from "../firebase.js";
    import { onAuthStateChanged } from "firebase/auth";
    import { doc, setDoc, serverTimestamp } from "firebase/firestore";
    import { storage } from "../firebase"; // Ajusta la importación según tu configuración
    import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

    const user = ref(null);
    const uid = auth.currentUser?.uid;
    const userId = ref(null); // Variable reactiva para almacenar el ID del usuario
    const file = ref(null); // Variable reactiva para almacenar el archivo seleccionado
    const fileSelected = ref(false); // Variable reactiva para controlar si se ha seleccionado un archivo

    // Función para obtener el ID del usuario actualmente autenticado
    const obtenerIdUsuario = () => {
        const usuarioActual = auth.currentUser; // Obtiene el usuario actualmente autenticado

        if (usuarioActual) {
            userId.value = usuarioActual.uid; // Asigna el ID del usuario a la variable reactiva
        } else {
            userId.value = null; // Si no hay usuario autenticado, establece el ID en null
        }
    };

    // Llama a la función para obtener el ID del usuario cuando el componente se monta
    onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
            // El usuario está autenticado
            user.value = firebaseUser;
        } else {
            // El usuario no está autenticado
            user.value = null;
        }
    });

    obtenerIdUsuario();

    const perfil = ref({
        nombre: "",
        apellido: "",
        correo: "",
        fechaCreacion: serverTimestamp(), // Fecha de creación inicial
        fechaModificacion: "", // Inicialmente null
        photo_url: "", // Campo para almacenar la URL de la imagen
        // Agrega más campos según sea necesario
    });

    const guardarPerfil = async () => {
        try {
            if (!user.value || !userId.value) {
                console.error("Usuario no autenticado o ID de usuario no válido.");
                return;
            }
            if (fileSelected.value) {
                await uploadFile();
            }

            perfil.value.fechaModificacion = serverTimestamp(); // Actualiza la fecha de modificación

            await setDoc(doc(db, "SuperAdmin", userId.value), perfil.value);
            console.log("Perfil de SuperAdmin guardado correctamente.");

            // Puedes redirigir al usuario a otra página después de guardar el perfil si lo deseas
        } catch (error) {
            console.error("Error al guardar el perfil de SuperAdmin:", error);
        }
    };

    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            file.value = selectedFile;
            fileSelected.value = true;
        } else {
            file.value = null;
            fileSelected.value = false;
        }
    };
    const uploadFile = async () => {
        try {
            if (!file.value) {
                console.error("No se ha seleccionado ningún archivo.");
                return;
            }

            const fileRef = storageRef(storage, `fotos/SuperAdmin/${file.value.name}`);
            await uploadBytes(fileRef, file.value);

            // Ahora obtenemos la URL de descarga después de que el archivo se haya subido correctamente
            const photoURL = await getDownloadURL(fileRef);

            // Agregar la URL de la imagen al campo photo_url del SuperAdmin
            perfil.value.photo_url = photoURL;

            console.log("URL de la imagen:", photoURL);
        } catch (error) {
            console.error("Error al subir el archivo:", error);
        }
    };
</script>

<template>
    <div>
        <h1>Completa tu perfil de SuperAdmin</h1>
        <form @submit.prevent="guardarPerfil">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" v-model="perfil.nombre" required />

            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" v-model="perfil.apellido" required />

            <label for="correo">Correo electrónico:</label>
            <input type="email" id="correo" v-model="perfil.correo" required />

            <!-- Input para seleccionar la foto -->
            <input type="file" @change="handleFileSelect" accept="image/*" />

            <!-- Botón para subir la imagen y agregar el SuperAdmin -->
            <button type="submit" :disabled="!fileSelected">Guardar Perfil</button>
        </form>

        <div>
            <p>El ID del usuario actual es: {{ userId }}</p>
            <button @click="obtenerIdUsuario">Obtener ID</button>
            <button @click="guardarPerfil">Actualizar Perfil</button>
        </div>
    </div>
</template>
