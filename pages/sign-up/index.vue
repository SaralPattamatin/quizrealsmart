<template>
  <div class="min-h-screen bg-black flex items-center justify-center">
    <div class="bg-black p-8 sm:p-10 rounded-md shadow-lg w-full max-w-md">
      <h2 class="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
        Create Account
      </h2>
      <form @submit.prevent="createAccount">
        <div class="mb-4">
          <label
            for="username"
            class="block text-sm font-medium text-gray-300 mb-1"
            >Username</label
          >
          <input
            type="text"
            id="username"
            v-model="username"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring focus:border-red-500"
            placeholder="Enter your username"
            required
          />
        </div>
        <div class="mb-6">
          <label
            for="password"
            class="block text-sm font-medium text-gray-300 mb-1"
            >Password</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring focus:border-red-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Create Account
        </button>
        <div class="mt-8 text-gray-400 text-sm text-center">
          Already have an account?
          <a href="#" class="text-white hover:underline">Sign in now.</a>
        </div>
        <p class="mt-4 text-gray-400 text-xs text-center">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
          <a href="#" class="text-blue-500 hover:underline">Learn more.</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const tokenCookie = useCookie("auth_token");

if (tokenCookie.value) {
  console.log("User is logged in with token:", tokenCookie.value);
  // router.push("/");
} else {
  console.log("No authentication token found");
}

definePageMeta({
  layout: false,
});
const username = ref("");
const password = ref("");

const createAccount = async () => {
  const response = await $fetch("/api/createAccount", {
    method: "POST",
    body: { username: username.value, password: password.value },
  });
  if (response.message == "Account created successfully") {
    // router.push("/sign-in");
  } else {
  }
  console.log(response.message);
};
</script>
