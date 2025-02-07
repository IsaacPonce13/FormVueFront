import Swal from "sweetalert2";
import axios from "axios";
//import { hasUncaughtExceptionCaptureCallback } from "process";

export function show_alerta(mensaje, icono, foco='') {
    if (foco !=='') {
        document.getElementById(foco).focus();
    }
    Swal.fire({
        title:mensaje,
        icon:icono,
        customClass: {confirmButton: 'btn btn-primary', popup:'animated zoomIn' },
        buttonsStyling:false
    });
}

export function confirmar(id, name, callback) {
    var url = 'http://localhost/formCI3/index.php/restserver/teacher/' + id;
    Swal.fire({
        title: '¿Seguro de eliminar al profesor ' + name + ' del registro?',
        text: 'Se perderá la información del profesor',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(url)
                .then(() => {
                    Swal.fire('Eliminado', 'Maestro eliminado correctamente', 'success');
                    if (callback) callback(); // Se ejecuta la función que recarga la lista
                })
                .catch(() => {
                    Swal.fire('Error', 'No se pudo eliminar', 'error');
                });
        }
    });
}


export function enviarSolicitud(metodo, parametros, url, mensaje, actualizarLista) {
    console.log("Datos en función enviarSolicitud", metodo, parametros, url, mensaje);
    
    
    axios({ method: metodo, url: url, data: parametros })
        .then(function (respuesta) {
            console.log("Respuesta de la API:", respuesta.data); // Para depuración

            var status = respuesta.data.status || respuesta.data.message; // Tomar el mensaje devuelto
            if (status && status.includes("correctamente")) { // Verifica si indica éxito
                console.log("Éxito");
                show_alerta(mensaje, "success");

                // Si hay una función para actualizar la lista, se ejecuta
                if (actualizarLista) {
                    actualizarLista();
                }
            } else {
                console.log("Error en la respuesta");
                var listado = '';
                var errores = respuesta.data.errors || {}; // Acceder correctamente a los errores

                Object.keys(errores).forEach(
                    key => listado += errores[key][0] + '.'
                );

                show_alerta(listado, "error");
            }
        })
        .catch(function (error) {
            console.error("Error en la solicitud:", error.response ? error.response.data : error.message);
            show_alerta("Error en la solicitud", "error");
        });
}


