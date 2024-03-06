<script setup>
import  { frutas } from '../main.js'


</script>

<template>
  <div>
    <h1>Frutas:</h1>
    <ul>
      <li v-for="fruta in frutas" :key="fruta.nombre">
        {{ fruta.nombre }}
        <span v-if="['Manzana', 'Uva'].includes(fruta.nombre)"   >hola</span>
      </li>
      
    </ul>
  </div>
</template>

