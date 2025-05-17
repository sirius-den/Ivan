import ApexCharts from 'apexcharts'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      apexcharts: ApexCharts
    }
  }
}) 