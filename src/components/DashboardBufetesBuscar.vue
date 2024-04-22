<script setup>
    import swal from "sweetalert";
    import { eliminarUsuario } from "../main";
    import { onMounted } from "vue";
    import { RouterLink } from "vue-router";
    import { ref, watchEffect } from "vue";
    import { db, auth } from "../firebase";
    import { addDoc, collection, doc, getDoc } from "firebase/firestore";
    import {
        nombreSuperAdmin,
        photoUrlSuperAdmin,
        obtenerDatosSuperAdmin,
    } from "../loginFunctions";
    // Importa el hook useRouter
    // Ajusta la importación según tu configuración
    import { watch } from "vue";
    import { getDocs, query, where } from "firebase/firestore";
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
    // Importa tu instancia de Firebase Firestore

    const bufetes = ref([]);
    const searchTerm = ref("");

    // Función para cargar los bufetes desde la base de datos
    const loadBufetes = async () => {
        const querySnapshot = await getDocs(collection(db, "Bufetes"));
        bufetes.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    // Filtrar bufetes basado en el término de búsqueda
    const filteredBufetes = ref([]);
    const filterBufetes = () => {
        if (!searchTerm.value) {
            // Si no hay término de búsqueda, mostrar todos los bufetes
            filteredBufetes.value = bufetes.value;
        } else {
            // Si hay un término de búsqueda, filtrar los bufetes
            filteredBufetes.value = bufetes.value.filter(
                (bufete) =>
                    bufete.display_name &&
                    bufete.display_name.toLowerCase().includes(searchTerm.value.toLowerCase())
            );
        }
    };
    // Cargar bufetes cuando el componente esté montado
    onMounted(() => {
        loadBufetes();
    });

    // Escuchar cambios en el término de búsqueda y filtrar bufetes
    watch(searchTerm, () => {
        filterBufetes();
    });

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

    const copiarUID = (uid) => {
        navigator.clipboard
            .writeText(uid)
            .then(() => {
                console.log("UID copiado al portapapeles:", uid);
                // Aquí podrías mostrar algún mensaje de éxito o realizar otras acciones si lo deseas
            })
            .catch((error) => {
                console.error("Error al copiar UID:", error);
                // Manejar el error si la copia falla
            });
    };
    // Llama a la función successAlert dentro de onMounted para garantizar que el DOM se haya cargado completamente
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
                            class="flex flex-col items-center w-full border-slate-400 border-x-2 text-3xl space-y-3 opacity-30">
                            <fa icon="fa-user-tie fa-solid" />
                            <h2>Bufetes</h2>
                        </button>
                    </router-link>
                    <router-link to="/sa/tramites" class="flex flex-col justify-center mx-4">
                        <button
                            class="flex flex-col items-center w-full hover: border-slate-400 hover:border-x-2 text-3xl space-y-3">
                            <fa icon="fa-file-signature fa-solid" />
                            <h2>Tramites</h2>
                        </button>
                    </router-link>
                    <router-link to="/sa/perfil/ver" class="flex flex-col justify-center mx-4">
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
            <div class="bg-bgdark w-full h-full opacity-55 text-white box-border relative flex flex-col justify-start">
                <div class="">
                    <router-link to="/sa/bufetes"
                        class="flex flex-col justify-center mx-4 absolute ml-8 mt-4 text-2xl z-20 hover:scale-125">
                        <fa icon="fa-chevron-left fa-solid" />
                    </router-link>
                    <h1
                        class="static text-center w-full flex-1 animate__animated animate__bounce text-white animate__flipInX text-[55px] mt-2">
                        Buscar Bufetes
                    </h1>
                </div>
                <div>
                    <h2>Lista de Bufetes</h2>
                    <input type="text" v-model="searchTerm" placeholder="Buscar por nombre" />
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre del Bufete</th>
                                <th>Correo</th>
                                <th>Teléfono</th>
                                <th>Administrador</th>
                                <th>Password Temporal</th>
                                <th>Imagen</th>
                                <th>UID</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="bufete in filteredBufetes" :key="bufete.id"
                                :class="index % 2 === 0 ? 'even-row' : 'odd-row'" :hover="hover - opacity">
                                <td>{{ bufete.display_name }}</td>
                                <td>{{ bufete.email }}</td>
                                <td>{{ bufete.phone_number }}</td>
                                <td>{{ bufete.administrador }}</td>
                                <td>{{ bufete.ContrasenaAsesores }}</td>
                                <td>
                                    <img :src="bufete.photo_url" alt="Imagen del Bufete"
                                        style="max-width: 100px; max-height: 100px" />
                                </td>
                                <td>
                                    <span @click="copiarUID(bufete.id)"
                                        style="cursor: pointer; color: blue; text-decoration: underline">
                                        Copiar UID
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>

    <!-- <div>
        <form @submit.prevent="agregarUsuario">
            <input type="text" v-model="nombre" placeholder="Nombre" />
            <input type="email" v-model="correo" placeholder="Correo electrónico" />
            <button type="submit">Agregar Usuario</button>
        </form>
    </div> -->
    <!-- <div class="container bg-white opacity-70 h-3/4 py-10 w-2/3">
        <button class="w-1/3 h-8 text-sm bg-red-200" @click="agregarUsuario('pedro', 'josue')">agregar</button>
    </div> -->
</template>

<style scoped>

    /* Agrega estilos CSS según sea necesario */
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        border: 1px solid #383030;
        padding: 8px;
    }

    th {
        background-color: #374357;
    }

    tr:hover {
        opacity: 80%;
    }

    .scroll-container {
        overflow-y: auto;
        /* Agrega un scroll vertical si el contenido excede la altura */
        max-height: 500px;
        /* Altura máxima del contenedor antes de que aparezca el scroll */
    }

    .bg-gray {
        background-color: #29353c;
    }

    .bg-gray-100 {
        background-color: #0f1c2e;
    }

    .bg-white {
        background-color: rgb(38, 38, 61);
    }

    .even-row {
        background-color: #0e2d52;
    }

    .odd-row {
        background-color: #44576d;
    }

    .hover-opacity:hover {
        opacity: 0.8;
    }
</style>
