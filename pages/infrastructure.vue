<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Infrastructure</h1>
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
          <v-card-title>System Load</v-card-title>
          <v-card-text>
            <div ref="systemLoadChart"></div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Network Traffic</v-card-title>
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
    name: 'Server Infrastructure',
    status: 'Operational',
    description: 'All servers running normally'
  },
  {
    name: 'Database Systems',
    status: 'Operational',
    description: 'Database performance optimal'
  },
  {
    name: 'Network Infrastructure',
    status: 'Critical',
    description: 'High latency detected'
  },
  {
    name: 'Security Systems',
    status: 'Operational',
    description: 'All security measures active'
  }
]

const maintenanceSchedule = [
  {
    id: 1,
    system: 'Server Infrastructure',
    description: 'Routine maintenance and updates',
    scheduled: 'Scheduled: Mar 20, 2024',
    status: 'Pending'
  },
  {
    id: 2,
    system: 'Database Systems',
    description: 'Database optimization',
    scheduled: 'Completed: Mar 15, 2024',
    status: 'Completed'
  },
  {
    id: 3,
    system: 'Network Infrastructure',
    description: 'Emergency maintenance',
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
    name: 'CPU Usage',
    data: [45, 52, 38, 45, 19, 23, 40]
  }, {
    name: 'Memory Usage',
    data: [35, 41, 35, 51, 49, 62, 69]
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
    name: 'Inbound',
    data: [31, 40, 28, 51, 42, 109, 100]
  }, {
    name: 'Outbound',
    data: [11, 32, 45, 32, 34, 52, 41]
  }],
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    labels: { style: { colors: '#666' } }
  },
  yaxis: {
    labels: { 
      style: { colors: '#666' },
      formatter: (value: number) => `${value} MB/s`
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
      formatter: (value: number) => `${value} MB/s`
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