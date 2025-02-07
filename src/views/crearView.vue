<template>
    <div class="row mt-3">
        <div class="col-md-6 offset-md-3">
            <div class="card">
                <div class="card-header bg-dark text-white text-center">Agregar Maestro</div>
                <div class="card body">
                    <form @submit="guardar">
                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                            <input type="text" v-model="teacher.name" placeholder="Nombre" class="form-control"
                                required>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                            <input type="text" v-model="teacher.lastname" placeholder="Apellidos" class="form-control"
                                required>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fa-solid fa-book"></i></span>
                            <input type="text" v-model="subject" placeholder="Materia" class="form-control">
                            <button type="button" class="btn btn-success" @click="addSubject">Agregar</button>
                        </div>

                        <ul class="list-group mb-3">
                            <li v-for="(subject, index) in teacher.materias" :key="index" class="list-group-item">
                                {{ subject }}
                                <button class="btn btn-danger btn-sm float-end" @click="elimSubject(index)">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </li>
                        </ul>

                        <div class="input-group mb-3">
                            <div class="input-group-text">
                                <input type="checkbox" v-model="teacher.documentos" class="form-check-input">
                            </div>
                            <label class="form-control">¿Entregó documentos?</label>
                        </div>

                        <button class="btn btn-success w-100">Guardar Maestro</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { show_alerta, enviarSolicitud } from '../funciones';
import { ref } from 'vue';

export default {
    setup() {
        const url = 'http://localhost/formCI3/index.php/restserver/teacher/'
        const teacher = ref({
            name: '',
            lastname: '',
            materias: [],
            documentos: false
        });

        const subject = ref("");

        const addSubject = () => {
            if (subject.value.trim() !== "") {
                teacher.value.materias.push(subject.value.trim());
                subject.value = "";
            } else {
                show_alerta("Ingrese una materia antes de agregarla", "warning");
            }
        };

        const elimSubject = (index) => {
            teacher.value.materias.splice(index, 1);
        };

        const guardar = (event) => {
            event.preventDefault();

            if (!teacher.value.name.trim() || !teacher.value.lastname.trim()) {
                show_alerta("Todos los campos son obligatorios", "warning");
                return;
            }

            var parametros = {
                name: teacher.value.name,
                lastname: teacher.value.lastname,
                materias: teacher.value.materias,
                documentos: teacher.value.documentos
            };

            console.log("Datos de maestro", JSON.stringify(parametros));

            enviarSolicitud('POST', parametros, url, 'Información guardada', () => {
                // Limpiar el formulario después de la inserción exitosa
                teacher.value = {
                    name: '',
                    lastname: '',
                    materias: [],
                    documentos: false
                };
                subject.value = "";
            });
        };

        return { teacher, subject, addSubject, elimSubject, guardar };
    },

};
</script>
