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
    console.log(metodo, parametros, url, mensaje);
    
    axios({ method: metodo, url: url, data: parametros })
        .then(function (respuesta) {
            console.log("Respuesta de la API:", respuesta.data.status); // Para depuración
            if (respuesta.data.status === 'succes') {
                console.log("bien")
                show_alerta(mensaje, 'success');
                
                // En lugar de recargar la página, actualiza la lista
                // if (actualizarLista) {
                //     actualizarLista(); // Llama a la función que refresca la tabla
                // }
            } else {
                console.log("mal")
                var errores = respuesta.data.errores || {};
                var listado = Object.values(errores).map(e => e[0]).join('. ');
                show_alerta(listado || 'Error desconocido', 'error');
            }
        })
        .catch(function (error) {
            console.error("Error en la solicitud:", error); // Para depuración
            show_alerta('Error en la solicitud', 'error');
        });
}

