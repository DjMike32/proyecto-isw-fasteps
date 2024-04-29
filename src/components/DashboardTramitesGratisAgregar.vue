<script setup>
    import Swal from "sweetalert2";
    import { ref } from "vue";
    import { db, storage } from "../firebase";
    import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
    import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
    import {
        nombreSuperAdmin,
        photoUrlSuperAdmin,
        obtenerDatosSuperAdmin,
    } from "../loginFunctions";

    const nuevoTramite = ref({
        id_Tramite: null,
        Descripcion: "",
        Doc_Necesaria: "",
        Nombre: "",
        Pasos: [],
        Img_Presentacion: "", // Agregar campo para almacenar la URL de la imagen
    });

    const tempImageUrl = ref(null); // Variable reactiva para mostrar la vista previa de la imagen seleccionada

    // Función para agregar un nuevo trámite
    const agregarNuevoTramite = async () => {
        try {
            // Subir la imagen seleccionada antes de agregar el trámite
            await uploadImage();

            // Obtener el último ID de trámite almacenado en la colección
            const lastTramiteSnapshot = await getDocs(
                query(collection(db, "Tramites_Gratuitos"), orderBy("id_Tramite", "desc"), limit(1))
            );
            let lastTramiteId = 0;
            lastTramiteSnapshot.forEach((doc) => {
                lastTramiteId = doc.data().id_Tramite;
            });

            // Incrementar el ID para el nuevo trámite
            nuevoTramite.value.id_Tramite = lastTramiteId + 1;

            // Agregar el nuevo trámite a la colección "Tramites_Gratuitos"
            const docRef = await addDoc(collection(db, "Tramites_Gratuitos"), nuevoTramite.value);
            console.log("Trámite agregado con ID: ", docRef.id);

            // Limpiar el formulario después de agregar el trámite
            nuevoTramite.value = {
                id_Tramite: null,
                Descripcion: "",
                Doc_Necesaria: "",
                Nombre: "",
                Pasos: [],
                Img_Presentacion: "", // Limpiar el campo de la URL de la imagen
            };

            // Mostrar Sweet Alert de éxito
            Swal.fire({
                title: "¡Trámite agregado exitosamente!",
                icon: "success",
            });

            console.log("Trámite agregado exitosamente");
        } catch (error) {
            console.error("Error al agregar el trámite: ", error);
        }
    };

    const agregarPaso = () => {
        nuevoTramite.value.Pasos.push("");
    };

    // Función para manejar la selección de archivos
    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // Crear una URL temporal para mostrar la imagen seleccionada
            tempImageUrl.value = URL.createObjectURL(selectedFile);
            nuevoTramite.value.Img_Presentacion = selectedFile; // Asignar el archivo seleccionado al campo de la imagen
        } else {
            tempImageUrl.value = null;
            nuevoTramite.value.Img_Presentacion = null; // Limpiar el campo de la imagen si no se selecciona ningún archivo
        }
    };

    // Función para subir la imagen seleccionada a Firebase Storage
    const uploadImage = async () => {
        try {
            if (!nuevoTramite.value.Img_Presentacion) {
                console.error("No se ha seleccionado ninguna imagen.");
                return;
            }

            const fileRef = storageRef(
                storage,
                `fotos/tramites/${nuevoTramite.value.Img_Presentacion.name}`
            );
            await uploadBytes(fileRef, nuevoTramite.value.Img_Presentacion);

            // Obtener la URL de descarga después de que la imagen se haya subido correctamente
            const imageUrl = await getDownloadURL(fileRef);

            // Asignar la URL de la imagen al campo Img_Presentacion del nuevo trámite
            nuevoTramite.value.Img_Presentacion = imageUrl;

            console.log("URL de la imagen subida correctamente:", imageUrl);
        } catch (error) {
            console.error("Error al subir la imagen:", error);
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
                            class="flex flex-col items-center w-full hover:border-slate-400 hover:border-x-2 text-3xl space-y-3">
                            <fa icon="fa-user-tie fa-solid" />
                            <h2>Bufetes</h2>
                        </button>
                    </router-link>
                    <router-link to="/sa/tramites" class="flex flex-col justify-center mx-4">
                        <button
                            class="flex flex-col items-center w-full border-slate-400 border-x-2 text-3xl space-y-3 opacity-30">
                            <fa icon="fa-file-signature fa-solid" />
                            <h2>Tramites</h2>
                        </button>
                    </router-link>
                    <router-link to="/sa/actualizar" class="flex flex-col justify-center mx-4">
                        <button
                            class="flex flex-col items-center w-full hover: border-slate-400 hover:border-x-2 text-3xl space-y-3">
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
            <div
                class="bg-bgdark w-full h-full opacity-55 text-white box-border relative flex flex-col justify-start overflow-y-auto">
                <div class="mx-4 mt-8 flex flex-row">
                    <router-link to="/sa/tramites/gratis"
                        class="flex flex-col justify-center text-2xl z-20 hover:scale-125">
                        <fa icon="fa-chevron-left fa-solid" class="text-white" />
                    </router-link>
                    <h1 class="text-center text-3xl mt-2 inline-block ml-14">
                        Agregar Trámite Gratuito
                    </h1>
                </div>
                <form @submit.prevent="agregarNuevoTramite" class="bg-bgdark p-4 rounded-lg shadow-lg grid-cols-2">
                    <div class="mb-4 col-span-1">
                        <label for="descripcion" class="block text-white mb-1">Descripción</label>
                        <textarea id="descripcion" v-model="nuevoTramite.Descripcion" required
                            class="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0"
                            rows="4"></textarea>
                    </div>
                    <div class="mb-4">
                        <label for="doc_necesaria" class="block text-white mb-1">Documento Necesario</label>
                        <input type="text" id="doc_necesaria" v-model="nuevoTramite.Doc_Necesaria" required
                            class="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0" />
                    </div>
                    <div class="mb-4">
                        <label for="nombre" class="block text-white mb-1">Nombre</label>
                        <input type="text" id="nombre" v-model="nuevoTramite.Nombre" required
                            class="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0" />
                    </div>
                    <!-- Input para la imagen -->
                    <div class="mb-4">
                        <label for="img_presentacion" class="block text-white mb-1">Imagen de Presentación</label>
                        <input type="file" id="img_presentacion" @change="handleFileSelect" accept="image/*" required
                            class="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0" />
                        <!-- Vista previa de la imagen seleccionada -->
                        <img v-if="tempImageUrl" :src="tempImageUrl" alt="Imagen de Presentación"
                            class="mt-2 max-w-full max-h-32" />
                    </div>
                    <!-- Input para los pasos -->
                    <div class="col-span-2 flex justify-center">
                        <button @click="agregarPaso"
                            class="bg-gray-800 hover:bg-gray-700 text-pcd font-bold py-2 px-4 rounded-lg">
                            Agregar Pasos
                            <fa icon="fa-plus fa-solid" />
                        </button>
                    </div>
                    <div class="col-span-1" v-for="(paso, index) in nuevoTramite.Pasos" :key="index">
                        <label :for="'paso_' + index">Paso {{ index + 1 }}</label>
                        <input type="text" :id="'paso_' + index" v-model="nuevoTramite.Pasos[index]" required
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div>
                    <button type="submit"
                        class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg mt-4">
                        Agregar Trámite
                    </button>
                </form>
            </div>
        </main>
    </div>
</template>
