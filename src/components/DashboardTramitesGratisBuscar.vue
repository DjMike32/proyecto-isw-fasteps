<script setup>
    import swal from "sweetalert";
    import { eliminarUsuario } from "../main";
    import { onMounted, ref, watch } from "vue";
    import { RouterLink } from "vue-router";

    import { useRouter } from "vue-router"; // Importa el hook useRouter
    import {
        nombreSuperAdmin,
        photoUrlSuperAdmin,
        obtenerDatosSuperAdmin,
    } from "../loginFunctions";

    import { db, auth } from "../firebase";
    import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

    const router = useRouter(); // Obtén la instancia del enrutador

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

    const tramites = ref([]);
    const searchTerm = ref("");
    const mostrarTodosPasos = ref({}); // Objeto para rastrear qué tramites tienen todos los pasos mostrados
    const pasosMostrados = 3; // Número de pasos mostrados por defecto

    const cargarTramites = async () => {
        const querySnapshot = await getDocs(collection(db, "tramites"));
        tramites.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    const toggleMostrarTodosPasos = (idTramite) => {
        mostrarTodosPasos.value[idTramite] = !mostrarTodosPasos.value[idTramite];
    };

    const loadTramites = async () => {
        const querySnapshot = await getDocs(collection(db, "Tramites_Gratuitos"));
        tramites.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    const filteredTramites = ref([]);

    const filterTramites = () => {
        if (!searchTerm.value) {
            filteredTramites.value = tramites.value;
        } else {
            filteredTramites.value = tramites.value.filter(
                (tramite) =>
                    tramite.Nombre &&
                    tramite.Nombre.toLowerCase().includes(searchTerm.value.toLowerCase())
            );
        }
    };

    const showCopyIcon = ref(false);
    onMounted(() => {
        loadTramites();
    });

    watch(searchTerm, () => {
        filterTramites();
    });

    const nombre = ref("");
    const correo = ref("");

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
                            class="flex flex-col items-center w-full hover: border-slate-400 hover:border-x-2 text-3xl space-y-3">
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
                    <router-link to="/sa/tramites/gratis"
                        class="flex flex-col justify-center mx-4 absolute ml-8 mt-4 text-2xl z-20 hover:scale-125">
                        <fa icon="fa-chevron-left fa-solid" />
                    </router-link>
                    <h1
                        class="static text-center w-full flex-1 animate__animated animate__bounce text-white animate__flipInX text-[55px] mt-2">
                        Tramites Gratuitos
                    </h1>
                </div>
                <div class="grid flex-auto p-2 scroll-container">
                    <div>
                        <input type="text" v-model="searchTerm" placeholder="Buscar trámite..."
                            class="sticky-input text-bgdark" />
                        <table>
                            <thead>
                                <tr>
                                    <th class="sticky-header">Nombre</th>
                                    <th class="sticky-header">Descripción</th>
                                    <th class="sticky-header">Pasos</th>
                                    <th class="sticky-header">Documento Necesario</th>
                                    <th class="sticky-header">Imagen de Presentación</th>
                                    <th class="sticky-header">Copiar UID</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(tramite, index) in filteredTramites" :key="tramite.id"
                                    :class="{ 'even-row': index % 2 === 0, 'odd-row': index % 2 !== 0 }">
                                    <td>{{ tramite.Nombre }}</td>
                                    <td>{{ tramite.Descripcion }}</td>
                                    <td>
                                        <template v-if="tramite.Pasos.length > pasosMostrados">
                                            <template v-if="mostrarTodosPasos[tramite.id]">
                                                <ul>
                                                    <li v-for="(paso, index) in tramite.Pasos" :key="index">
                                                        {{ index + 1 }}. {{ paso }}
                                                    </li>
                                                </ul>
                                                <button @click="toggleMostrarTodosPasos(tramite.id)">
                                                    Mostrar menos
                                                </button>
                                            </template>
                                            <template v-else>
                                                <ul>
                                                    <li v-for="(paso, index) in tramite.Pasos.slice(
                                                        0,
                                                        pasosMostrados
                                                    )" :key="index">
                                                        {{ index + 1 }}. {{ paso }}
                                                    </li>
                                                </ul>
                                                <button @click="toggleMostrarTodosPasos(tramite.id)">
                                                    Mostrar todos
                                                </button>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <ul>
                                                <li v-for="(paso, index) in tramite.Pasos" :key="index">
                                                    {{ index + 1 }}. {{ paso }}
                                                </li>
                                            </ul>
                                        </template>
                                    </td>
                                    <td>{{ tramite.Doc_Necesaria }}</td>
                                    <td>
                                        <img :src="tramite.Img_Presentacion" alt="Imagen de Presentación"
                                            style="max-width: 100px; max-height: 100px" />
                                    </td>
                                    <td @mouseenter="showCopyIcon = true" @mouseleave="showCopyIcon = false">
                                        <span @click="copiarUID(tramite.id)" style="cursor: pointer">
                                            <fa v-if="showCopyIcon" icon="fa-copy fa-solid"
                                                class="text-xl text-center" />
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>
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
        background-color: #44576d;
    }

    .odd-row {
        background-color: #374357;
    }

    .hover-opacity:hover {
        opacity: 0.8;
    }
</style>
