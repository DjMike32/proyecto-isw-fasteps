import { ref, watchEffect } from "vue";
import { db, auth } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const nombreSuperAdmin = ref("");
export const photoUrlSuperAdmin = ref("");
export const ApellidoSuperAdmin = ref("");
export const fechaCreacionSuperAdmin = ref("");
export const perfilActualizado = ref("");
export const correoSuperAdmin = ref("");
let unsubscribe = null;

let fechaCreacionEstablecida = false; // Definir la variable antes de usarla

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
          ApellidoSuperAdmin.value = data.apellido;
          correoSuperAdmin.value = data.correo;

          // Convertir timestamp a fecha legible
          const timestampActualizacion = data.fechaModificacion;
          const meses = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
          ];

          // Formatear fecha de actualización
          const fechaActualizacion = formatearFecha(
            timestampActualizacion,
            meses
          );

          // Solo establecer la fecha de creación si aún no ha sido establecida
          if (!fechaCreacionEstablecida) {
            const timestampCreacion = data.fechaCreacion;
            const fechaCreacion = formatearFecha(timestampCreacion, meses);
            fechaCreacionSuperAdmin.value = fechaCreacion;
            fechaCreacionEstablecida = true; // Marcar como establecida
          }

          perfilActualizado.value = fechaActualizacion;
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
export let fechaCreacionUsuario = null; // Variable para almacenar la fecha de creación del usuario

const obtenerFechaCreacionUsuario = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const fecha = new Date(user.metadata.creationTime);

      // Obtener partes de la fecha
      const dia = fecha.getDate();
      const mes = fecha.toLocaleString("default", { month: "long" });
      const año = fecha.getFullYear();
      const hora = fecha.getHours();
      const minutos = fecha.getMinutes();
      const segundos = fecha.getSeconds();
      const ampm = hora >= 12 ? "pm" : "am";

      // Ajustar el formato de la hora
      let horaFormateada = hora % 12 || 12; // Convertir a formato de 12 horas
      horaFormateada =
        horaFormateada < 10 ? "0" + horaFormateada : horaFormateada; // Agregar cero inicial si es necesario
      const horaCompleta = `${horaFormateada}:${minutos}:${segundos} ${ampm}`;

      // Construir la cadena de fecha formateada
      fechaCreacionUsuario = `${dia} de ${mes} de ${año} - ${horaCompleta}`;
      console.log("Fecha de creación del usuario:", fechaCreacionUsuario);
    } else {
      fechaCreacionUsuario = null; // Reiniciar la variable si no hay usuario autenticado
      console.log("No hay usuario autenticado.");
    }
  });
};
// Llamar a la función para obtener la fecha de creación del usuario
console.log(obtenerFechaCreacionUsuario());

const formatearFecha = (timestamp, meses) => {
  const fecha = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()];
  const año = fecha.getFullYear();
  let hora = fecha.getHours();
  const minutos = fecha.getMinutes();
  const segundos = fecha.getSeconds();
  const ampm = hora >= 12 ? "pm" : "am";
  hora = hora % 12;
  hora = hora ? hora : 12; // Hora '0' debería ser '12'
  const horaFormateada = hora + ":" + minutos + ":" + segundos + " " + ampm;
  const fechaFormateada = `${dia} de ${mes} de ${año} - ${horaFormateada}`;
  return fechaFormateada;
};

watchEffect(() => {
  obtenerDatosSuperAdmin();
});
