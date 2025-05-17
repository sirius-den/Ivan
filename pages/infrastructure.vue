<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Production & Warehouse Infrastructure</h1>
      </v-col>
    </v-row>

    <!-- System Status Cards -->
    <v-row>
      <v-col cols="12" sm="6" md="3" v-for="system in systems" :key="system.name">
        <v-card elevation="2" :class="{ 'border-error': system.status === 'Critical' }">
          <v-card-text>
            <div class="d-flex align-center mb-2">
              <v-icon
                :color="system.status === 'Operational' ? 'success' : 'error'"
                class="me-2"
              >
                {{ system.status === 'Operational' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
              </v-icon>
              <span class="text-subtitle-1">{{ system.name }}</span>
            </div>
            <div class="text-h6 font-weight-bold">{{ system.status }}</div>
            <div class="text-caption text-medium-emphasis">{{ system.description }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Performance Charts -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Production & Warehouse Metrics</v-card-title>
          <v-card-text>
            <div ref="systemLoadChart"></div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Delivery & Shipment Volume</v-card-title>
          <v-card-text>
            <div ref="networkTrafficChart"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Maintenance Schedule -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>Maintenance Schedule</v-card-title>
          <v-card-text>
            <v-timeline density="compact" align="start">
              <v-timeline-item
                v-for="maintenance in maintenanceSchedule"
                :key="maintenance.id"
                :dot-color="maintenance.status === 'Completed' ? 'success' : 'primary'"
                size="small"
              >
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-subtitle-2 font-weight-bold">{{ maintenance.system }}</div>
                    <div class="text-caption">{{ maintenance.description }}</div>
                    <div class="text-caption text-medium-emphasis">{{ maintenance.scheduled }}</div>
                  </div>
                  <v-chip
                    :color="maintenance.status === 'Completed' ? 'success' : 'primary'"
                    size="small"
                  >
                    {{ maintenance.status }}
                  </v-chip>
                </div>
              </v-timeline-item>
            </v-timeline>
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

const systems = [
  {
    name: 'Warehouse Operations',
    status: 'Operational',
    description: 'Warehouse systems running at full capacity'
  },
  {
    name: 'Fleet Management',
    status: 'Operational',
    description: 'All vehicles operational and tracked'
  },
  {
    name: 'Production Lines',
    status: 'Critical',
    description: 'Line 3 requires maintenance'
  },
  {
    name: 'Storage Systems',
    status: 'Operational',
    description: 'Storage capacity at 75%'
  }
]

const maintenanceSchedule = [
  {
    id: 1,
    system: 'Production Line 3',
    description: 'Emergency maintenance - conveyor belt replacement',
    scheduled: 'Scheduled: Mar 20, 2024',
    status: 'Pending'
  },
  {
    id: 2,
    system: 'Warehouse HVAC',
    description: 'Regular maintenance and filter replacement',
    scheduled: 'Completed: Mar 15, 2024',
    status: 'Completed'
  },
  {
    id: 3,
    system: 'Fleet Vehicles',
    description: 'Quarterly vehicle inspection and maintenance',
    scheduled: 'Scheduled: Mar 18, 2024',
    status: 'Pending'
  }
]

// Chart refs
const systemLoadChart = ref<HTMLElement | null>(null)
const networkTrafficChart = ref<HTMLElement | null>(null)

// Chart instances
let loadChartInstance: any = null
let trafficChartInstance: any = null

// System Load Chart Options
const getSystemLoadOptions = () => ({
  chart: {
    type: 'line',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  series: [{
    name: 'Production Efficiency',
    data: [85, 92, 88, 95, 89, 93, 90]
  }, {
    name: 'Warehouse Capacity',
    data: [65, 71, 75, 82, 79, 85, 75]
  }],
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    labels: { style: { colors: '#666' } }
  },
  yaxis: {
    labels: { 
      style: { colors: '#666' },
      formatter: (value: number) => `${value}%`
    }
  },
  colors: ['#2196F3', '#4CAF50'],
  stroke: { 
    curve: 'smooth', 
    width: 2 
  },
  grid: {
    borderColor: '#f1f1f1'
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (value: number) => `${value}%`
    }
  }
})

// Network Traffic Chart Options
const getNetworkTrafficOptions = () => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  series: [{
    name: 'Inbound Deliveries',
    data: [31, 40, 28, 51, 42, 29, 30]
  }, {
    name: 'Outbound Shipments',
    data: [41, 32, 45, 32, 34, 42, 41]
  }],
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    labels: { style: { colors: '#666' } }
  },
  yaxis: {
    labels: { 
      style: { colors: '#666' },
      formatter: (value: number) => `${value} units`
    }
  },
  colors: ['#2196F3', '#FFC107'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3
    }
  },
  stroke: { 
    curve: 'smooth', 
    width: 2 
  },
  grid: {
    borderColor: '#f1f1f1'
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (value: number) => `${value} units`
    }
  }
})

// Initialize charts
onMounted(async () => {
  // Only run on client side
  if (process.client) {
    const { $apexcharts } = useNuxtApp()
    
    if (systemLoadChart.value) {
      const options = getSystemLoadOptions()
      loadChartInstance = new $apexcharts(
        systemLoadChart.value,
        options
      )
      loadChartInstance.render()
    }

    if (networkTrafficChart.value) {
      const options = getNetworkTrafficOptions()
      trafficChartInstance = new $apexcharts(
        networkTrafficChart.value,
        options
      )
      trafficChartInstance.render()
    }
  }
})

// Cleanup on component unmount
onUnmounted(() => {
  if (process.client) {
    if (loadChartInstance) {
      loadChartInstance.destroy()
    }
    if (trafficChartInstance) {
      trafficChartInstance.destroy()
    }
  }
})
</script>

<style scoped>
.border-error {
  border-left: 4px solid rgb(var(--v-theme-error));
}
</style> 