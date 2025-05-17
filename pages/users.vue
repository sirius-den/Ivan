<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Users Management</h1>
      </v-col>
    </v-row>

    <!-- Filters and Actions -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-select
          v-model="roleFilter"
          :items="roleOptions"
          label="Role"
          density="compact"
          variant="outlined"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          label="Status"
          density="compact"
          variant="outlined"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Search Users"
          prepend-icon="mdi-magnify"
          density="compact"
          variant="outlined"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-btn
          color="primary"
          block
          prepend-icon="mdi-account-plus"
          @click="openUserDialog()"
        >
          Add User
        </v-btn>
      </v-col>
    </v-row>

    <!-- Users Table -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item.avatar="{ item }">
          <v-avatar size="32" class="me-2">
            <v-img :src="item.avatar" :alt="item.name"></v-img>
          </v-avatar>
          {{ item.name }}
        </template>

        <template v-slot:item.role="{ item }">
          <v-chip
            :color="getRoleColor(item.role)"
            size="small"
          >
            {{ item.role }}
          </v-chip>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            variant="text"
            size="small"
            color="primary"
            class="me-2"
            @click="viewUser(item)"
          ></v-btn>
          <v-btn
            icon="mdi-pencil"
            variant="text"
            size="small"
            color="primary"
            class="me-2"
            @click="editUser(item)"
          ></v-btn>
          <v-btn
            icon="mdi-delete"
            variant="text"
            size="small"
            color="error"
            @click="confirmDelete(item)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- User Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.name"
                  label="Name"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.email"
                  label="Email"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.role"
                  :items="roleOptions"
                  label="Role"
                  variant="outlined"
                  density="compact"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.status"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                  density="compact"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="text" @click="saveUser">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Delete User</v-card-title>
        <v-card-text>
          Are you sure you want to delete this user?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="text" @click="deleteUser">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'default'
})

// Search and filters
const search = ref('')
const roleFilter = ref('All')
const statusFilter = ref('All')

// Dialog control
const dialog = ref(false)
const deleteDialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: '',
  name: '',
  email: '',
  role: '',
  status: '',
  avatar: ''
})
const defaultItem = {
  id: '',
  name: '',
  email: '',
  role: '',
  status: '',
  avatar: ''
}

// Options
const roleOptions = ['All', 'Admin', 'Manager', 'User', 'Viewer']
const statusOptions = ['All', 'Active', 'Inactive', 'Suspended']

// Table headers
const headers = [
  { title: 'User', key: 'avatar', sortable: false },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Status', key: 'status' },
  { title: 'Last Login', key: 'lastLogin' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Mock data
const users = [
  {
    id: 'USR-001',
    name: 'Eva Retro',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastLogin: '2024-03-15 14:30'
  },
  {
    id: 'USR-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Manager',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastLogin: '2024-03-15 13:45'
  },
  {
    id: 'USR-003',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'User',
    status: 'Inactive',
    avatar: 'https://i.pravatar.cc/150?img=3',
    lastLogin: '2024-03-14 09:15'
  },
  {
    id: 'USR-004',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    role: 'Viewer',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?img=9',
    lastLogin: '2024-03-15 10:20'
  }
]

// Computed
const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'New User' : 'Edit User'
})

// Methods
const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    'Admin': 'error',
    'Manager': 'primary',
    'User': 'success',
    'Viewer': 'info'
  }
  return colors[role] || 'grey'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Active': 'success',
    'Inactive': 'warning',
    'Suspended': 'error'
  }
  return colors[status] || 'grey'
}

const openUserDialog = () => {
  editedItem.value = { ...defaultItem }
  editedIndex.value = -1
  dialog.value = true
}

const editUser = (item: any) => {
  editedIndex.value = users.indexOf(item)
  editedItem.value = { ...item }
  dialog.value = true
}

const viewUser = (item: any) => {
  // Implement view user details
  console.log('View user:', item)
}

const closeDialog = () => {
  dialog.value = false
  editedItem.value = { ...defaultItem }
  editedIndex.value = -1
}

const saveUser = () => {
  if (editedIndex.value > -1) {
    // Update existing user
    Object.assign(users[editedIndex.value], editedItem.value)
  } else {
    // Add new user
    users.push({ ...editedItem.value })
  }
  closeDialog()
}

const confirmDelete = (item: any) => {
  editedIndex.value = users.indexOf(item)
  editedItem.value = { ...item }
  deleteDialog.value = true
}

const deleteUser = () => {
  users.splice(editedIndex.value, 1)
  deleteDialog.value = false
  editedItem.value = { ...defaultItem }
  editedIndex.value = -1
}
</script>

<style scoped>
.v-data-table {
  background: transparent !important;
}
</style> 