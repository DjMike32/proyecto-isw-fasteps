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
        ApellidoSuperAdmin,
    } from "../loginFunctions";
    import { useRouter } from "vue-router";

    const user = ref(null);
    const uid = auth.currentUser?.uid;
    const userId = ref(null); // Variable reactiva para almacenar el ID del usuario
    const file = ref(null); // Variable reactiva para almacenar el archivo seleccionado
    const fileSelected = ref(false); // Variable reactiva para controlar si se ha seleccionado un archivo
    const tempImageUrl = ref(null);

    const router = useRouter(); // Obtén la instancia del enrutador
    const cerrarSesion = () => {
        auth
            .signOut() // Utiliza el método signOut() para cerrar la sesión del usuario
            .then(() => {
                console.log("Sesión cerrada exitosamente");
                router.push("/"); // Redirige al usuario al inicio de la página
            })
            .catch((error) => {
                console.error("Error al cerrar sesión:", error);
            });
    };

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
        fechaCreacion: null, // Inicialmente null
        fechaModificacion: "", // Inicialmente null
        photo_url: "", // Campo para almacenar la URL de la imagen
        // Agrega más campos según sea necesario
    });

    let fechaCreacionEstablecida = false; // Variable auxiliar para controlar si la fecha de creación ha sido establecida

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

            // Si la fecha de creación aún no ha sido establecida, o si es null, establecerla
            if (!fechaCreacionEstablecida || !perfil.value.fechaCreacion) {
                perfil.value.fechaCreacion = serverTimestamp(); // Establece la fecha de creación inicial
                fechaCreacionEstablecida = true; // Marca la fecha de creación como establecida
            }

            // Guarda la fecha de modificación
            const fechaActual = serverTimestamp();
            perfil.value.fechaModificacion = fechaActual;

            // Guarda el perfil en la base de datos
            await setDoc(doc(db, "SuperAdmin", userId.value), perfil.value);
            console.log("Perfil de SuperAdmin guardado correctamente.");

            // Vuelve a cargar el perfil después de guardar los cambios
            await cargarPerfil();

            swal({
                icon: "success",
                title: "Usuario actualizado",
            });

            setTimeout(() => {
                // Forzar el reinicio del navegador
                location.reload();
            }, 3000); // 3000 milisegundos = 3 segundos

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

            // Crear una URL temporal para mostrar la imagen seleccionada
            tempImageUrl.value = URL.createObjectURL(selectedFile);
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
                <div class="basis-11/12 grid grid-flow-row grid-rows-4 text-2xl">
                    <router-link to="/sa/bufetes"
                        class="flex flex-col justify-center m-4 hover:border-x-2 hover:border-slate-400">
                        <button class="flex flex-col items-center w-full text-3xl space-y-3 hover:scale-110">
                            <fa icon="fa-user-tie fa-solid" />
                            <h2>Bufetes</h2>
                        </button>
                    </router-link>
                    <router-link to="/sa/tramites"
                        class="flex flex-col justify-center m-4 hover:border-x-2 hover:border-slate-400">
                        <button class="flex flex-col items-center w-full text-3xl space-y-3 hover:scale-110">
                            <fa icon="fa-file-signature fa-solid" />
                            <h2>Tramites</h2>
                        </button>
                    </router-link>
                    <router-link to="/sa/perfil/ver"
                        class="flex flex-col justify-center m-4 border-x-2 border-slate-400 opacity-30">
                        <button class="flex flex-col items-center w-full text-3xl space-y-3">
                            <fa icon="fa-id-card fa-solid" />
                            <h2>Perfil</h2>
                        </button>
                    </router-link>
                    <a class="flex flex-col justify-center m-4 hover:border-x-2 hover:border-slate-400">
                        <button @click="cerrarSesion"
                            class="flex flex-col items-center w-full text-3xl space-y-3 hover:scale-110">
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
                <div class="">
                    <router-link to="/sa/perfil/ver"
                        class="flex flex-col justify-center mx-4 absolute ml-8 mt-8 text-2xl z-20 hover:scale-125">
                        <fa icon="fa-chevron-left fa-solid mt-8" />
                    </router-link>
                    <h1
                        class="static text-center w-full flex-1 animate__animated animate__bounce text-white animate__flipInX text-[55px] mt-2">
                        Actualizar Perfil
                    </h1>
                </div>

                <div class="grid flex-auto p-2 grid-cols-1 gap-20 mx-12 my-6">
                    <form @submit.prevent="guardarPerfil"
                        class="bg-bgdark w-full h-full text-pcd box-border relative grid grid-cols-2 rounded-2xl text-3xl p-2 gap-6">
                        <div class="flex flex-col gap-y-1">
                            <label class="text-[85%] ml-1" for="">Nombre: </label>
                            <input type="text" :placeholder="nombreSuperAdmin" id="nombre" v-model="perfil.nombre"
                                required pattern="[A-Za-z]+" title="Ingrese solo letras"
                                class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                        </div>

                        <div class="flex flex-col gap-y-1">
                            <label class="text-[85%] ml-1" for="">Apellido: </label>
                            <input type="text" :placeholder="ApellidoSuperAdmin" id="apellido" v-model="perfil.apellido"
                                required pattern="[A-Za-z]+" title="Ingrese solo letras"
                                class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                        </div>
                        <!-- <div>
                            <label class="" for="">Telefono</label>
                            <input type="" pattern="\+504 \d{4}-\d{4}"
                                class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2"
                                value="+504" inputmode="numeric" />
                        </div> -->

                        <div class="relative">
                            <label class="" for="">Correo</label>
                            <input type="email" id="correo" v-model="perfil.correo" required
                                class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                        </div>
                        <div></div>
                        <div class="relative">
                            <label for="input-file">
                                <!-- Aquí va la imagen actual del usuario -->
                                <span>Imagen actual</span>
                                <img :src="photoUrlSuperAdmin" alt="Imagen del usuario" @click="openFileInput"
                                    class="size-[150px] ml-12 rounded-[50%]" />
                            </label>
                        </div>
                        <div v-if="tempImageUrl">
                            <h1>Previa nueva imagen</h1>
                            <img :src="tempImageUrl" alt="Imagen seleccionada"
                                class="size-[150px] ml-12 rounded-[50%]" />
                        </div>

                        <!-- Input de tipo file oculto -->
                        <input type="file" id="input-file" style="display: none" @change="handleFileSelect"
                            accept="image/*" />

                        <button class="bg-gray-800 hover:bg-gray-700 text-pcd font-bold py-2 px-4 rounded-lg col-span-2"
                            :disabled="!fileSelected">
                            Guardar Perfil
                        </button>
                    </form>
                </div>
            </div>
        </main>
    </div>
</template>
