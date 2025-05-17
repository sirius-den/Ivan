<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Dashboard</h1>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" elevation="2">
          <v-card-text>
            <div class="text-subtitle-1 text-medium-emphasis">Total Orders</div>
            <div class="text-h4 font-weight-bold">1,234</div>
            <div class="d-flex align-center mt-2">
              <v-icon color="success" class="me-1">mdi-trending-up</v-icon>
              <span class="text-success text-caption">+12% from last month</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" elevation="2">
          <v-card-text>
            <div class="text-subtitle-1 text-medium-emphasis">Active Warehouses</div>
            <div class="text-h4 font-weight-bold">8</div>
            <div class="d-flex align-center mt-2">
              <v-icon color="success" class="me-1">mdi-check-circle</v-icon>
              <span class="text-success text-caption">All operational</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" elevation="2">
          <v-card-text>
            <div class="text-subtitle-1 text-medium-emphasis">Pending Logistics</div>
            <div class="text-h4 font-weight-bold">45</div>
            <div class="d-flex align-center mt-2">
              <v-icon color="warning" class="me-1">mdi-clock-outline</v-icon>
              <span class="text-warning text-caption">5 require attention</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" elevation="2">
          <v-card-text>
            <div class="text-subtitle-1 text-medium-emphasis">Monthly Revenue</div>
            <div class="text-h4 font-weight-bold">$89.5K</div>
            <div class="d-flex align-center mt-2">
              <v-icon color="success" class="me-1">mdi-trending-up</v-icon>
              <span class="text-success text-caption">+8.2% from last month</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Charts -->
    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            Order Trends
            <v-spacer></v-spacer>
            <v-btn-group>
              <v-btn 
                size="small" 
                variant="text"
                :color="selectedPeriod === 'daily' ? 'primary' : undefined"
                @click="updateChartPeriod('daily')"
              >Daily</v-btn>
              <v-btn 
                size="small" 
                variant="text"
                :color="selectedPeriod === 'weekly' ? 'primary' : undefined"
                @click="updateChartPeriod('weekly')"
              >Weekly</v-btn>
              <v-btn 
                size="small" 
                variant="text"
                :color="selectedPeriod === 'monthly' ? 'primary' : undefined"
                @click="updateChartPeriod('monthly')"
              >Monthly</v-btn>
            </v-btn-group>
          </v-card-title>
          <v-card-text>
            <div ref="orderTrendsChart"></div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title>Order Distribution</v-card-title>
          <v-card-text>
            <div ref="orderDistributionChart"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import { ref, onMounted, watch } from 'vue'
import { useNuxtApp } from '#app'

definePageMeta({
  layout: 'default'
})

const orderTrendsChart = ref<HTMLElement | null>(null)
const orderDistributionChart = ref<HTMLElement | null>(null)
const selectedPeriod = ref('weekly')

// Chart instances
let trendsChartInstance: any = null
let distributionChartInstance: any = null

// Order Trends Chart Options
const getOrderTrendsOptions = (data: number[], period: string) => {
  let categories: string[]
  
  switch (period) {
    case 'daily':
      categories = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
      break
    case 'weekly':
      categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      break
    case 'monthly':
      categories = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
      break
    default:
      categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }

  return {
    chart: {
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    series: [{
      name: 'Orders',
      data: data
    }],
    xaxis: {
      categories: categories,
      labels: { style: { colors: '#666' } }
    },
    yaxis: {
      labels: { style: { colors: '#666' } }
    },
    colors: ['#2196F3'],
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
        formatter: (value: number) => `${value} orders`
      }
    }
  }
}

// Order Distribution Chart Options
const getOrderDistributionOptions = () => ({
  chart: {
    type: 'donut',
    toolbar: { show: false }
  },
  series: [44, 55, 13, 43],
  labels: ['Express', 'Standard', 'Economy', 'Bulk'],
  colors: ['#2196F3', '#4CAF50', '#FFC107', '#F44336'],
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

// Initialize charts
onMounted(async () => {
  // Only run on client side
  if (process.client) {
    const { $apexcharts } = useNuxtApp()
    
    if (orderTrendsChart.value) {
      const options = getOrderTrendsOptions([31, 40, 28, 51, 42, 109, 100], 'weekly')
      trendsChartInstance = new $apexcharts(
        orderTrendsChart.value,
        options
      )
      trendsChartInstance.render()
    }

    if (orderDistributionChart.value) {
      const options = getOrderDistributionOptions()
      distributionChartInstance = new $apexcharts(
        orderDistributionChart.value,
        options
      )
      distributionChartInstance.render()
    }
  }
})

// Update chart period
const updateChartPeriod = (period: string) => {
  selectedPeriod.value = period
  let newData: number[]
  
  switch (period) {
    case 'daily':
      newData = [12, 15, 8, 22, 18, 25, 20]
      break
    case 'weekly':
      newData = [31, 40, 28, 51, 42, 109, 100]
      break
    case 'monthly':
      newData = [150, 180, 220, 190, 210]
      break
    default:
      newData = [31, 40, 28, 51, 42, 109, 100]
  }

  if (process.client && trendsChartInstance) {
    trendsChartInstance.updateOptions(getOrderTrendsOptions(newData, period))
  }
}

// Cleanup on component unmount
onUnmounted(() => {
  if (trendsChartInstance) {
    trendsChartInstance.destroy()
  }
  if (distributionChartInstance) {
    distributionChartInstance.destroy()
  }
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style> 