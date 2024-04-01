<script setup>
    import swal from "sweetalert";
    import { eliminarUsuario } from "../main";
    import { onMounted } from "vue";
    import { RouterLink } from "vue-router";
    import { ref } from "vue";
    import { db } from "../firebase";
    import { addDoc, collection } from "firebase/firestore";

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

    // Llama a la función successAlert dentro de onMounted para garantizar que el DOM se haya cargado completamente
</script>

<template>
    <div class="flex h-screen bg-bgblue">
        <!--
    /**
     ! hola 
    */ 
    -->
        <aside class="w-1/4 bg-bgblue opacity-65 text-white border-r-[0.5px] border-white my-4">
            <div class="px-2">
                <div class="flex mb-4 bg-[#eeeeee1b] rounded-xl p-1 relative overflow-visible">
                    <img class="rounded-full size-[34px] absolute -left-1 -top-1" src="../assets/profile1.jfif"
                        alt="" />
                    <h1 class="text-xs font-bold ml-9 text-white py-2/3">Admin 1</h1>
                </div>

                <!-- Lista de elementos del sidebar -->

                <ul class="space-y-4">
                    <!-- Elemento 1 -->
                    <li class="flex items-center mb-1 text-sm">
                        <button class="w-full hover:border-slate-400 hover:border-x-2 opacity-50">
                            <fa icon="fa-user-tie fa-solid" />
                            <h2>Bufetes</h2>
                        </button>
                    </li>
                    <!-- Elemento 2 -->
                    <li class="mb-1 text-sm">
                        <router-link to="/sa/tramites">
                            <button class="flex flex-col items-center w-full hover: border-slate-400 hover:border-x-2">
                                <fa icon="fa-file-signature fa-solid" />
                                <h2>Tramites</h2>
                            </button>
                        </router-link>
                    </li>

                    <li class="flex items-center mb-1 text-sm">
                        <button class="w-full hover: border-slate-400 hover:border-x-2">
                            <fa icon="fa-id-card fa-solid" />
                            <h2>Perfil</h2>
                        </button>
                    </li>
                    <li class="mb-1 text-sm">
                        <router-link to="/" class="">
                            <button class="flex flex-col items-center w-full hover: border-slate-400 hover:border-x-2">
                                <fa icon="fa-right-from-bracket fa-solid" />
                                <h2>Cerrar Sesión</h2>
                            </button>
                        </router-link>
                    </li>
                    <!-- Elemento 3 -->
                </ul>
            </div>
        </aside>
        <!-- Contenido principal -->
        <main class="flex-1 p-4 box-border">
            <div class="bg-bgdark w-full h-full opacity-55 text-white box-border relative flex flex-col">
                <div>
                    <h1 class="static text-center w-full flex-1 animate__animated animate__bounce text-white">
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
                </div>
            </div>
        </main>
    </div>

    <div>
        <form @submit.prevent="agregarUsuario">
            <input type="text" v-model="nombre" placeholder="Nombre" />
            <input type="email" v-model="correo" placeholder="Correo electrónico" />
            <button type="submit">Agregar Usuario</button>
        </form>
    </div>
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