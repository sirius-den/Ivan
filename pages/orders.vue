<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Orders Management</h1>
      </v-col>
    </v-row>

    <!-- Filters and Actions -->
    <v-row class="mb-4">
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
      <v-col cols="12" md="3">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="dateRange"
              label="Date Range"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="props"
              density="compact"
              variant="outlined"
              hide-details
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateRange"
            range
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Search Orders"
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
          prepend-icon="mdi-plus"
        >
          New Order
        </v-btn>
      </v-col>
    </v-row>

    <!-- Orders Table -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="orders"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.total="{ item }">
          ${{ item.total.toFixed(2) }}
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
            class="me-2"
          ></v-btn>
          <v-btn
            icon="mdi-delete"
            variant="text"
            size="small"
            color="error"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Order Statistics -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Order Status Distribution</v-card-title>
          <v-card-text>
            <div ref="orderStatusChart"></div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Revenue Overview</v-card-title>
          <v-card-text>
            <div ref="revenueChart"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import { ref, onMounted, onUnmounted } from 'vue'
import { useNuxtApp } from '#app'

definePageMeta({
  layout: 'default'
})

const search = ref('')
const statusFilter = ref('All')
const dateRange = ref([])

const statusOptions = [
  'All',
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
]

const headers = [
  { title: 'Order ID', key: 'id' },
  { title: 'Customer', key: 'customer' },
  { title: 'Date', key: 'date' },
  { title: 'Status', key: 'status' },
  { title: 'Total', key: 'total' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const orders = [
  {
    id: 'ORD-001',
    customer: 'John Smith',
    date: '2024-03-15',
    status: 'Processing',
    total: 299.99
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Johnson',
    date: '2024-03-14',
    status: 'Shipped',
    total: 149.50
  },
  {
    id: 'ORD-003',
    customer: 'Michael Brown',
    date: '2024-03-13',
    status: 'Delivered',
    total: 499.99
  },
  {
    id: 'ORD-004',
    customer: 'Emily Davis',
    date: '2024-03-12',
    status: 'Pending',
    total: 199.99
  }
]

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'

const getStatusColor = (status: OrderStatus) => {
  const colors: Record<OrderStatus, string> = {
    'Pending': 'warning',
    'Processing': 'info',
    'Shipped': 'primary',
    'Delivered': 'success',
    'Cancelled': 'error'
  }
  return colors[status] || 'grey'
}

// Chart refs
const orderStatusChart = ref<HTMLElement | null>(null)
const revenueChart = ref<HTMLElement | null>(null)

// Chart instances
let statusChartInstance: any = null
let revenueChartInstance: any = null

// Order Status Chart Options
const getOrderStatusOptions = () => ({
  chart: {
    type: 'donut',
    toolbar: { show: false }
  },
  series: [44, 55, 13, 43],
  labels: ['Pending', 'Processing', 'Shipped', 'Delivered'],
  colors: ['#FFC107', '#2196F3', '#4CAF50', '#9C27B0'],
  legend: {
    position: 'bottom',
    labels: { colors: '#666' }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Orders',
            formatter: (w: any) => w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)
          }
        }
      }
    }
  },
  tooltip: {
    y: {
      formatter: (value: number) => `${value} orders`
    }
  }
})

// Revenue Chart Options
const getRevenueOptions = () => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  series: [{
    name: 'Revenue',
    data: [31000, 40000, 28000, 51000, 42000, 109000, 100000]
  }],
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    labels: { style: { colors: '#666' } }
  },
  yaxis: {
    labels: { 
      style: { colors: '#666' },
      formatter: (value: number) => `$${(value / 1000).toFixed(1)}K`
    }
  },
  colors: ['#4CAF50'],
  dataLabels: { enabled: false },
  stroke: { 
    curve: 'smooth', 
    width: 2 
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3
    }
  },
  grid: {
    borderColor: '#f1f1f1'
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (value: number) => `$${(value / 1000).toFixed(1)}K`
    }
  }
})

// Initialize charts
onMounted(async () => {
  // Only run on client side
  if (process.client) {
    const { $apexcharts } = useNuxtApp()
    
    if (orderStatusChart.value) {
      const options = getOrderStatusOptions()
      statusChartInstance = new $apexcharts(
        orderStatusChart.value,
        options
      )
      statusChartInstance.render()
    }

    if (revenueChart.value) {
      const options = getRevenueOptions()
      revenueChartInstance = new $apexcharts(
        revenueChart.value,
        options
      )
      revenueChartInstance.render()
    }
  }
})

// Cleanup on component unmount
onUnmounted(() => {
  if (process.client) {
    if (statusChartInstance) {
      statusChartInstance.destroy()
    }
    if (revenueChartInstance) {
      revenueChartInstance.destroy()
    }
  }
})
</script> 