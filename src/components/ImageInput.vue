<script setup>
    import { ref } from "vue";
    import { storage } from "../firebase"; // Ajusta la importación según tu configuración
    import { ref as storageRef, uploadBytes } from "firebase/storage";

    const file = ref(null);

    const handleFileSelect = (event) => {
        file.value = event.target.files[0]; // Obtiene el archivo seleccionado por el usuario
    };

    const uploadFile = async () => {
        if (!file.value) {
            console.error("No se ha seleccionado ningún archivo.");
            return;
        }

        try {
            const fileRef = storageRef(storage, "prueba-fotos-bufetes/" + file.value.name);
            const snapshot = await uploadBytes(fileRef, file.value);
            console.log("Archivo subido con éxito:", snapshot);
            // Aquí podrías realizar acciones adicionales, como actualizar la interfaz de usuario
        } catch (error) {
            console.error("Error al subir el archivo:", error);
        }
    };
</script>

<template>
    <div>
        <form @submit.prevent="uploadFile">
            <input type="file" @change="handleFileSelect" accept="image/*" />
            <button type="submit">Subir Archivo</button>
        </form>
    </div>
</template>
