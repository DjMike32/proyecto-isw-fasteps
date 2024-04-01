<template>
    <div>
        <h2>Lista de Usuarios</h2>
        <input type="text" v-model="searchTerm" placeholder="Buscar por nombre" />
        <ul>
            <li v-for="user in filteredUsers" :key="user.id">{{ user.nombre }}</li>
        </ul>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from "vue";
    import { collection, getDocs, query, where } from "firebase/firestore";
    import { db } from "../firebase"; // Importa tu instancia de Firebase Firestore

    const users = ref([]);
    const searchTerm = ref("");

    // Función para cargar los usuarios desde la base de datos
    const loadUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        users.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    // Filtrar usuarios basado en el término de búsqueda
    const filteredUsers = ref([]);
    const filterUsers = () => {
        filteredUsers.value = users.value.filter((user) =>
            user.nombre.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
    };

    // Cargar usuarios cuando el componente esté montado
    onMounted(() => {
        loadUsers();
    });

    // Escuchar cambios en el término de búsqueda y filtrar usuarios
    watch(searchTerm, () => {
        filterUsers();
    });
</script>
