/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */

<template>
  <div id="container" class="network-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import Graph from "graphology"
import Sigma from "sigma"

let renderer: Sigma | null = null
const graph = ref<Graph | null>(null)

// Add statistics
const nodeCounts = computed(() => {
  if (!graph.value) return { warehouses: 0, distribution: 0, retail: 0 }
  
  const nodes = graph.value.nodes()
  return {
    warehouses: nodes.filter(node => node.startsWith('WH')).length,
    distribution: nodes.filter(node => node.startsWith('DC')).length,
    retail: nodes.filter(node => node.startsWith('R')).length
  }
})

// Function to generate a unique ID for new nodes
const generateNodeId = (type: string) => {
  const existingNodes = graph.value?.nodes() || []
  const typeNodes = existingNodes.filter(node => node.startsWith(type.toUpperCase().slice(0, 2)))
  const maxNum = Math.max(...typeNodes.map(node => parseInt(node.slice(2)) || 0), 0)
  return `${type.toUpperCase().slice(0, 2)}${maxNum + 1}`
}

// Function to get random position within a reasonable range
const getRandomPosition = () => {
  return {
    x: (Math.random() - 0.5) * 10,
    y: (Math.random() - 0.5) * 10
  }
}

// Function to add a new node
const addNode = (type: 'warehouse' | 'distribution' | 'retail') => {
  if (!graph.value || !renderer) return

  const nodeId = generateNodeId(type)
  const pos = getRandomPosition()
  
  const nodeConfig = {
    warehouse: {
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      size: 20,
      color: "#1f77b4"
    },
    distribution: {
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Center`,
      size: 15,
      color: "#2ca02c"
    },
    retail: {
      label: `New Retail Store ${nodeId.slice(2)}`,
      size: 10,
      color: "#ff7f0e"
    }
  }[type]

  graph.value.addNode(nodeId, {
    ...nodeConfig,
    x: pos.x,
    y: pos.y
  })

  // If it's a warehouse or DC, connect it to nearby nodes
  if (type === 'warehouse' || type === 'distribution') {
    const nearbyNodes = graph.value.nodes().filter(node => {
      if (node === nodeId) return false
      const nodeData = graph.value?.getNodeAttributes(node)
      if (!nodeData) return false
      const distance = Math.sqrt(
        Math.pow(nodeData.x - pos.x, 2) + 
        Math.pow(nodeData.y - pos.y, 2)
      )
      return distance < 5
    })

    nearbyNodes.forEach(nearbyNode => {
      const nearbyType = nearbyNode.slice(0, 2).toLowerCase()
      const isPrimary = (type === 'warehouse' && nearbyType === 'dc') || 
                       (type === 'distribution' && nearbyType === 'wh')
      
      graph.value?.addEdge(nodeId, nearbyNode, {
        size: isPrimary ? 8 : 4,
        color: isPrimary ? "#1a1a1a" : "#666666"
      })
    })
  }

  // Refresh the renderer
  renderer.refresh()
}

// Expose the addNode method and nodeCounts
defineExpose({
  addNode,
  nodeCounts
})

onMounted(() => {
  graph.value = new Graph()
  
  // Add warehouse nodes (larger nodes, blue)
  graph.value.addNode("WH1", { 
    label: "Main Warehouse", 
    x: 0, 
    y: 0, 
    size: 25, 
    color: "#1f77b4"
  })
  graph.value.addNode("WH2", { 
    label: "Secondary Warehouse", 
    x: 2, 
    y: 2, 
    size: 20, 
    color: "#1f77b4"
  })
  graph.value.addNode("WH3", { 
    label: "Regional Warehouse", 
    x: -3, 
    y: -2, 
    size: 22, 
    color: "#1f77b4"
  })
  graph.value.addNode("WH4", { 
    label: "Express Warehouse", 
    x: 4, 
    y: -3, 
    size: 18, 
    color: "#1f77b4"
  })

  // Add distribution centers (medium nodes, green)
  graph.value.addNode("DC1", { 
    label: "North DC", 
    x: -2, 
    y: 1, 
    size: 15, 
    color: "#2ca02c"
  })
  graph.value.addNode("DC2", { 
    label: "South DC", 
    x: 1, 
    y: -2, 
    size: 15, 
    color: "#2ca02c"
  })
  graph.value.addNode("DC3", { 
    label: "East DC", 
    x: 3, 
    y: -1, 
    size: 15, 
    color: "#2ca02c"
  })
  graph.value.addNode("DC4", { 
    label: "West DC", 
    x: -3, 
    y: 3, 
    size: 15, 
    color: "#2ca02c"
  })
  graph.value.addNode("DC5", { 
    label: "Central DC", 
    x: 0, 
    y: -3, 
    size: 15, 
    color: "#2ca02c"
  })
  graph.value.addNode("DC6", { 
    label: "Express DC", 
    x: 5, 
    y: 1, 
    size: 15, 
    color: "#2ca02c"
  })

  // Add retail locations (smaller nodes, orange)
  graph.value.addNode("R1", { 
    label: "Retail Store 1", 
    x: -3, 
    y: 2, 
    size: 10, 
    color: "#ff7f0e"
  })
  graph.value.addNode("R2", { 
    label: "Retail Store 2", 
    x: -1, 
    y: -3, 
    size: 10, 
    color: "#ff7f0e"
  })
  graph.value.addNode("R3", { 
    label: "Retail Store 3", 
    x: 4, 
    y: -4, 
    size: 10, 
    color: "#ff7f0e"
  })
  graph.value.addNode("R4", { 
    label: "Retail Store 4", 
    x: 3, 
    y: 3, 
    size: 10, 
    color: "#ff7f0e"
  })
  graph.value.addNode("R5", { 
    label: "Retail Store 5", 
    x: -4, 
    y: -1, 
    size: 10, 
    color: "#ff7f0e"
  })
  graph.value.addNode("R6", { 
    label: "Retail Store 6", 
    x: 2, 
    y: -4, 
    size: 10, 
    color: "#ff7f0e"
  })
  graph.value.addNode("R7", { 
    label: "Retail Store 7", 
    x: 5, 
    y: 3, 
    size: 10, 
    color: "#ff7f0e"
  })
  graph.value.addNode("R8", { 
    label: "Retail Store 8", 
    x: -2, 
    y: 4, 
    size: 10, 
    color: "#ff7f0e"
  })
  graph.value.addNode("R9", { 
    label: "Retail Store 9", 
    x: 6, 
    y: -2, 
    size: 10, 
    color: "#ff7f0e"
  })
  graph.value.addNode("R10", { 
    label: "Retail Store 10", 
    x: 1, 
    y: 4, 
    size: 10, 
    color: "#ff7f0e"
  })

  // Add primary routes (thicker edges, darker color)
  // Main warehouse connections
  graph.value.addEdge("WH1", "DC1", { size: 8, color: "#1a1a1a" })
  graph.value.addEdge("WH1", "DC2", { size: 8, color: "#1a1a1a" })
  graph.value.addEdge("WH1", "DC5", { size: 8, color: "#1a1a1a" })
  
  // Secondary warehouse connections
  graph.value.addEdge("WH2", "DC2", { size: 8, color: "#1a1a1a" })
  graph.value.addEdge("WH2", "DC3", { size: 8, color: "#1a1a1a" })
  graph.value.addEdge("WH2", "DC6", { size: 8, color: "#1a1a1a" })
  
  // Regional warehouse connections
  graph.value.addEdge("WH3", "DC4", { size: 8, color: "#1a1a1a" })
  graph.value.addEdge("WH3", "DC5", { size: 8, color: "#1a1a1a" })
  
  // Express warehouse connections
  graph.value.addEdge("WH4", "DC6", { size: 8, color: "#1a1a1a" })
  graph.value.addEdge("WH4", "DC3", { size: 8, color: "#1a1a1a" })

  // Add secondary routes (thinner edges, lighter color)
  // North DC connections
  graph.value.addEdge("DC1", "R1", { size: 4, color: "#666666" })
  graph.value.addEdge("DC1", "R8", { size: 4, color: "#666666" })
  graph.value.addEdge("DC1", "R10", { size: 4, color: "#666666" })
  
  // South DC connections
  graph.value.addEdge("DC2", "R2", { size: 4, color: "#666666" })
  graph.value.addEdge("DC2", "R6", { size: 4, color: "#666666" })
  
  // East DC connections
  graph.value.addEdge("DC3", "R3", { size: 4, color: "#666666" })
  graph.value.addEdge("DC3", "R7", { size: 4, color: "#666666" })
  graph.value.addEdge("DC3", "R9", { size: 4, color: "#666666" })
  
  // West DC connections
  graph.value.addEdge("DC4", "R5", { size: 4, color: "#666666" })
  graph.value.addEdge("DC4", "R8", { size: 4, color: "#666666" })
  
  // Central DC connections
  graph.value.addEdge("DC5", "R2", { size: 4, color: "#666666" })
  graph.value.addEdge("DC5", "R6", { size: 4, color: "#666666" })
  
  // Express DC connections
  graph.value.addEdge("DC6", "R7", { size: 4, color: "#666666" })
  graph.value.addEdge("DC6", "R9", { size: 4, color: "#666666" })
  graph.value.addEdge("DC6", "R10", { size: 4, color: "#666666" })

  // Add cross-connections between warehouses
  graph.value.addEdge("WH1", "WH2", { size: 4, color: "#666666" })
  graph.value.addEdge("WH1", "WH3", { size: 4, color: "#666666" })
  graph.value.addEdge("WH2", "WH4", { size: 4, color: "#666666" })
  graph.value.addEdge("WH3", "WH4", { size: 4, color: "#666666" })

  // Add some cross-connections between DCs
  graph.value.addEdge("DC1", "DC4", { size: 4, color: "#666666" })
  graph.value.addEdge("DC2", "DC5", { size: 4, color: "#666666" })
  graph.value.addEdge("DC3", "DC6", { size: 4, color: "#666666" })

  // Initialize sigma with custom settings
  const container = document.getElementById("container")
  if (container && graph.value) {
    renderer = new Sigma(graph.value, container, {
      minCameraRatio: 0.1,
      maxCameraRatio: 10,
      labelRenderedSizeThreshold: 6,
      labelSize: 12,
      labelWeight: "bold",
      labelColor: { color: "#000000" }
    })
  }
})

onUnmounted(() => {
  if (renderer) {
    renderer.kill()
    renderer = null
  }
  graph.value = null
})
</script>

<style scoped>
.network-container {
  width: 100%;
  height: 600px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>
