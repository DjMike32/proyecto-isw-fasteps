<script setup>
import { agregarUsuario } from '../main.js'


</script>

<template>
    <nav>
        <div class="bg-slate-300 w-screen p-1 flex justify-between items-center border-4 border-black-500 rounded-lg">
            <div class=" text-blue-950 hover:text-sky-400">
                Fasteps
            </div>
            <div class=" text-blue-950 hover:text-sky-400">Menu</div>
            <div class=" text-blue-950 hover:text-sky-400">Perfil</div>
            <button class=" disabled:opacity-75" @click="agregarUsuario('MG', 'MG@gmail.com')">
                Añadir usuario
            </button>
        </div>
    </nav>

</template>