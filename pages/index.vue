<!-- pages/create-account.vue -->
<template>
  <div>
    index
    <button
      type="submit"
      class="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
      @click="removeToken"
    >
      remove token
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const removeToken = () => {
  document.cookie =
    "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
</script>
