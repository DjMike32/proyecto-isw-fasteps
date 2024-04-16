<script setup>
    import { ref } from "vue";
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
            const nuevouid = "403ld5uQwQXO4zj0ePOnslD3I0d2";
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

            // Crear el nuevo bufete con la URL de la imagen y la fecha de creación

            // Agregar el nuevo bufete a la colección "Bufetes"
            await setDoc(doc(db, "Bufetes", nuevouid), nuevoBufeteConFecha);

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
        }
    };
</script>

<template>
    <div>
        <h2>Agregar Nuevo Bufete</h2>
        <form @submit.prevent="agregarNuevoBufete">
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

            <!-- Input para seleccionar la foto -->
            <input type="file" @change="handleFileSelect" accept="image/*" />

            <!-- Botón para subir la imagen y agregar el bufete -->
            <button type="submit" :disabled="!fileSelected">Agregar Bufete</button>
        </form>
    </div>
</template>
