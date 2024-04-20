import { ref, watchEffect } from "vue";
import { db, auth } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const nombreSuperAdmin = ref("");
export const photoUrlSuperAdmin = ref("");

let unsubscribe = null;

export const obtenerDatosSuperAdmin = () => {
  const obtenerDatos = async (user) => {
    try {
      if (user) {
        const superAdminDocRef = doc(db, "SuperAdmin", user.uid);
        const superAdminDocSnap = await getDoc(superAdminDocRef);

        if (superAdminDocSnap.exists()) {
          const data = superAdminDocSnap.data();
          nombreSuperAdmin.value = data.nombre;
          photoUrlSuperAdmin.value = data.photo_url;
        } else {
          console.error(
            "El documento del SuperAdmin no existe para el usuario actual."
          );
        }
      } else {
        console.error("No se ha encontrado un usuario autenticado.");
      }
    } catch (error) {
      console.error("Error al obtener los datos del SuperAdmin:", error);
    }
  };

  if (!unsubscribe) {
    unsubscribe = auth.onAuthStateChanged((user) => {
      obtenerDatos(user);
    });
  } else {
    obtenerDatos(auth.currentUser);
  }
};

watchEffect(() => {
  obtenerDatosSuperAdmin();
});
