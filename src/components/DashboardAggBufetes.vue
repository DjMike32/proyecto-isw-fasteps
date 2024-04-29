<script setup>
    import Swal from "sweetalert2";
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
        ContrasenaAsesores: "YXNkMTIz",
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
                if (bufete.idBufete > ultimoId) {
                    ultimoId = bufete.idBufete;
                }
            });

            // Incrementar el último id_Bufete para el nuevo bufete
            const nuevoId = ultimoId + 1;
            await uploadFile();

            // Crear el nuevo bufete con el nuevo id_Bufete y la fecha de creación
            const nuevoBufeteConFecha = {
                ...nuevoBufete.value,
                idBufete: nuevoId,
                created_time: serverTimestamp(),
            };

            // Agregar el nuevo bufete a la colección "Bufetes"
            await setDoc(doc(db, "Bufetes", inputValue.value), nuevoBufeteConFecha);

            // Limpiar el formulario después de agregar el bufete
            nuevoBufete.value = {
                email: "",
                display_name: "",
                ContrasenaAsesores: "YXNkMTIz",
                administrador: "",
                photo_url: "",
            };

            // Mostrar Sweet Alert de éxito
            Swal.fire("Éxito", "¡El bufete se agregó correctamente!", "success");

            console.log("Bufete agregado exitosamente");
        } catch (error) {
            console.error("Error al agregar el bufete:", error);
            Swal.fire("Error", "Hubo un problema al agregar el bufete", "error");
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
                        Agregar Bufete
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

                <form @submit.prevent="agregarNuevoBufete"
                    class="bg-bgdark w-full h-full text-pcd box-border relative grid grid-cols-2 rounded-2xl text-2xl p-2 gap-6">
                    <div class="flex flex-col gap-y-1">
                        <label class="text-[85%] ml-1" for="" placeholder="">UID del bufete</label>
                        <input type="text" v-model="inputValue" placeholder="Ingrese el UID"
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div>

                    <div>
                        <label class="" for="">Correo</label>
                        <input type="email" id="email" placeholder="Ej. bufete@gmail.com" v-model="nuevoBufete.email"
                            required
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div>
                    <div>
                        <label class="" for="">Nombre del bufete</label>
                        <input type="text" id="display_name" placeholder="Ej. bufetesHN"
                            v-model="nuevoBufete.display_name" required
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div>

                    <!-- <div>
                        <label class="" for="">Telefono</label>
                        <input type="tel" id="phone-number" placeholder="Ej. +504 2212-3456"
                            v-model="nuevoBufete.phone_number" required pattern="\+504 \d{4}-\d{4}"
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2"
                            value="" inputmode="numeric" />
                    </div> -->
                    <div class="relative">
                        <label class="" for="administrador">Administrador</label>
                        <input type="text" id="administrador" v-model="nuevoBufete.administrador" required
                            placeholder="Nombre del administrador" pattern="[a-zA-Z\s]+"
                            title="Solo se permiten letras del abecedario"
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div>
                    <!-- <div class="relative">
                        <label class="" for="">Password temporal</label>
                        <input type="text" id="ContrasenaAsesores" v-model="nuevoBufete.ContrasenaAsesores" required
                            placeholder="password" autocomplete="off"
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div> -->
                    <div class="relative col-span-1 mx-2">
                        <label class="" for="">Logo del bufete</label>
                        <input type="file" @change="handleFileSelect" accept="image/*"
                            class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                    </div>
                    <div class="col-span-2 flex justify-center">
                        <button class="bg-gray-800 hover:bg-gray-700 text-pcd font-bold py-2 px-4 rounded-lg">
                            Ingresar Datos
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>
</template>
