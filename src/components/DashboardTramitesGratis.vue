<script setup>
    import Swal from "sweetalert2";
    import { eliminarUsuario } from "../main";
    import { onMounted } from "vue";
    import { RouterLink } from "vue-router";
    import { ref } from "vue";
    import { db } from "../firebase";
    import { addDoc, collection } from "firebase/firestore";
    import { getAuth } from "firebase/auth";
    import { useRouter } from "vue-router"; // Importa el hook useRouter
    import {
        nombreSuperAdmin,
        photoUrlSuperAdmin,
        obtenerDatosSuperAdmin,
    } from "../loginFunctions";

    const router = useRouter(); // Obtén la instancia del enrutador

    const auth = getAuth();

    const nombre = ref("");
    const correo = ref("");
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

    const showModal = () => {
        Swal.fire({
            icon: "info",
            title: "Botón Deshabilitado Temporalmente",
            text: "Este botón ha sido deshabilitado temporalmente.",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#3085d6",
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
            <div class="bg-bgdark w-full h-full opacity-55 text-white box-border relative flex flex-col justify-center">
                <div class="">
                    <router-link to="/sa/tramites"
                        class="flex flex-col justify-center mx-4 absolute ml-8 mt-4 text-2xl z-20 hover:scale-125">
                        <fa icon="fa-chevron-left fa-solid" />
                    </router-link>
                    <h1
                        class="static text-center w-full flex-1 animate__animated animate__bounce text-white animate__flipInX text-[55px] mt-2">
                        Tramites Gratuitos
                    </h1>
                </div>
                <div class="grid flex-auto p-2 grid-cols-2 gap-20 mx-12 my-6" id="button-container">
                    <router-link id="btn-agregar"
                        class="bg-pcb rounded-xl shadow-2xl router-link shadow-bgblue text-3xl flex flex-col items-center justify-center hover:scale-110 hover:opacity-100"
                        to="/sa/tramites/gratis/agregar">
                        <fa icon="fa-plus fa-solid" class="text-white" />
                        <h2 class="text-white">Agregar</h2>
                    </router-link>

                    <router-link id="btn-eliminar"
                        class="bg-pcb rounded-xl shadow-2xl router-link shadow-bgblue text-3xl flex flex-col items-center justify-center hover:scale-110 hover:opacity-100"
                        to="/sa/tramites/gratis/eliminar">
                        <fa icon="fa-trash fa-solid" />
                        <h2>Eliminar</h2>
                    </router-link>

                    <router-link id="btn-buscar"
                        class="bg-pcb rounded-xl shadow-2xl router-link shadow-bgblue text-3xl flex flex-col items-center justify-center hover:scale-110 hover:opacity-100"
                        to="/sa/tramites/gratis/buscar">
                        <fa icon="fa-magnifying-glass fa-solid" />
                        <h2>Buscar</h2>
                    </router-link>

                    <button id="btn-actualizar"
                        class="bg-pcb rounded-xl shadow-2xl router-link shadow-bgblue text-3xl flex flex-col items-center justify-center hover:scale-110 hover:opacity-100"
                        @click="showModal">
                        <fa icon="fa-pen fa-solid" />
                        <h2>Actualizar</h2>
                    </button>
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
    .router-link:not(:hover) {
        opacity: 0.7;
    }
</style>
