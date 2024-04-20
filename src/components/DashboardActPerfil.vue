<script setup>
    import { ref } from "vue";
    import { db, auth } from "../firebase.js";
    import { onAuthStateChanged } from "firebase/auth";
    import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
    import { storage } from "../firebase"; // Ajusta la importación según tu configuración
    import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
    import {
        nombreSuperAdmin,
        photoUrlSuperAdmin,
        obtenerDatosSuperAdmin,
    } from "../loginFunctions";

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
        obtenerIdUsuario();
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

            // Vuelve a cargar el perfil después de guardar los cambios
            await cargarPerfil();

            // Puedes redirigir al usuario a otra página después de guardar el perfil si lo deseas
        } catch (error) {
            console.error("Error al guardar el perfil de SuperAdmin:", error);
        }
    };

    const cargarPerfil = async () => {
        try {
            const user = auth.currentUser;

            if (user) {
                // Obtener el documento del SuperAdmin correspondiente al UID del usuario actual
                const superAdminDocRef = doc(db, "SuperAdmin", user.uid);
                const superAdminDocSnap = await getDoc(superAdminDocRef);

                if (superAdminDocSnap.exists()) {
                    // El documento del SuperAdmin existe, obtener los datos del perfil
                    const perfilData = superAdminDocSnap.data();

                    // Actualizar la variable reactiva 'perfil' con los nuevos datos
                    perfil.value = perfilData;
                } else {
                    console.error("El documento del SuperAdmin no existe para el usuario actual.");
                }
            } else {
                console.error("No se ha encontrado un usuario autenticado.");
            }
        } catch (error) {
            console.error("Error al cargar el perfil del SuperAdmin:", error);
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
    <!-- <div>
        <h1>Completa tu perfil de SuperAdmin</h1>
        <form @submit.prevent="guardarPerfil">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" v-model="perfil.nombre" required />

            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" v-model="perfil.apellido" required />

            <label for="correo">Correo electrónico:</label>
            <input type="email" id="correo" v-model="perfil.correo" required />

            <input type="file" @change="handleFileSelect" accept="image/*" />

            <button type="submit" :disabled="!fileSelected">Guardar Perfil</button>
        </form>

        <div>
            <p>El ID del usuario actual es: {{ userId }}</p>
            <button @click="obtenerIdUsuario">Obtener ID</button>
            <button @click="guardarPerfil">Actualizar Perfil</button>
        </div>
    </div> -->

    <div class="flex h-screen bg-bgblue">
        <aside class="w-1/4 bg-bgblue opacity-65 text-white border-r-[0.5px] border-white my-4">
            <div class="flex h-full flex-col justify-center">
                <div
                    class="basis-1/12 bg-[#eeeeee1b] grid grid-flow-col justify-start mx-8 rounded-xl items-center mb-4">
                    <img class="rounded-full size-[65px] -ml-2" :src="photoUrlSuperAdmin" alt="" />
                    <h1 class="text-3xl font-bold text-white text-center ml-4">
                        {{ nombreSuperAdmin }}
                    </h1>
                </div>
                <div class="basis-11/12 grid grid-flow-row grid-rows-4">
                    <router-link to="/sa/bufetes" class="flex flex-col justify-center mx-4">
                        <button
                            class="flex flex-col items-center w-full hover: border-slate-400 hover:border-x-2 text-3xl space-y-3">
                            <fa icon="fa-user-tie fa-solid" />
                            <h2>Bufetes</h2>
                        </button>
                    </router-link>
                    <router-link to="/sa/tramites" class="flex flex-col justify-center mx-4">
                        <button
                            class="flex flex-col items-center w-full hover: border-slate-400 hover:border-x-2 text-3xl space-y-3">
                            <fa icon="fa-file-signature fa-solid" />
                            <h2>Tramites</h2>
                        </button>
                    </router-link>
                    <router-link to="/sa/actualizar" class="flex flex-col justify-center mx-4">
                        <button
                            class="flex flex-col items-center w-full border-slate-400 border-x-2 text-3xl space-y-3 opacity-30">
                            <fa icon="fa-id-card fa-solid" />
                            <h2>Perfil</h2>
                        </button>
                    </router-link>
                    <a class="flex flex-col justify-center mx-4">
                        <button @click="cerrarSesion"
                            class="flex flex-col items-center w-full hover: border-slate-400 hover:border-x-2 text-3xl space-y-3">
                            <fa icon="fa-right-from-bracket fa-solid" />
                            <h2>Cerrar Sesión</h2>
                        </button>
                    </a>
                </div>
            </div>
        </aside>
        <!-- Contenido principal -->
        <main class="flex-1 p-4 box-border">
            <div class="bg-bgdark w-full h-full opacity-55 text-white box-border relative flex flex-col justify-center">
                <form @submit.prevent="guardarPerfil">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" v-model="perfil.nombre" required />

                    <label for="apellido">Apellido:</label>
                    <input type="text" id="apellido" v-model="perfil.apellido" required />

                    <label for="correo">Correo electrónico:</label>
                    <input type="email" id="correo" v-model="perfil.correo" required />

                    <input type="file" @change="handleFileSelect" accept="image/*" />

                    <button type="submit" :disabled="!fileSelected">Guardar Perfil</button>
                </form>
            </div>
        </main>
    </div>
</template>
