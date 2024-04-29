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
                throw new Error("No se encontró el tramite con el UID proporcionado");
            }

            const tramiteData = docSnap.data();
            const confirmacion = await Swal.fire({
                title: `¿Seguro que deseas eliminar el tramite de "${tramiteData.Nombre}"?`,
                text: "Esta acción no se puede deshacer",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
            });

            if (confirmacion.isConfirmed) {
                await deleteDoc(docRef);
                Swal.fire("Eliminado", "El tramite ha sido eliminado correctamente", "success");
                bufeteIdToDelete = ""; // Limpiar el input después de la eliminación
            }
        } catch (error) {
            console.error("Error al eliminar el bufete:", error);
            Swal.fire("Error", "Hubo un problema al eliminar el tramite", "error");
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
            <div
                class="bg-bgdark w-full h-full opacity-55 text-white relative flex flex-col justify-center items-center overflow-y-auto">
                <div class="w-full text-center titulo absolute top-0">
                    <router-link to="/sa/tramites/gratis" class="absolute left-0 mt-4 z-20 hover:scale-125 ml-2">
                        <fa icon="fa-chevron-left fa-solid" class="text-2xl" />
                    </router-link>
                    <h1 class="text-4xl mt-2">Eliminar Tramite Gratuito</h1>
                </div>
                <div class="flex flex-col items-center bg-bgblue p-8 rounded-xl shadow-2xl shadow-bgblue opacity-85">
                    <h2 class="text-2xl mb-4">Eliminar Tramite</h2>
                    <input v-model="bufeteIdToDelete" placeholder="Ingrese el UID del bufete a eliminar"
                        class="w-80 bg-white text-black rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button @click="confirmarEliminacion"
                        class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600">
                        Eliminar
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>
