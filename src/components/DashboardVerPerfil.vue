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
        ApellidoSuperAdmin,
        fechaCreacionSuperAdmin,
        perfilActualizado,
        correoSuperAdmin,
        fechaCreacionUsuario,
    } from "../loginFunctions";
    import { useRouter } from "vue-router";

    const router = useRouter();

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
                    <router-link to="/sa"
                        class="flex flex-col justify-center mx-4 absolute ml-8 mt-8 text-2xl z-20 hover:scale-125">
                        <fa icon="fa-chevron-left fa-solid" />
                    </router-link>
                    <h1
                        class="static text-center w-full flex-1 animate__animated animate__bounce text-white animate__flipInX text-[42px] mt-4">
                        Administrador {{ nombreSuperAdmin }} {{ ApellidoSuperAdmin }}
                    </h1>
                    <div class="flex justify-center">
                        <router-link to="/sa/perfil/actualizar"
                            class="flex flex-col justify-center mx-4 mt-4 text-2xl ml-12 z-20 hover:opacity-70 hover:shadow-md py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg">
                            <span>Editar Perfil</span>
                        </router-link>
                    </div>
                </div>
                <div class="grid flex-auto p-2 gap-20 mx-12 my-2">
                    <form @submit.prevent="guardarPerfil"
                        class="bg-bgdark w-full h-full text-pcd box-border relative grid grid-cols-2 rounded-2xl py-6 gap-8 text-3xl">
                        <!-- Contenedor para la imagen de perfil -->
                        <div class="relative flex flex-col items-center justify-center col-span-1 mb-8">
                            <img class="size-[250px] rounded-full" :src="photoUrlSuperAdmin" alt="Foto de perfil" />
                        </div>

                        <!-- Campos de texto -->
                        <div class="flex flex-col gap-y-4 col-span-1">
                            <!-- Campo: Nombre -->
                            <div class="flex flex-col gap-y-1">
                                <label class="text-3xl font-italic text-gray-400" for="nombre">Nombre:</label>
                                <h1 class="text-2xl text-white font-semibold">{{ nombreSuperAdmin }}</h1>
                            </div>

                            <!-- Campo: Apellido -->
                            <div class="flex flex-col gap-y-1">
                                <label class="text-3xl font-italic text-gray-400" for="apellido">Apellido:</label>
                                <h1 class="text-2xl text-white font-semibold">
                                    {{ ApellidoSuperAdmin }}
                                </h1>
                            </div>

                            <!-- Campo: Miembro desde -->
                            <div class="flex flex-col gap-y-1">
                                <label class="text-3xl font-italic text-gray-400" for="fechaCreacion">Miembro
                                    desde:</label>
                                <h1 class="text-2xl text-white font-semibold">
                                    {{ fechaCreacionUsuario }}
                                </h1>
                            </div>

                            <!-- Campo: Última Actualización -->
                            <div class="flex flex-col gap-y-1">
                                <label class="text-3xl font-italic text-gray-400" for="perfilActualizado">Última
                                    Actualización:</label>
                                <h1 class="text-2xl text-white font-semibold">
                                    {{ perfilActualizado }}
                                </h1>
                            </div>

                            <!-- Campo: Correo -->
                            <div class="flex flex-col gap-y-1">
                                <label class="text-3xl font-italic text-gray-400" for="correo">Correo:</label>
                                <h1 class="text-2xl text-white font-semibold">{{ correoSuperAdmin }}</h1>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
</template>
