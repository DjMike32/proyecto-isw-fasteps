<script setup>
    import swal from "sweetalert";
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
            <!-- component -->
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
    .dashboard-section {
        overflow-x: auto;
        /* Permitir scroll horizontal */
        white-space: nowrap;
        /* Evitar que las tarjetas se envuelvan a la siguiente línea */
    }

    .card-container {
        display: inline-block;
        /* Mantener las tarjetas en línea */
    }

    .card {
        width: 300px;
        /* Ancho de cada tarjeta */
        margin-right: 20px;
        /* Espacio entre tarjetas */
        display: inline-block;
        /* Mostrar en línea */
        vertical-align: top;
        /* Alinear arriba */
        border: 1px solid #ccc;
        /* Borde para tarjetas */
        border-radius: 8px;
        /* Borde redondeado */
        padding: 20px;
        /* Espaciado interno */
    }
</style>
