<script setup>
    import Swal from "sweetalert2";
    import { deleteDoc, doc, getDoc } from "firebase/firestore";

    import { RouterLink } from "vue-router";

    import { db, auth } from "../firebase";

    import {
        nombreSuperAdmin,
        photoUrlSuperAdmin,
        obtenerDatosSuperAdmin,
    } from "../loginFunctions";
    // Importa el hook useRouter
    // Ajusta la importación según tu configuración
    import { watch } from "vue";
    import { getDocs, query, where } from "firebase/firestore";
    import { useRouter } from "vue-router";
    const router = useRouter();

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

    let bufeteIdToDelete = "";

    const confirmarEliminacion = async () => {
        try {
            const docRef = doc(db, "Tramites_Gratuitos", bufeteIdToDelete);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error("No se encontró el bufete con el UID proporcionado");
            }

            const tramiteData = docSnap.data();
            const confirmacion = await Swal.fire({
                title: `¿Seguro que deseas eliminar el bufete "${tramiteData.Nombre}"?`,
                text: "Esta acción no se puede deshacer",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
            });

            if (confirmacion.isConfirmed) {
                await deleteDoc(docRef);
                Swal.fire("Eliminado", "El bufete ha sido eliminado correctamente", "success");
                bufeteIdToDelete = ""; // Limpiar el input después de la eliminación
            }
        } catch (error) {
            console.error("Error al eliminar el bufete:", error);
            Swal.fire("Error", "Hubo un problema al eliminar el bufete", "error");
        }
    };
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
            <div class="bg-bgdark w-full h-full opacity-55 text-white box-border relative flex flex-col justify-start">
                <div class="">
                    <router-link to="/sa/tramites/gratis"
                        class="flex flex-col justify-center mx-4 absolute ml-8 mt-4 text-2xl z-20 hover:scale-125">
                        <fa icon="fa-chevron-left fa-solid" />
                    </router-link>
                    <h1
                        class="static text-center w-full flex-1 animate__animated animate__bounce text-white animate__flipInX text-[55px] mt-2">
                        Tramites Gratuitos
                    </h1>
                </div>
                <div>
                    <h2>Eliminar Bufete</h2>
                    <input v-model="bufeteIdToDelete" placeholder="Ingrese el UID del bufete a eliminar" />
                    <button @click="confirmarEliminacion"
                        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                        Eliminar
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>
