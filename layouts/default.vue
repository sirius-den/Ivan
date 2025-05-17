<template>
  <v-app :theme="theme">
    <!-- Navigation Drawer (Sidebar) -->
    <v-navigation-drawer
      v-model="drawer"
      permanent
      :class="theme === 'dark' ? 'bg-grey-darken-4' : 'bg-grey-lighten-4'"
    >
      <v-list>
        <!-- Logo -->
        <v-list-item class="mb-4">
          <v-img
            src="/logo.svg"
            max-width="150"
            class="mx-auto"
            alt="Logistics Management Logo"
          ></v-img>
        </v-list-item>

        <!-- Menu Items -->
        <v-list-item
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          :prepend-icon="item.icon"
          :title="item.name"
          :value="item.path"
          rounded="lg"
          class="mb-2"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar (Header) -->
    <v-app-bar
      elevation="1"
      :class="theme === 'dark' ? 'bg-grey-darken-4' : 'bg-white'"
    >
      <v-spacer></v-spacer>
      
      <!-- Theme Toggle -->
      <v-btn
        icon
        class="me-4"
        @click="toggleTheme"
      >
        <v-icon>
          {{ theme === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
        </v-icon>
      </v-btn>
      
      <!-- User Profile -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="text-none"
            variant="text"
          >
            <v-avatar
              size="32"
              class="me-2"
            >
              <v-img :src="userAvatar" alt="User avatar"></v-img>
            </v-avatar>
            {{ username }}
            <v-icon icon="mdi-chevron-down" class="ms-2"></v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            prepend-icon="mdi-account"
            title="Profile"
            @click="navigateTo('/profile')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-cog"
            title="Settings"
            @click="navigateTo('/settings')"
          ></v-list-item>
          <v-divider></v-divider>
          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            @click="handleLogout"
          ></v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content -->
    <v-main :class="theme === 'dark' ? 'bg-grey-darken-3' : 'bg-grey-lighten-3'">
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

const drawer = ref(true)
const username = ref('Eva Retro')
const userAvatar = ref('/goddes.jpg')
const theme = ref('light')
const vuetifyTheme = useTheme()

const menuItems = [
  { name: 'Dashboard', path: '/', icon: 'mdi-view-dashboard' },
  { name: 'Warehouses', path: '/warehouses', icon: 'mdi-warehouse' },
  { name: 'Logistics', path: '/logistics', icon: 'mdi-truck-delivery' },
  { name: 'Infrastructure', path: '/infrastructure', icon: 'mdi-domain' },
  { name: 'Orders Management', path: '/orders', icon: 'mdi-cart' },
  { name: 'Users Management', path: '/users', icon: 'mdi-account-group' }
]

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}

const handleLogout = () => {
  // Implement logout logic here
  console.log('Logging out...')
}

// Theme toggle
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  vuetifyTheme.global.name.value = theme.value
}
</script>

<style>
:root {
  --v-theme-primary: #FFC107 !important; /* Yellow */
  --v-theme-secondary: #FFD54F !important; /* Light Yellow */
  --v-theme-accent: #FFA000 !important; /* Dark Yellow */
  --v-theme-error: #FF5252 !important;
  --v-theme-info: #2196F3 !important;
  --v-theme-success: #4CAF50 !important;
  --v-theme-warning: #FFC107 !important;
}

.v-application {
  --v-theme-primary: #FFC107 !important;
  --v-theme-secondary: #FFD54F !important;
  --v-theme-accent: #FFA000 !important;
}

/* Dark theme overrides */
.v-theme--dark {
  --v-theme-primary: #FFD54F !important; /* Lighter Yellow for dark mode */
  --v-theme-secondary: #FFECB3 !important; /* Very Light Yellow for dark mode */
  --v-theme-accent: #FFC107 !important; /* Standard Yellow for dark mode */
}

.v-list-item--active {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: #000 !important; /* Black text for better contrast on yellow */
}

.v-theme--dark .v-list-item--active {
  color: #fff !important; /* White text for dark mode */
}
</style> 