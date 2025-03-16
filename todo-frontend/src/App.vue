<template>
  <div id="app" class="container mt-5">
    <h1 class="text-center mb-4">Todo List</h1>

    <!-- Form สำหรับเพิ่ม Todo -->
    <form @submit.prevent="addTodo" class="mb-4 shadow p-4 bg-light rounded">
      <div class="mb-3">
        <input v-model="newTodo.name" type="text" class="form-control" placeholder="Enter task name" required />
      </div>
      <div class="mb-3">
        <select v-model="newTodo.status" class="form-select" required>
          <option value="to-do">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="finished">Finished</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary rounded-pill">Add Todo</button>
    </form>

    <!-- แสดงรายการ Todo -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <ul class="list-group list-group-flush">
          <li v-for="todo in todos" :key="todo.id" class="list-group-item d-flex justify-content-between align-items-center">
            <span>{{ todo.name }} - 
              <span :class="{
                'badge bg-warning': todo.status === 'to-do',
                'badge bg-info': todo.status === 'in-progress',
                'badge bg-success': todo.status === 'finished'
              }">{{ todo.status }}</span>
            </span>
            <div>
              <button @click="deleteTodo(todo.id)" class="btn btn-danger btn-sm ms-2 rounded-pill">Delete</button>
              <button @click="editTodo(todo)" class="btn btn-warning btn-sm ms-2 rounded-pill">Edit</button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Form สำหรับแก้ไข Todo -->
    <div v-if="todoToEdit" class="mt-4 shadow p-4 bg-light rounded">
      <h2>Edit Todo</h2>
      <form @submit.prevent="updateTodo">
        <div class="mb-3">
          <input v-model="todoToEdit.name" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <select v-model="todoToEdit.status" class="form-select" required>
            <option value="to-do">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="finished">Finished</option>
          </select>
        </div>
        <button type="submit" class="btn btn-success rounded-pill">Update</button>
        <button type="button" @click="todoToEdit = null" class="btn btn-secondary ms-2 rounded-pill">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      todos: [],
      newTodo: {
        name: '',
        status: 'to-do',
      },
      todoToEdit: null,
    };
  },
  methods: {
    async fetchTodos() {
      try {
        const response = await axios.get('http://localhost:3001/api/todos');
        this.todos = response.data;
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    },
    async addTodo() {
      if (!this.newTodo.name.trim()) {
        alert('Please enter a todo name');
        return;
      }
      try {
        await axios.post('http://localhost:3001/api/todos', this.newTodo);
        this.newTodo.name = '';
        this.newTodo.status = 'to-do';
        await this.fetchTodos();
      } catch (error) {
        console.error('Error adding todo:', error.response || error.message);
      }
    },
    async deleteTodo(id) {
      try {
        await axios.delete(`http://localhost:3001/api/todos/${id}`);
        await this.fetchTodos();
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    },
    editTodo(todo) {
      this.todoToEdit = { ...todo };
    },
    async updateTodo() {
      try {
        await axios.put(`http://localhost:3001/api/todos/${this.todoToEdit.id}`, this.todoToEdit);
        this.todoToEdit = null;
        await this.fetchTodos();
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    },
  },
  mounted() {
    this.fetchTodos();
  },
};
</script>

<style scoped>
#app {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
}

form {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button {
  margin-left: 10px;
  border-radius: 20px;
}

ul {
  padding-left: 0;
}

/* Bootstrap utility classes to make it responsive */
@media (max-width: 768px) {
  #app {
    padding: 10px;
  }
  h1 {
    font-size: 1.5rem;
  }
  .list-group-item {
    font-size: 0.9rem;
  }
}

.card {
  border-radius: 10px;
}

.card-body {
  padding: 0;
}
</style>
