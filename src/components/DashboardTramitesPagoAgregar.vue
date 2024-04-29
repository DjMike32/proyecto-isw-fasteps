<script setup>
    import { ref } from "vue";
    import { db, storage } from "../firebase";
    import {
        collection,
        addDoc,
        getDocs,
        query,
        orderBy,
        limit,
        doc,
    } from "firebase/firestore";
    import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
    import {
        nombreSuperAdmin,
        photoUrlSuperAdmin,
        obtenerDatosSuperAdmin,
    } from "../loginFunctions";
    const selectedTipoCertificacionRef = ref(null);

    const tiposCertificacion = ref([]);
    const nuevoTramite = ref({
        id_Tramite: null,
        Descripcion: "",
        Precio: "",
        Doc_Necesaria: "",
        Nombre: "",
        Pasos: [],
        Img_Presentacion: "", // Agregar campo para almacenar la URL de la imagen
        Certificacion_Necesaria: "",
        TipoCertificacionNecesaria: "",
    });

    const tempImageUrl = ref(null); // Variable reactiva para mostrar la vista previa de la imagen seleccionada

    // Función para agregar un nuevo trámite

    const agregarPaso = () => {
        nuevoTramite.value.Pasos.push("");
    };

    function validarPrecio(event) {
        // Eliminar cualquier caracter que no sea un número
        nuevoTramite.value.Precio = event.target.value.replace(/\D/g, "");
    }

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
    const loadTiposCertificacion = async () => {
        const querySnapshot = await getDocs(collection(db, "TipoCertificacion"));
        tiposCertificacion.value = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    };

    const obtenerYMostrarReferencia = () => {
        if (selectedTipoCertificacionRef.value) {
            const tipoCertificacionSeleccionado = tiposCertificacion.value.find(
                (tipo) => tipo.id === selectedTipoCertificacionRef.value
            );
            if (tipoCertificacionSeleccionado) {
                // Construir la referencia al documento en Firestore
                return doc(db, "TipoCertificacion", selectedTipoCertificacionRef.value);
            }
        }
        console.error("Seleccione un tipo de certificación antes de mostrar la referencia.");
        return null; // Devolver null si no se selecciona ningún tipo de certificación
    };

    // Llamar a la función en agregarNuevoTramite y asignar el valor de referencia al campo Certificacion_Necesaria
    const agregarNuevoTramite = async () => {
        try {
            // Subir la imagen seleccionada antes de agregar el trámite
            await uploadImage();

            // Obtener el valor de referencia
            const referencia = obtenerYMostrarReferencia();

            if (referencia) {
                // Asignar el valor de referencia al campo Certificacion_Necesaria
                nuevoTramite.value.Certificacion_Necesaria = referencia;

                // Obtener el último ID de trámite almacenado en la colección
                const lastTramiteSnapshot = await getDocs(
                    query(collection(db, "Tipo_Tramite"), orderBy("id_Tramite", "desc"), limit(1))
                );
                let lastTramiteId = 0;
                lastTramiteSnapshot.forEach((doc) => {
                    lastTramiteId = doc.data().id_Tramite;
                });

                // Incrementar el ID para el nuevo trámite
                nuevoTramite.value.id_Tramite = lastTramiteId + 1;
                nuevoTramite.value.Precio = parseFloat(nuevoTramite.value.Precio);

                // Agregar el nuevo trámite a la colección "Tramites_Gratuitos"
                const docRef = await addDoc(collection(db, "Tipo_Tramite"), nuevoTramite.value);
                console.log("Trámite agregado con ID: ", docRef.id);

                // Limpiar el formulario después de agregar el trámite
                nuevoTramite.value = {
                    id_Tramite: null,
                    Descripcion: "",
                    Precio: "",
                    Doc_Necesaria: "",
                    Nombre: "",
                    Pasos: [],
                    Img_Presentacion: "", // Limpiar el campo de la URL de la imagen
                    Certificacion_Necesaria: "",
                    TipoCertificacionNecesaria: "",
                };

                console.log("Trámite agregado exitosamente");
            } else {
                console.error(
                    "Error al agregar el trámite: No se ha seleccionado ningún tipo de certificación."
                );
            }
        } catch (error) {
            console.error("Error al agregar el trámite: ", error);
        }
    };

    loadTiposCertificacion();

    const obtenerUidYFormatear = async (idTipo) => {
        try {
            // Obtiene la referencia del documento TipoCertificacion con el id proporcionado
            const tipoCertificacionRef = doc(db, "TipoCertificacion", idTipo);
            console.log("Referencia del documento TipoCertificacion:", tipoCertificacionRef);
            // Obtiene los datos del documento TipoCertificacion
            const tipoCertificacionSnap = await getDoc(tipoCertificacionRef);

            // Verifica si el documento existe
            if (tipoCertificacionSnap.exists()) {
                // Obtiene el Uid del documento TipoCertificacion
                const uid = tipoCertificacionSnap.id;
                // Formatea la cadena con el Uid y el tipo de certificación
                const certificacionNecesariaRef = doc(
                    db,
                    "TipoCertificacion",
                    selectedTipoCertificacionRef.value
                );

                // Asigna el valor formateado al campo CertificacionNecesaria del nuevo trámite
                nuevoTramite.value.CertificacionNecesaria = certificacionNecesaria;
            } else {
                console.error("El documento TipoCertificacion no existe");
            }
        } catch (error) {
            console.error("Error al obtener y formatear el Uid:", error);
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
                    <router-link to="/sa/tramites" class="flex flex-col justify-center m-4">
                        <button
                            class="flex flex-col items-center w-full border-slate-400 border-x-2 text-3xl space-y-3 opacity-30">
                            <fa icon="fa-file-signature fa-solid" />
                            <h2>Tramites</h2>
                        </button>
                    </router-link>
                    <router-link to="/sa/perfil/ver"
                        class="flex flex-col justify-center m-4 hover:border-x-2 hover:border-slate-400">
                        <button class="flex flex-col items-center w-full text-3xl space-y-3 hover:scale-110">
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
            <div
                class="bg-bgdark w-full h-full opacity-55 text-white box-border relative flex flex-col justify-center overflow-y-auto">
                <div class="">
                    <router-link to="/sa/tramites/pago"
                        class="flex flex-col justify-center mx-4 absolute ml-8 mt-10 text-2xl z-20 hover:scale-125">
                        <fa icon="fa-chevron-left fa-solid" />
                    </router-link>
                    <h1
                        class="static text-center w-full flex-1 animate__animated animate__bounce text-white animate__flipInX text-3xl mt-8">
                        Agregar Tramite de Pago
                    </h1>
                </div>

                <form @submit.prevent="agregarNuevoTramite"
                    class="bg-bgdark w-full h-full text-pcd box-border relative grid grid-cols-2 rounded-2xl text-lg p-2 gap-4">
                    <div class="flex flex-col gap-y-1">
                        <label class="text-[85%] ml-1" for="">Seleccione un tipo de certificación</label>
                        <select v-model="selectedTipoCertificacionRef"
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2">
                            <option disabled value="">Seleccione un tipo de certificación</option>
                            <option v-for="tipoCertificacion in tiposCertificacion" :key="tipoCertificacion.id"
                                :value="tipoCertificacion.id">
                                {{ tipoCertificacion.NombreCertificacion }}
                            </option>
                        </select>
                    </div>

                    <div class="col-span-1 flex flex-col">
                        <label class="text-[85%] ml-1" for="">Debe coincidir con el tipo de certificación necesaria
                            (abajo)
                        </label>
                        <button @click="obtenerYMostrarReferencia"
                            class="bg-gray-800 hover:bg-gray-700 text-pcd font-bold py-2 px-4 rounded-lg">
                            Confirmar Certificacion
                        </button>
                    </div>

                    <div class="col-span-1">
                        <label for="descripcion">Descripción</label>
                        <textarea id="descripcion" v-model="nuevoTramite.Descripcion"
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2"
                            required></textarea>
                    </div>

                    <div>
                        <label for="precio">Precio del tramite</label>
                        <input type="text" id="precio" v-model="nuevoTramite.Precio" @input="validarPrecio" required
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div>
                    <div>
                        <label for="doc_necesaria">Documento Necesario</label>
                        <input type="text" id="doc_necesaria" v-model="nuevoTramite.Doc_Necesaria" required
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div>

                    <div>
                        <label for="nombre">Nombre</label>
                        <input type="text" id="nombre" v-model="nuevoTramite.Nombre" required
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div>

                    <div class="col-span-1">
                        <label for="img_presentacion">Imagen de Presentación</label>
                        <input type="file" id="img_presentacion" @change="handleFileSelect" accept="image/*" required
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                        <!-- Vista previa de la imagen seleccionada -->
                        <img v-if="tempImageUrl" :src="tempImageUrl" alt="Imagen de Presentación"
                            class="size-[100px]" />
                    </div>

                    <div>
                        <label for="tipoCertificacionNecesaria">Tipo de Certificación Necesaria</label>
                        <select v-model="nuevoTramite.TipoCertificacionNecesaria" required
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2">
                            <option disabled value="">Seleccione un tipo de certificación</option>
                            <option v-for="tipoCertificacion in tiposCertificacion" :key="tipoCertificacion.id"
                                :value="tipoCertificacion.IdTipo">
                                {{ tipoCertificacion.NombreCertificacion }}
                            </option>
                        </select>
                    </div>
                    <!-- <div class="col-span-2 flex justify-center">
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
                    </div> -->

                    <!-- Input para los pasos -->

                    <div class="col-span-2 flex justify-center">
                        <button type="submit"
                            class="bg-gray-800 hover:bg-gray-700 text-pcd font-bold py-2 px-4 rounded-lg flex items-center">
                            Agregar Trámite
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>
</template>
