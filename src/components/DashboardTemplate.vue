<script setup>
    import swal from "sweetalert";
    import { eliminarUsuario } from "../main";
    import { onMounted } from "vue";
    import { RouterLink } from "vue-router";
    import { ref } from "vue";
    import { db, storage } from "../firebase";
    import { addDoc, collection } from "firebase/firestore";
    import { getStorage } from "firebase/storage";
    import ImageInput from "../components/ImageInput.vue";

    // Get a reference to the storage service, which is used to create references in your storage bucket

    // Create a storage reference from our storage service

    const imageUrl = ref(null);
    const file = ref(null);

    const uploadImage = async () => {
        if (!file.value) {
            console.error("No se ha seleccionado ningún archivo.");
            return;
        }

        try {
            const storageRef = storage.ref(); // Referencia al Storage de Firebase
            const fileRef = storageRef.child(file.value.name); // Crea una referencia al archivo en Firebase Storage
            await fileRef.put(file.value); // Sube el archivo a Firebase Storage
            const downloadUrl = await fileRef.getDownloadURL(); // Obtiene la URL de descarga del archivo subido
            imageUrl.value = downloadUrl; // Asigna la URL de la imagen subida para mostrarla en la interfaz
        } catch (error) {
            console.error("Error al cargar la imagen:", error);
        }
    };

    const handleFileUpload = (event) => {
        file.value = event.target.files[0];
    };

    const nombre = ref("");
    const correo = ref("");

    const agregarUsuario = async () => {
        // Verificar que los campos nombre y correo no estén vacíos
        if (!nombre.value.trim() || !correo.value.trim()) {
            swal("Por favor ingresa el nombre y correo del usuario", "intenta de nuevo", "error");
            return; // Salir de la función si algún campo está vacío
        }

        try {
            await addDoc(collection(db, "usuarios"), {
                nombre: nombre.value,
                correo: correo.value,
            });
            swal("Usuario agregado con éxito", " ", "success");
            // Restablecer los valores de los campos después de agregar el usuario
            nombre.value = "";
            correo.value = "";
        } catch (error) {
            console.error("Error al agregar usuario:", error);
        }
    };

    const inputValue = ref("");
    // Llama a la función successAlert dentro de onMounted para garantizar que el DOM se haya cargado completamente
</script>

