<script setup>
    import { ref } from "vue";
    import {
        getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
    } from "firebase/auth";
    import { doc, setDoc } from "firebase/firestore";
    import { db } from "../firebase"; // Asegúrate de importar correctamente tu instancia de Firestore
    // import router from "../router/router";
    import { useRouter } from "vue-router";

    const nombre = ref("");
    const telefono = ref("");
    const auth = getAuth();
    const router = useRouter();
    const email = ref("");
    const password = ref("");

    const iniciarSesion = async () => {
        try {
            await signInWithEmailAndPassword(auth, email.value, password.value);
            router.push("/sa/main");
            console.log("Inicio de sesión exitoso");
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    };
    // const registrarAdministrador = async () => {
    //     try {
    //         // Crear usuario con correo y contraseña
    //         const credencial = await createUserWithEmailAndPassword(
    //             auth,
    //             correo.value,
    //             contraseña.value
    //         );

    //         // Obtener UID del administrador creado
    //         const uid = credencial.user.uid;

    //         // Crear un documento en la colección 'administradores' con el UID como ID del documento
    //         const docRef = doc(db, "administradores", uid);

    //         // Almacenar los detalles adicionales del administrador en el documento
    //         await setDoc(docRef, {
    //             nombre: nombre.value,
    //             telefono: telefono.value,
    //             correo: correo.value, // También puedes almacenar el correo electrónico si es necesario
    //         });

    //         console.log("Administrador registrado correctamente");
    //         // Aquí podrías realizar alguna acción adicional, como redirigir al usuario a otra página o mostrar un mensaje de éxito
    //     } catch (error) {
    //         console.error("Error al registrar administrador:", error);
    //         // Aquí podrías mostrar un mensaje de error al usuario o realizar alguna otra acción de manejo de errores
    //     }
    // };
</script>
<template>
    <div class="w-screen h-screen grid grid-cols-6 grid-rows-5 bg-gradient-to-b from-bgdark to-bgblue">
        <div
            class="loginbg bg-pcb opacity-55 h-[200px] w-[200px] row-start-3 col-start-2 shadow-xl text-white rounded-[50%] ml-8">
            <h1 class="italic text-sm font-bold text-center"></h1>
        </div>
        <div
            class="loginbg bg-pcb opacity-55 h-[200px] w-[200px] row-start-1 col-start-4 shadow-xl text-white rounded-[50%] ml-8">
            <h1 class="italic text-sm font-bold text-center"></h1>
        </div>
        <div
            class="loginbg bg-white opacity-60 col-span-2 row-span-3 row-start-2 col-start-3 rounded-xl shadow-lg bg-white/10 shadow-pcc/50 z-20 backdrop-blur-xl text-white">
            <h1 class="italic text-sm font-bold text-center"></h1>
        </div>

        <form @submit.prevent="iniciarSesion"
            class="loginbg col-span-2 row-span-3 row-start-2 col-start-3 rounded-xl shadow-xl z-30 grid grid-cols- grid-rows-4 gap-y-6 text-white p-3 -mt-2 text-2xl">
            <h1 class="italic text-3xl font-bold text-center col-span-2 self-center">Bufete</h1>
            <div class="grid content-start space-y-1 col-span-2">
                <label for="email" class="text-2xl justify-self-start">User</label>
                <input v-model="email" type="email" id="email"
                    class="bg-white/10 h-full w-full text-xl placeholder:italic rounded-xl p-2" placeholder="Email"
                    required />
            </div>
            <div class="grid content-start space-y-1 col-span-2">
                <label for="password" class="text-2xl justify-self-start">Password</label>
                <input v-model="password" type="password" id="password"
                    class="bg-white/10 h-full w-full rounded-xl p-2 text-xl placeholder:italic" placeholder="Password"
                    required />
            </div>

            <button type="submit"
                class="grid content-center col-span-2 w-[40%] bg-pce mt-2 justify-self-center m-4 text-2xl text-black hover:bg-pcd hover:text-black py-2 px-4 rounded-xl transition-colors duration-400">
                Ingresar
            </button>
        </form>
        <!-- <div>
            <input type="email" v-model="email" placeholder="Correo electrónico" />
            <input type="password" v-model="password" placeholder="Contraseña" />
            <button @click="registrarUsuario">Registrar</button>
        </div> -->
    </div>
</template>

<style></style>
