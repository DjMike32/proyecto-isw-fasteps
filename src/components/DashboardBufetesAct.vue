<script setup>
    import { ref } from "vue";
    import { db } from "../firebase.js";
    import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
    import { storage } from "../firebase";
    import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
    import { useRouter } from "vue-router";
    const router = useRouter();
    import {
        nombreSuperAdmin,
        photoUrlSuperAdmin,
        obtenerDatosSuperAdmin,
    } from "../loginFunctions";

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

    const bufeteIdToUpdate = ref("");
    const bufeteDataToUpdate = ref({
        email: "",
        display_name: "",
        phone_number: "",
        ContrasenaAsesores: "",
        administrador: "",
        photo_url: "", // Campo para almacenar la URL de la imagen
        // Agrega más campos según sea necesario
    });
    const file = ref(null); // Variable reactiva para almacenar el archivo seleccionado
    const fileSelected = ref(false); // Variable reactiva para controlar si se ha seleccionado un archivo
    const tempImageUrl = ref(null);

    // Función para manejar la selección de archivos
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

    // Función para subir la imagen a Firebase Storage y obtener su URL de descarga
    const uploadFile = async () => {
        try {
            if (!file.value) {
                console.error("No se ha seleccionado ningún archivo.");
                return;
            }

            const fileRef = storageRef(storage, `fotos/Bufetes/${file.value.name}`);
            await uploadBytes(fileRef, file.value);

            // Ahora obtenemos la URL de descarga después de que el archivo se haya subido correctamente
            const photoURL = await getDownloadURL(fileRef);

            // Agregar la URL de la imagen al campo photo_url del SuperAdmin
            bufeteDataToUpdate.value.photo_url = photoURL;

            console.log("URL de la imagen:", photoURL);
        } catch (error) {
            console.error("Error al subir el archivo:", error);
        }
    };

    const actualizarBufete = async () => {
        try {
            const bufeteDocRef = doc(db, "Bufetes", bufeteIdToUpdate.value);
            const bufeteDocSnap = await getDoc(bufeteDocRef);

            if (!bufeteDocSnap.exists()) {
                console.error("No se encontró el bufete con el UID proporcionado");
                return;
            }

            await uploadFile();
            const bufeteData = bufeteDocSnap.data();
            const newData = {
                ...bufeteData,
                ...bufeteDataToUpdate.value,
                // Agrega más campos según sea necesario
                fechaModificacion: serverTimestamp(), // Actualiza la fecha de modificación
            };

            await setDoc(bufeteDocRef, newData);
            console.log("Bufete actualizado correctamente.");

            // Limpiar el formulario después de actualizar el bufete
            bufeteIdToUpdate.value = "";
            bufeteDataToUpdate.value = {
                email: "",
                display_name: "",
                phone_number: "",
                ContrasenaAsesores: "",
                administrador: "",
                photo_url: "",
                // Agrega más campos según sea necesario
            };

            swal({
                icon: "success",
                title: "Bufete actualizado",
            });
        } catch (error) {
            console.error("Error al actualizar el bufete:", error);
            swal({
                icon: "error",
                title: "Error al actualizar el bufete",
            });
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
                    <router-link to="/sa/bufetes" class="flex flex-col justify-center m-4">
                        <button
                            class="flex flex-col items-center w-full text-3xl space-y-3 border-x-2 border-slate-400 opacity-30">
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
            <div class="bg-bgdark w-full h-full opacity-55 text-white box-border relative flex flex-col justify-center">
                <div class="">
                    <router-link to="/sa/bufetes"
                        class="flex flex-col justify-center mx-4 absolute ml-8 mt-4 text-2xl z-20 hover:scale-125">
                        <fa icon="fa-chevron-left fa-solid" />
                    </router-link>
                    <h1
                        class="static text-center w-full flex-1 animate__animated animate__bounce text-white animate__flipInX text-[55px] mt-2">
                        Actualizar Bufete
                    </h1>
                </div>
                <!-- <form @submit.prevent="agregarNuevoBufete" class="text-black">
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
                    </form> -->

                <form @submit.prevent="actualizarBufete"
                    class="bg-bgdark w-full h-full text-pcd box-border relative grid grid-cols-2 rounded-2xl text-2xl p-2 gap-6">
                    <div class="flex flex-col gap-y-1">
                        <label class="text-[85%] ml-1" for="bufeteId">ID del bufete</label>
                        <input type="text" id="bufeteId" v-model="bufeteIdToUpdate"
                            placeholder="Ingrese el ID del bufete" required
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder-text-white placeholder-opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div>
                    <div>
                        <label class="" for="email">Correo</label>
                        <input type="email" id="email" v-model="bufeteDataToUpdate.email"
                            placeholder="Correo electrónico" required
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder-text-white placeholder-opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div>
                    <div>
                        <label class="" for="displayName">Nombre del bufete</label>
                        <input type="text" id="displayName" v-model="bufeteDataToUpdate.display_name"
                            placeholder="Nombre del bufete" required
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder-text-white placeholder-opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div>
                    <div>
                        <label class="" for="phoneNumber">Número de teléfono</label>
                        <input type="tel" id="phoneNumber" v-model="bufeteDataToUpdate.phone_number"
                            placeholder="Número de teléfono" required pattern="\+504 \d{4}-\d{4}"
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder-text-white placeholder-opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2"
                            value="" inputmode="numeric" />
                    </div>
                    <div class="relative">
                        <label class="" for="administrador">Administrador</label>
                        <input type="text" id="administrador" v-model="bufeteDataToUpdate.administrador"
                            placeholder="Nombre del administrador" required
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder-text-white placeholder-opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div>
                    <div class="relative">
                        <label class="" for="contrasenaAsesores">Contraseña para asesores</label>
                        <input type="password" id="contrasenaAsesores" v-model="bufeteDataToUpdate.ContrasenaAsesores"
                            placeholder="Contraseña" autocomplete="off" required
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder-text-white placeholder-opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div>
                    <div class="relative col-span-2 mx-2">
                        <label class="" for="photo">Foto del bufete</label>
                        <input type="file" id="photo" @change="handleFileSelect" accept="image/*"
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder-text-white placeholder-opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div>
                    <div class="col-span-2 flex justify-center">
                        <button type="submit"
                            class="bg-gray-800 hover:bg-gray-700 text-pcd font-bold py-2 px-4 rounded-lg">
                            Actualizar Bufete
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>
</template>
