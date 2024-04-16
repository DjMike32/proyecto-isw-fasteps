<script setup>
    // const emit = defineEmits(["close"]);
    // const closeModal = () => {
    //     emit("close");
    // };
    import { ref } from "vue";

    // Propiedad reactiva para controlar la visibilidad de la modal
    const visible = ref(false);

    // Función para cerrar la modal
    const closeModal = () => {
        visible.value = false;
    };

    // Función para confirmar una acción y cerrar la modal
    const confirmAction = () => {
        // Puedes agregar aquí la lógica para confirmar la acción antes de cerrar la modal
        closeModal();
    };
</script>

<template>
    <div v-if="visible" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
        <!-- Contenido de la modal -->
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div class="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full z-50" role="dialog" aria-modal="true"
            aria-labelledby="modal-headline">
            <div class="p-6">
                <slot></slot>
                <div class="mt-4 flex justify-end">
                    <button @click="closeModal"
                        class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none">
                        Cancelar
                    </button>
                    <button @click="confirmAction"
                        class="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    /* .modal {
        width: 300px;
        padding: 20px;
        margin: 100px auto;
        background: white;
        border-radius: 10px;
    }

    .backdrop {
        top: 0;
        position: fixed;
        background: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
    } */
</style>
