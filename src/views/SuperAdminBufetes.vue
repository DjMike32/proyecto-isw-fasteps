<script setup>
    import DashboardTramites from "../components/DashboardTramites.vue";
    import Prueba from "../components/Prueba.vue";
</script>

<template>
    <DashboardTramites> </DashboardTramites>
    <br />
    <Prueba v-if="(numPrueba = 0)"></Prueba>
</template>
