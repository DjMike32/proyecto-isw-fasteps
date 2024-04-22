<script setup>
    import { ref } from "vue";
    import { db, storage } from "../firebase";
    import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
    import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

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
    <form @submit.prevent="agregarNuevoTramite">
        <div>
            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" v-model="nuevoTramite.Descripcion" required></textarea>
        </div>
        <div>
            <label for="doc_necesaria">Documento Necesario</label>
            <input type="text" id="doc_necesaria" v-model="nuevoTramite.Doc_Necesaria" required />
        </div>
        <div>
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="nuevoTramite.Nombre" required />
        </div>
        <!-- Input para la imagen -->
        <div>
            <label for="img_presentacion">Imagen de Presentación</label>
            <input type="file" id="img_presentacion" @change="handleFileSelect" accept="image/*" required />
            <!-- Vista previa de la imagen seleccionada -->
            <img v-if="tempImageUrl" :src="tempImageUrl" alt="Imagen de Presentación"
                style="max-width: 300px; max-height: 300px" />
        </div>
        <!-- Input para los pasos -->
        <div v-for="(paso, index) in nuevoTramite.Pasos" :key="index">
            <label :for="'paso_' + index">Paso {{ index + 1 }}</label>
            <input type="text" :id="'paso_' + index" v-model="nuevoTramite.Pasos[index]" required />
        </div>
        <button type="button" @click="agregarPaso">Agregar Paso</button>
        <button type="submit">Agregar Trámite</button>
    </form>
</template>
