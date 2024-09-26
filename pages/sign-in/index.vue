<template>
  <div class="min-h-screen bg-black flex items-center justify-center">
    <div class="bg-black p-8 sm:p-10 rounded-md shadow-lg w-full max-w-md">
      <h2 class="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
        Sign In
      </h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label
            for="email"
            class="block text-sm font-medium text-gray-300 mb-1"
            >Email or phone number</label
          >
          <input
            type="text"
            id="email"
            v-model="email"
            class="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring focus:border-red-500"
            placeholder="Enter your email or phone number"
            required
          />
          <p v-if="emailError" class="text-red-500 text-sm mt-1">
            {{ emailError }}
          </p>
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
          <p v-if="passwordError" class="text-red-500 text-sm mt-1">
            {{ passwordError }}
          </p>
        </div>
        <button
          type="submit"
          class="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Sign In
        </button>
        <div
          class="mt-4 flex justify-between items-center text-gray-400 text-sm"
        >
          <div>
            <input type="checkbox" id="remember" v-model="remember" />
            <label for="remember" class="ml-2">Remember me</label>
          </div>
          <a href="#" class="hover:underline">Need help?</a>
        </div>
        <div class="mt-8 text-gray-400 text-sm text-center">
          New to Netflix?
          <a href="/sign-up" class="text-white hover:underline">Sign up now.</a>
        </div>
        <p class="mt-4 text-gray-400 text-xs text-center">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
          <a href="#" class="text-blue-500 hover:underline">Learn more.</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

const tokenCookie = useCookie("auth_token");
const emailError = ref("");

if (tokenCookie.value) {
  console.log("User is logged in with token:", tokenCookie.value);
  // router.push("/");
} else {
  console.log("No authentication token found");
}

definePageMeta({
  layout: false,
});

const email = ref("");
const password = ref("");
const remember = ref(false);
const errorMessage = ref("");

const validateEmailOrPhone = (input) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phonePattern = /^[0-9]{10}$/;

  if (emailPattern.test(input)) {
    return "email";
  } else if (phonePattern.test(input)) {
    return "phone";
  } else {
    return false;
  }
};

const passwordError = ref("");

const checkPasswordLength = (password) => {
  if (password.length < 8 || password.length > 60) {
    return "Your password must contain between 4 and 60 character";
  }
  return null;
};

const handleLogin = async () => {
  const input = email.value;
  const validationResult = validateEmailOrPhone(input);

  if (!validationResult) {
    emailError.value = "Please enter a valid email or phone number.";
    return;
  } else {
    emailError.value = "";
  }

  const passwordValidationResult = checkPasswordLength(password.value);
  if (passwordValidationResult) {
    passwordError.value = passwordValidationResult;
    return;
  } else {
    passwordError.value = "";
  }

  try {
    const response = await $fetch("/api/login", {
      method: "POST",
      body: { username: email.value, password: password.value },
    });
    console.log("res", response);

    if (response.status === "loginsuccessful") {
      let tokenCookie = useCookie("auth_token");
      tokenCookie.value = response.token.encryptedData;
      console.log("check", tokenCookie);
      router.push("/");
      //   console.log("check", response.token);
      console.log(response.message);
    } else {
      errorMessage.value = response.error;
    }
  } catch (error) {
    console.error(error);

    errorMessage.value = "An error occurred during login";
  }
};
</script>
