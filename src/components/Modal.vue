<script setup>
    const emit = defineEmits(["close"]);
    const closeModal = () => {
        emit("close");
    };
</script>

<template>
    <div class="backdrop" @click.self="closeModal" :delay="3000">
        <div class="modal">
            <p>modal content</p>
        </div>
    </div>
</template>

<style>
    .modal {
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
    }
</style>
