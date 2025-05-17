<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Logistics Network</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-text>
            <ClientOnly>
              <div class="d-flex justify-end mb-4">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      color="primary"
                      v-bind="props"
                      prepend-icon="mdi-plus"
                    >
                      Add Node
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      @click="addNode('warehouse')"
                      :prepend-icon="'mdi-warehouse'"
                      title="Add Warehouse"
                    />
                    <v-list-item
                      @click="addNode('distribution')"
                      :prepend-icon="'mdi-hub'"
                      title="Add Distribution Center"
                    />
                    <v-list-item
                      @click="addNode('retail')"
                      :prepend-icon="'mdi-store'"
                      title="Add Retail Store"
                    />
                  </v-list>
                </v-menu>
              </div>
              <LogisticsNetwork ref="networkRef" />
              <template #fallback>
                <div class="d-flex justify-center align-center" style="height: 600px">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    size="64"
                  ></v-progress-circular>
                </div>
              </template>
            </ClientOnly>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Network Statistics</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <div class="color-dot" style="background-color: #1f77b4"></div>
                </template>
                <v-list-item-title>Active Warehouses</v-list-item-title>
                <template v-slot:append>
                  <span class="text-h6">{{ nodeCounts.warehouses }}</span>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <div class="color-dot" style="background-color: #2ca02c"></div>
                </template>
                <v-list-item-title>Distribution Centers</v-list-item-title>
                <template v-slot:append>
                  <span class="text-h6">{{ nodeCounts.distribution }}</span>
                </template>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <div class="color-dot" style="background-color: #ff7f0e"></div>
                </template>
                <v-list-item-title>Retail Stores</v-list-item-title>
                <template v-slot:append>
                  <span class="text-h6">{{ nodeCounts.retail }}</span>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Network Legend</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <div class="color-dot" style="background-color: #1f77b4"></div>
                </template>
                <v-list-item-title>Warehouses (Blue)</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <div class="color-dot" style="background-color: #2ca02c"></div>
                </template>
                <v-list-item-title>Distribution Centers (Green)</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <div class="color-dot" style="background-color: #ff7f0e"></div>
                </template>
                <v-list-item-title>Retail Stores (Orange)</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <div class="color-dot" style="background-color: #1a1a1a; width: 20px; height: 4px"></div>
                </template>
                <v-list-item-title>Primary Routes (Dark)</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <div class="color-dot" style="background-color: #666666; width: 20px; height: 2px"></div>
                </template>
                <v-list-item-title>Secondary Routes (Light)</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import LogisticsNetwork from '~/components/LogisticsNetwork.vue'
import { ref, computed } from 'vue'

const networkRef = ref<InstanceType<typeof LogisticsNetwork> | null>(null)

// Get reactive node counts from the network component
const nodeCounts = computed(() => {
  return networkRef.value?.nodeCounts || { warehouses: 0, distribution: 0, retail: 0 }
})

const addNode = (type: 'warehouse' | 'distribution' | 'retail') => {
  if (networkRef.value) {
    networkRef.value.addNode(type)
  }
}

definePageMeta({
  layout: 'default',
  ssr: false
})
</script>

<style scoped>
.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
}
</style> 