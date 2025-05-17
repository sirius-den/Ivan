<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Settings</h1>
      </v-col>
    </v-row>

    <v-row>
      <!-- Application Settings -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="mb-4">
          <v-card-title>Application Settings</v-card-title>
          <v-card-text>
            <v-form ref="appSettingsForm" v-model="isAppSettingsValid">
              <v-select
                v-model="settings.theme"
                :items="themeOptions"
                label="Theme"
                variant="outlined"
                density="compact"
                class="mb-4"
              ></v-select>

              <v-select
                v-model="settings.language"
                :items="languageOptions"
                label="Language"
                variant="outlined"
                density="compact"
                class="mb-4"
              ></v-select>

              <v-select
                v-model="settings.timezone"
                :items="timezoneOptions"
                label="Timezone"
                variant="outlined"
                density="compact"
                class="mb-4"
              ></v-select>

              <v-select
                v-model="settings.dateFormat"
                :items="dateFormatOptions"
                label="Date Format"
                variant="outlined"
                density="compact"
                class="mb-4"
              ></v-select>

              <v-switch
                v-model="settings.enableNotifications"
                label="Enable Notifications"
                color="primary"
                hide-details
                class="mb-4"
              ></v-switch>

              <v-switch
                v-model="settings.enableSound"
                label="Enable Sound Effects"
                color="primary"
                hide-details
                class="mb-4"
              ></v-switch>

              <v-switch
                v-model="settings.autoSave"
                label="Auto-save Changes"
                color="primary"
                hide-details
              ></v-switch>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Display Settings -->
        <v-card elevation="2">
          <v-card-title>Display Settings</v-card-title>
          <v-card-text>
            <v-select
              v-model="settings.tableDensity"
              :items="densityOptions"
              label="Table Density"
              variant="outlined"
              density="compact"
              class="mb-4"
            ></v-select>

            <v-select
              v-model="settings.itemsPerPage"
              :items="itemsPerPageOptions"
              label="Items Per Page"
              variant="outlined"
              density="compact"
              class="mb-4"
            ></v-select>

            <v-switch
              v-model="settings.showQuickActions"
              label="Show Quick Actions"
              color="primary"
              hide-details
              class="mb-4"
            ></v-switch>

            <v-switch
              v-model="settings.compactSidebar"
              label="Compact Sidebar"
              color="primary"
              hide-details
            ></v-switch>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Security Settings -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="mb-4">
          <v-card-title>Security Settings</v-card-title>
          <v-card-text>
            <v-form ref="securityForm" v-model="isSecurityValid">
              <v-switch
                v-model="settings.twoFactorAuth"
                label="Two-Factor Authentication"
                color="primary"
                hide-details
                class="mb-4"
              ></v-switch>

              <v-switch
                v-model="settings.sessionTimeout"
                label="Session Timeout"
                color="primary"
                hide-details
                class="mb-4"
              ></v-switch>

              <v-select
                v-if="settings.sessionTimeout"
                v-model="settings.timeoutDuration"
                :items="timeoutOptions"
                label="Timeout Duration"
                variant="outlined"
                density="compact"
                class="mb-4"
              ></v-select>

              <v-switch
                v-model="settings.loginNotifications"
                label="Login Notifications"
                color="primary"
                hide-details
                class="mb-4"
              ></v-switch>

              <v-switch
                v-model="settings.activityLogging"
                label="Activity Logging"
                color="primary"
                hide-details
              ></v-switch>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Data Management -->
        <v-card elevation="2" class="mb-4">
          <v-card-title>Data Management</v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              variant="outlined"
              block
              class="mb-4"
              prepend-icon="mdi-download"
              @click="exportData"
            >
              Export Data
            </v-btn>

            <v-btn
              color="error"
              variant="outlined"
              block
              prepend-icon="mdi-delete"
              @click="confirmDataDeletion"
            >
              Delete All Data
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- API Settings -->
        <v-card elevation="2">
          <v-card-title>API Settings</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="settings.apiKey"
              label="API Key"
              variant="outlined"
              density="compact"
              type="password"
              class="mb-4"
              :append-icon="showApiKey ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="showApiKey = !showApiKey"
              :type="showApiKey ? 'text' : 'password'"
            ></v-text-field>

            <v-btn
              color="primary"
              variant="outlined"
              block
              class="mb-4"
              prepend-icon="mdi-refresh"
              @click="regenerateApiKey"
            >
              Regenerate API Key
            </v-btn>

            <v-btn
              color="primary"
              variant="outlined"
              block
              prepend-icon="mdi-file-document"
              @click="viewApiDocs"
            >
              View API Documentation
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Save Changes Button -->
    <v-row class="mt-4">
      <v-col cols="12" class="text-center">
        <v-btn
          color="primary"
          size="large"
          :disabled="!isAppSettingsValid || !isSecurityValid"
          @click="saveSettings"
        >
          Save Changes
        </v-btn>
      </v-col>
    </v-row>

    <!-- Delete Data Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Delete All Data</v-card-title>
        <v-card-text>
          Are you sure you want to delete all data? This action cannot be undone.
          <v-text-field
            v-model="deleteConfirmation"
            label="Type 'DELETE' to confirm"
            variant="outlined"
            density="compact"
            class="mt-4"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            :disabled="deleteConfirmation !== 'DELETE'"
            @click="deleteData"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

