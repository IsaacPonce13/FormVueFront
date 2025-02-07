<template>
    <div class="row mt-3">
        <div class="col-md-6 offset-md-3">
            <div class="card">
                <div class="card-header bg-dark text-white text-center">Editar Maestro</div>
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
import { show_alerta } from '../funciones';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
    setup() {
        const route = useRoute();
        const id = ref(route.params.id);  // Obtener ID desde la ruta
        const url = `http://localhost/formCI3/index.php/restserver/teacher/`;

        const teacher = ref({
            id: id.value,  // Asignar el ID al objeto teacher
            name: '',
            lastname: '',
            materias: [],
            documentos: false
        });

        const subject = ref("");

        const getTeacher = () => {
            axios.get(url + id.value)
                .then(response => {
                    console.log("Datos recibidos:", response.data);

                    teacher.value.name = response.data.name;
                    teacher.value.lastname = response.data.lastname;
                    teacher.value.materias = response.data.materias ? JSON.parse(response.data.materias) : [];
                    teacher.value.documentos = Boolean(response.data.documentos);
                })
                .catch(error => {
                    console.error("Error obteniendo los datos del maestro:", error);
                });
        };

        onMounted(getTeacher); // Llamar la función cuando el componente se monta

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

        const guardar = async (event) => {
            event.preventDefault();

            if (!teacher.value.name.trim() || !teacher.value.lastname.trim()) {
                show_alerta("Todos los campos son obligatorios", "warning");
                return;
            }

            let parametros = {
                name: teacher.value.name,
                lastname: teacher.value.lastname,
                materias: JSON.stringify(teacher.value.materias), // Convertir materias a JSON
                documentos: teacher.value.documentos
            };

            console.log("Datos a actualizar:", JSON.stringify(parametros));

            try {
                const response = await axios.put(url + id.value, parametros);
                show_alerta("Información actualizada correctamente", "success");
                console.log("Respuesta del servidor:", response.data);
            } catch (error) {
                console.error("Error al actualizar maestro:", error);
                show_alerta("Error al actualizar maestro", "error");
            }
        };

        return { teacher, subject, addSubject, elimSubject, guardar };
    }
};
</script>
