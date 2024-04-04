<script setup>
import Modal from "../components/Modal.vue";
import { ref } from "vue";

const showModal = ref(false);

function toggleModal() {
  showModal.value = !showModal.value;
  console.log("hola");
}
</script>

<template>
  <div v-if="showModal">
    <Modal @close="toggleModal" :delay="5000"> </Modal>
  </div>
  <button @click="toggleModal">Aqui va el login</button>
</template>