definePageMeta({
  layout: 'default'
})

// Form validation
const appSettingsForm = ref(null)
const securityForm = ref(null)
const isAppSettingsValid = ref(true)
const isSecurityValid = ref(true)

// Settings data
const settings = reactive({
  // Application Settings
  theme: 'Light',
  language: 'English',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  enableNotifications: true,
  enableSound: true,
  autoSave: true,

  // Display Settings
  tableDensity: 'Comfortable',
  itemsPerPage: 25,
  showQuickActions: true,
  compactSidebar: false,

  // Security Settings
  twoFactorAuth: false,
  sessionTimeout: true,
  timeoutDuration: '30 minutes',
  loginNotifications: true,
  activityLogging: true,

  // API Settings
  apiKey: 'sk_test_123456789'
})

// Options
const themeOptions = ['Light', 'Dark', 'System']
const languageOptions = ['English', 'Spanish', 'French', 'German', 'Chinese']
const timezoneOptions = ['UTC', 'EST', 'PST', 'GMT', 'IST']
const dateFormatOptions = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']
const densityOptions = ['Comfortable', 'Compact', 'Spacious']
const itemsPerPageOptions = [10, 25, 50, 100]
const timeoutOptions = ['15 minutes', '30 minutes', '1 hour', '2 hours']

// Delete dialog
const deleteDialog = ref(false)
const deleteConfirmation = ref('')
const showApiKey = ref(false)

// Methods
const saveSettings = async () => {
  if (!isAppSettingsValid.value || !isSecurityValid.value) return

  try {
    // Here you would typically make an API call to save the settings
    console.log('Saving settings:', settings)
    // Show success message
  } catch (error) {
    console.error('Error saving settings:', error)
    // Show error message
  }
}

const exportData = () => {
  // Implement data export logic
  console.log('Exporting data...')
}

const confirmDataDeletion = () => {
  deleteDialog.value = true
  deleteConfirmation.value = ''
}

const deleteData = async () => {
  if (deleteConfirmation.value !== 'DELETE') return

  try {
    // Implement data deletion logic
    console.log('Deleting all data...')
    deleteDialog.value = false
    // Show success message
  } catch (error) {
    console.error('Error deleting data:', error)
    // Show error message
  }
}

const regenerateApiKey = () => {
  // Implement API key regeneration logic
  settings.apiKey = 'sk_test_' + Math.random().toString(36).substring(2, 15)
  // Show success message
}

const viewApiDocs = () => {
  // Implement API documentation view logic
  console.log('Opening API documentation...')
}
</script> 