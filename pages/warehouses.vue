<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Warehouses</h1>
      </v-col>
    </v-row>

    <v-card elevation="2">
      <v-card-title class="d-flex align-center">
        Warehouse List
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          density="compact"
          class="max-w-xs"
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="warehouses"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.status === 'Active' ? 'success' : 'warning'"
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
          ></v-btn>
          <v-btn
            icon="mdi-pencil"
            variant="text"
            size="small"
            color="primary"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const search = ref('')

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Location', key: 'location' },
  { title: 'Capacity', key: 'capacity' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const warehouses = [
  {
    name: 'North Warehouse',
    location: 'New York',
    capacity: '10,000 sq ft',
    status: 'Active'
  },
  {
    name: 'South Warehouse',
    location: 'Miami',
    capacity: '8,000 sq ft',
    status: 'Active'
  },
  {
    name: 'East Warehouse',
    location: 'Boston',
    capacity: '12,000 sq ft',
    status: 'Maintenance'
  },
  {
    name: 'West Warehouse',
    location: 'Los Angeles',
    capacity: '15,000 sq ft',
    status: 'Active'
  }
]
</script> 