<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Profile</h1>
      </v-col>
    </v-row>

    <v-row>
      <!-- Profile Information -->
      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-text class="text-center">
            <v-avatar
              size="120"
              class="mb-4"
              @click="triggerFileInput"
            >
              <v-img
                :src="userProfile.avatar"
                :alt="userProfile.name"
              ></v-img>
              <v-overlay
                :model-value="isHoveringAvatar"
                contained
                class="align-center justify-center"
                @mouseenter="isHoveringAvatar = true"
                @mouseleave="isHoveringAvatar = false"
              >
                <v-icon icon="mdi-camera" size="large"></v-icon>
              </v-overlay>
            </v-avatar>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="d-none"
              @change="handleAvatarUpload"
            >
            <h2 class="text-h5 mb-2">{{ userProfile.name }}</h2>
            <p class="text-subtitle-1 text-medium-emphasis mb-4">{{ userProfile.role }}</p>
            <v-chip
              :color="getStatusColor(userProfile.status)"
              class="mb-4"
            >
              {{ userProfile.status }}
            </v-chip>
            <v-divider class="my-4"></v-divider>
            <div class="text-left">
              <p class="mb-2">
                <v-icon icon="mdi-email" class="me-2"></v-icon>
                {{ userProfile.email }}
              </p>
              <p class="mb-2">
                <v-icon icon="mdi-phone" class="me-2"></v-icon>
                {{ userProfile.phone }}
              </p>
              <p class="mb-2">
                <v-icon icon="mdi-calendar" class="me-2"></v-icon>
                Member since {{ userProfile.joinDate }}
              </p>
              <p>
                <v-icon icon="mdi-clock-outline" class="me-2"></v-icon>
                Last login: {{ userProfile.lastLogin }}
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Account Settings -->
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title>Account Settings</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="isFormValid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="userProfile.name"
                    label="Full Name"
                    variant="outlined"
                    density="compact"
                    :rules="[v => !!v || 'Name is required']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="userProfile.email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    density="compact"
                    :rules="[
                      v => !!v || 'Email is required',
                      v => /.+@.+\..+/.test(v) || 'Email must be valid'
                    ]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="userProfile.phone"
                    label="Phone Number"
                    variant="outlined"
                    density="compact"
                    :rules="[v => !!v || 'Phone number is required']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="userProfile.language"
                    :items="languageOptions"
                    label="Preferred Language"
                    variant="outlined"
                    density="compact"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-divider class="my-4"></v-divider>
                  <h3 class="text-h6 mb-4">Change Password</h3>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="password.current"
                    label="Current Password"
                    type="password"
                    variant="outlined"
                    density="compact"
                    :rules="[v => !!v || 'Current password is required']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="password.new"
                    label="New Password"
                    type="password"
                    variant="outlined"
                    density="compact"
                    :rules="[
                      v => !!v || 'New password is required',
                      v => v.length >= 8 || 'Password must be at least 8 characters'
                    ]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="password.confirm"
                    label="Confirm New Password"
                    type="password"
                    variant="outlined"
                    density="compact"
                    :rules="[
                      v => !!v || 'Please confirm your password',
                      v => v === password.new || 'Passwords do not match'
                    ]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="!isFormValid"
              @click="saveProfile"
            >
              Save Changes
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Notification Preferences -->
        <v-card elevation="2" class="mt-4">
          <v-card-title>Notification Preferences</v-card-title>
          <v-card-text>
            <v-switch
              v-model="notifications.email"
              label="Email Notifications"
              color="primary"
              hide-details
              class="mb-2"
            ></v-switch>
            <v-switch
              v-model="notifications.sms"
              label="SMS Notifications"
              color="primary"
              hide-details
              class="mb-2"
            ></v-switch>
            <v-switch
              v-model="notifications.system"
              label="System Notifications"
              color="primary"
              hide-details
            ></v-switch>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

definePageMeta({
  layout: 'default'
})

// Profile data
const userProfile = reactive({
  name: 'Eva Retro',
  email: 'john.doe@example.com',
  role: 'Admin',
  status: 'Active',
  avatar: '/goddes.jpg',
  phone: '+1 (555) 123-4567',
  joinDate: 'January 2024',
  lastLogin: '2024-03-15 14:30',
  language: 'English'
})

// Form validation
const form = ref(null)
const isFormValid = ref(false)

// Avatar upload
const fileInput = ref<HTMLInputElement | null>(null)
const isHoveringAvatar = ref(false)

// Password change
const password = reactive({
  current: '',
  new: '',
  confirm: ''
})

// Notifications
const notifications = reactive({
  email: true,
  sms: false,
  system: true
})

// Options
const languageOptions = ['English', 'Spanish', 'French', 'German', 'Chinese']

// Methods
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Active': 'success',
    'Inactive': 'warning',
    'Suspended': 'error'
  }
  return colors[status] || 'grey'
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    // Here you would typically upload the file to your server
    // For now, we'll just create a local URL
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        userProfile.avatar = e.target.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = async () => {
  if (!isFormValid.value) return

  try {
    // Here you would typically make an API call to update the profile
    console.log('Saving profile:', {
      ...userProfile,
      password: password.new ? '******' : undefined,
      notifications
    })

    // Show success message
    // Reset password fields
    password.current = ''
    password.new = ''
    password.confirm = ''
  } catch (error) {
    console.error('Error saving profile:', error)
    // Show error message
  }
}
</script>

<style scoped>
.v-avatar {
  cursor: pointer;
  transition: opacity 0.2s;
}

.v-avatar:hover {
  opacity: 0.8;
}
</style> 