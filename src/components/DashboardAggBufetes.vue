<script setup>
    import { ref, watchEffect } from "vue";
    import { db, auth } from "../firebase.js";
    import { onAuthStateChanged } from "firebase/auth";
    import {
        collection,
        doc,
        setDoc,
        addDoc,
        serverTimestamp,
        getDocs,
    } from "firebase/firestore"; // Asegúrate de importar la instancia de Firebase
    // Asegúrate de importar la instancia de Firebase
    import { storage } from "../firebase"; // Ajusta la importación según tu configuración
    import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
    import {
        nombreSuperAdmin,
        photoUrlSuperAdmin,
        obtenerDatosSuperAdmin,
    } from "../loginFunctions";

    const inputValue = ref("");

    const file = ref(null);
    const nuevoBufete = ref({
        email: "",
        display_name: "",
        phone_number: "",
        ContrasenaAsesores: "",
        administrador: "",
        photo_url: "", // Campo para almacenar la URL de la imagen
        // Agrega más campos según sea necesario
    });

    // Comprueba si se ha seleccionado un archivo
    const fileSelected = ref(false);

    // Función para manejar la selección de archivos
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

    // Función para subir la imagen a Firebase Storage y obtener su URL de descarga
    const uploadFile = async () => {
        try {
            if (!file.value) {
                console.error("No se ha seleccionado ningún archivo.");
                return;
            }

            const fileRef = storageRef(storage, `fotos/bufetes/${file.value.name}`);
            await uploadBytes(fileRef, file.value);

            // Ahora obtenemos la URL de descarga después de que el archivo se haya subido correctamente
            const photoURL = await getDownloadURL(fileRef);

            // Agregar la URL de la imagen al campo photo_url del bufete
            nuevoBufete.value.photo_url = photoURL;

            console.log("URL de la imagen:", photoURL);
        } catch (error) {
            console.error("Error al subir el archivo:", error);
        }
    };

    // Función para agregar un nuevo bufete a la colección "Bufetes"
    const agregarNuevoBufete = async () => {
        try {
            // Subir la imagen seleccionada antes de agregar el bufete

            const querySnapshot = await getDocs(collection(db, "Bufetes"));
            let ultimoId = 0;
            querySnapshot.forEach((doc) => {
                const bufete = doc.data();
                if (bufete.Id_Bufete > ultimoId) {
                    ultimoId = bufete.Id_Bufete;
                }
            });

            // Incrementar el último id_Bufete para el nuevo bufete
            const nuevoId = ultimoId + 1;
            await uploadFile();

            // Crear el nuevo bufete con el nuevo id_Bufete y la fecha de creación
            const nuevoBufeteConFecha = {
                ...nuevoBufete.value,
                Id_Bufete: nuevoId,
                created_time: serverTimestamp(),
            };

            // Espera a que uidInputValue tenga un valor antes de continuar

            // Agregar el nuevo bufete a la colección "Bufetes"
            await setDoc(doc(db, "Bufetes", inputValue.value), nuevoBufeteConFecha);

            // Limpiar el formulario después de agregar el bufete
            nuevoBufete.value = {
                email: "",
                display_name: "",
                phone_number: "",
                ContrasenaAsesores: "",
                administrador: "",
                photo_url: "",
                // Agrega más campos según sea necesario
            };

            console.log("Bufete agregado exitosamente");
        } catch (error) {
            console.error("Error al agregar el bufete:", error);
            console.log(inputValue.value);
        }
    };
</script>

<template>
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
                <div>
                    <h2>Agregar Nuevo Bufete</h2>

                    <form @submit.prevent="agregarNuevoBufete" class="text-black">
                        <label>UID</label>
                        <input type="text" v-model="inputValue" placeholder="Ingresa el valor" />
                        <label for="email">Email:</label>
                        <input type="email" id="email" v-model="nuevoBufete.email" required />

                        <label for="display_name">Nombre:</label>
                        <input type="text" id="display_name" v-model="nuevoBufete.display_name" required />

                        <label for="phone-number">Número de Teléfono:</label>
                        <input type="tel" id="phone-number" v-model="nuevoBufete.phone_number" required />

                        <label for="administrador">Administrador</label>
                        <input type="text" id="administrador" v-model="nuevoBufete.administrador" required />

                        <label for="ContrasenaAsesores">Contraseña temporal</label>
                        <input type="text" id="ContrasenaAsesores" v-model="nuevoBufete.ContrasenaAsesores" required />

                        <input type="file" @change="handleFileSelect" accept="image/*" />

                        <button type="submit" :disabled="!fileSelected">Agregar Bufete</button>
                    </form>
                </div>
            </div>
        </main>
    </div>
</template>
