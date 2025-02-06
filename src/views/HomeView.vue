<template>
  <div class="row">
    <div class="col-lg-8 offset-lg-2">
      <div class="table-responsive">
        <table class="table table-border table-hover" v-if="maestros && maestros.length">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Materias</th>
              <th>¿Entregó documentación?</th>
              <th>Editar tabla</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(elm, index) in maestros" :key="index">
              <td>{{ elm.id }}</td>
              <td>{{ elm.name }}</td>
              <td>{{ elm.lastname }}</td>
              <td>
                <ul>
                  <li v-for="(materia, idx) in JSON.parse(elm.materias)" :key="idx">
                    {{ materia }}
                  </li>
                </ul>
              </td>
              <td v-if="elm.docs">Entregados</td>
              <td v-else>No entregados</td>
              <td>
                <router-link :to="{ path: '/editar/' + elm.id }" class="btn btn-warning">
                  <i class="fa-solid fa-edit"></i>
                </router-link> &nbsp;
                <button class="btn btn-danger" @click="eliminar(elm.id, elm.name)">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="alert alert-warning text-center">
          No hay maestros en la lista.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { confirmar } from '@/funciones';

export default {
  data() {
    return { maestros: [] }; // Se inicia con un array vacío
  },
  mounted() {
    this.getMaestros();
  },
  methods: {
    async getMaestros() {
      try {
        const response = await axios.get('http://localhost/formCI3/index.php/restserver/test');
        this.maestros = response.data;
      } catch (error) {
        console.error('Error al obtener la lista:', error);
      }
    },
    eliminar(id, name) {
      confirmar(id, name, () => {
        this.getMaestros(); // Recarga la lista después de eliminar
      });
    }
  }
};
</script>