<template>
    <div class="flex h-screen bg-bgblue">
        <!--
    /**
     ! hola 
    */ 
    -->
        <aside
            class="w-1/4 bg-bgblue text-pcd border-r-[0.5px] border-white my-4 flex flex-col justify-between justify-items-center pr-2">
            <div class="flex bg-[#eeeeee1b] rounded-xl relative h-6 w-auto items-center ml-1.5 gap-3.5">
                <img class="rounded-full size-6 scale-125" src="../assets/profile1.jfif" alt="" />
                <h1 class="text-3xl font-bold">Michael</h1>
            </div>

            <!-- Lista de elementos del sidebar -->

            <!-- Elemento 1-->
            <div class="flex text-sm pl-2">
                <button class="w-full hover:border-slate-400 hover:border-x-2 p-1">
                    <fa icon="fa-user-tie fa-solid" />
                    <h2>Bufetes</h2>
                </button>
            </div>
            <!-- Elemento 2 -->
            <div class="text-sm pl-2">
                <router-link to="/sa/tramites">
                    <button class="flex flex-col items-center w-full hover:border-slate-400 hover:border-x-2 p-1">
                        <fa icon="fa-file-signature fa-solid" />
                        <h2>Tramites</h2>
                    </button>
                </router-link>
            </div>

            <div class="text-sm pl-2 text-pcd">
                <button class="w-full hover: border-slate-400 hover:border-x-2">
                    <fa icon="fa-id-card fa-solid" />
                    <h2>Perfil</h2>
                </button>
            </div>
            <div class="text-sm pl-2">
                <router-link to="/" class="">
                    <button class="flex flex-col items-center w-full hover: border-slate-400 hover:border-x-2">
                        <fa icon="fa-right-from-bracket fa-solid" />
                        <h2>Cerrar Sesión</h2>
                    </button>
                </router-link>
            </div>
            <!-- Elemento 3 -->
        </aside>
        <!-- Contenido principal -->
        <main class="flex-1 p-4 box-border">
            <form @submit.prevent
                class="bg-bgdark w-full h-full text-pcd box-border relative grid grid-cols-2 rounded-2xl text-3xl p-2 gap-6">
                <h1 class="text-pcd text-center col-span-2 text-md">Nuevo bufete</h1>
                <div class="flex flex-col gap-y-1">
                    <label class="text-[85%] ml-1" for="" placeholder="hola">Nombre del bufete</label>
                    <input type="text" placeholder="ej. bufete central"
                        class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                </div>
                <div>
                    <label class="" for="">Direccion del bufete</label>
                    <div class="select-container relative">
                        <select
                            class="w-full p-1 text-pce italic bg-gray-800 placeholder-italic placeholder-text-white placeholder-opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2 overflow-y-auto max-h-40">
                            <option value="san-pedro-sula">San Pedro Sula</option>
                            <option value="tegucigalpa">Tegucigalpa</option>
                            <option value="la-ceiba">La Ceiba</option>
                            <option value="san-pedro-sula">San Pedro Sula</option>
                            <option value="tegucigalpa">Tegucigalpa</option>
                            <option value="la-ceiba">La Ceiba</option>
                            <option value="san-pedro-sula">San Pedro Sula</option>
                            <option value="la-ceiba">La Ceiba</option>
                            <option value="san-pedro-sula">San Pedro Sula</option>
                            <option value="tegucigalpa">Tegucigalpa</option>
                            <option value="la-ceiba">La Ceiba</option>
                            <option value="san-pedro-sula">San Pedro Sula</option>

                            <!-- Agrega más opciones si es necesario -->
                        </select>
                    </div>
                </div>
                <div>
                    <label class="" for="">Telefono</label>
                    <input type="" pattern="\+504 \d{4}-\d{4}"
                        class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2"
                        value="+504" inputmode="numeric" />
                </div>
                <div>
                    <label class="" for="">Telefono</label>
                    <input type="" pattern="\+504 \d{4}-\d{4}"
                        class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2"
                        value="+504" inputmode="numeric" />
                </div>

                <div class="relative">
                    <label class="" for="">Correo</label>
                    <input type="text" v-model="inputValue" placeholder="Ingresa tu texto"
                        class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2" />
                </div>
                <div>
                    <label class="" for="">Telefono</label>
                    <input type="" pattern="\+504 \d{4}-\d{4}"
                        class="w-full p-1 text-pce bg-gray-800 placeholder:italic placeholder:text-white placeholder:opacity-70 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white border-0 pl-2"
                        value="+504" inputmode="numeric" />
                </div>

                <!-- <div class="p-1 col-span-2">
                    <input type="file"
                        class="w-full text-sm text-slate-500 file:py-2 file:rounded-full file:border-0 file:text-3xlfile:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                </div> -->

                <button class="bg-gray-800 hover:bg-gray-700 text-pcd font-bold py-2 px-4 rounded-lg">
                    Ingresar Datos
                </button>

                <!-- <div>
                    <h1 class=" static text-center w-full flex-1 animate__animated animate__bounce text-pcd">
                    Bufetes
                    </h1>
            </div>
            <div class="grid flex-auto p-2 grid-cols-2 gap-4">
                <button class="bg-pcb rounded-xl" @click="agregarUsuario('MG2', 'MG2@gmail.com')">
                    <fa icon="fa-plus fa-solid" />
                    <h2>Agregar</h2>
                </button>
                <button class="bg-pcb rounded-xl" @click="eliminarUsuario('AiyNCEQoYYHqvb6THQQ1')">
                    <fa icon="fa-trash fa-solid" />
                    <h2>Eliminar</h2>
                </button>
                <button class="bg-pcb rounded-xl">
                    <fa icon="fa-magnifying-glass fa-solid" />
                    <h2>Buscar</h2>
                </button>
                <button class="bg-pcb rounded-xl" @click="successAlert">
                    <fa icon="fa-pen fa-solid" />
                    <h2>Actualizar</h2>
                </button>
            </div> -->
            </form>
            <div>
                <input type="file" @change="handleFileUpload" />
                <button @click="uploadImage">Subir imagen</button>
                <img v-if="imageUrl" :src="imageUrl" alt="Imagen subida" />
            </div>
        </main>
    </div>

    <br />
    <br />
    <br />

    <ImageInput></ImageInput>
    <!-- <div class="container bg-white opacity-70 h-3/4 py-10 w-2/3">
        <button class="w-1/3 h-8 text-sm bg-red-200" @click="agregarUsuario('pedro', 'josue')">agregar</button>
    </div> -->
</template>

<style>
    .swal-button {
        padding: 7px 19px;
        border-radius: 2px;
        background-color: #4962b3;
        font-size: 12px;
        border: 1px solid #3e549a;
        text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.3);
    }

    .swal-modal {
        width: 60%;
    }
</style>
