<script setup>
import { agregarUsuario, eliminarUsuario } from '../main';


</script>

<template>

    <div class="flex h-screen bg-bgblue">
        <!-- Sidebar -->
        <aside class="w-1/4 bg-bgblue opacity-65 text-white border-r-[0.5px] border-white  my-4">
            <div class="px-2">
                <h1 class="text-lg font-bold mb-4 text-white">Bienvenido</h1>
                <!-- Lista de elementos del sidebar -->
                <ul class="space-y-6">
                    <!-- Elemento 1 -->
                    <li class="flex items-center mb-2 text-sm ">
                        <button class="w-full text-left">
                            Usuarios
                        </button>
                    </li>
                    <!-- Elemento 2 -->
                    <li class="flex items-center mb-2 text-sm ">
                        <button class="w-full text-left">
                            Tramites
                        </button>
                    </li>

                    <li class="flex items-center mb-2 text-sm">
                        <button class="w-full hover: border-slate-700 hover:border-x-2 text-left ">
                            Bufetes
                        </button>
                    </li>
                    <li class="flex items-center mb-2 text-sm">
                        <button class="w-full text-left">
                            Perfil
                        </button>
                    </li>
                    <!-- Elemento 3 -->
                    <!-- Puedes agregar más elementos aquí -->
                </ul>
            </div>
        </aside>
        <!-- Contenido principal -->
        <main class="flex-1 p-4 box-border">
            <div class="bg-bgdark w-full h-full opacity-55 text-white box-border relative flex flex-col ">
                <div>
                    <h1 class="static text-center w-full flex-1 animate__animated animate__bounce text-white">
                        Bufetes
                    </h1>
                </div>
                <div class="grid flex-auto p-2 grid-cols-2 gap-20">
                    <button @click="eliminarUsuario('AiyNCEQoYYHqvb6THQQ1')">
                        Eliminar
                        <fa icon="fa-trash fa-solid" />
                    </button>
                    <button @click="agregarUsuario('MG2', 'MG2@gmail.com')">Agregar
                        <fa icon="fa-heart fa-solid" />
                    </button>
                    <button>ingresar</button>
                    <button>ingresar</button>
                </div>
            </div>

        </main>
    </div>
    <!-- <div class="container bg-white opacity-70 h-3/4 py-10 w-2/3">
        <button class="w-1/3 h-8 text-sm bg-red-200" @click="agregarUsuario('pedro', 'josue')">agregar</button>
    </div> -->
</template>