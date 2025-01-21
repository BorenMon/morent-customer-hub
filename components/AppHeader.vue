<template>
  <header>
    <nav class="container-fluid">
      <div class="lg:flex" id="logo">
        <NuxtLink to="/" id="logo-link">
          <img class="logo-img" src="~/assets/logo/morent-logo.svg" alt="Logo Image" />
        </NuxtLink>
      </div>
      <div id="menu-icon-wrapper">
        <button type="button" class="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          id="menu-icon" @click="toggleMenu">
          <img src="~/assets/icons/menu.svg" alt="" />
        </button>
      </div>
      <div id="search-box-1" class="rounded-full">
        <img src="~/assets/icons/search-normal.svg" alt="" class="icon ml-[18px] search-icon" @click="redirectSearch(router, searchQuery)" />
        <input type="text" class="placeholder:text-gray-400 search-input" name="search"
          placeholder="Search something here" v-model="searchQuery" @keypress.enter.prevent="redirectSearch(router, searchQuery)" />
      </div>
      <div id="icons-wrapper" class="space-x-[20px]">
        <nuxtLink to="/favorites" class="nav-icon" v-if="authStore.isAuthenticated">
          <img src="~/assets/icons/heart.svg" class="icon" />
        </nuxtLink>
        <NuxtLink v-if="!authStore.isAuthenticated" to="/auth#login" id="login" class="font-semibold h-[44px]">
          Login&nbsp;<img src="~/assets/icons/login.svg" class="icon" />
        </NuxtLink>
        <div v-if="authStore.isAuthenticated" class="relative inline-block text-left" id="profile" @click="toggleDropdown">
          <img :src="profileImageSrc" alt="Profile" id="nav-profile" class="shadow-md" />
          <div
            class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" :class="{ hidden: !isDropdownVisible }"
            role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <div class="py-1" role="none">
              <NuxtLink to="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" role="menuitem"
                tabindex="-1" id="menu-item-0">Profile Setting</NuxtLink>
              <div class="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer logout" role="menuitem"
                tabindex="-1" @click="confirmLogout">
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <nav class="container-fluid">
      <div class="space-x-[16px] w-[492px] flex">
        <div id="search-box-2">
          <img src="~/assets/icons/search-normal.svg" alt="" class="icon ml-[18px] search-icon" @click="redirectSearch(router, searchQuery)" />
          <input type="text" class="placeholder:text-gray-400 search-input" name="search"
            placeholder="Search something here" v-model="searchQuery" @keypress.enter.prevent="redirectSearch(router, searchQuery)" />
        </div>
      </div>
    </nav>

    <div id="nav-backdrop" v-if="isMenuOpen" @click="toggleMenu" class="backdrop">
    </div>
    <!-- Mobile menu, show/hide based on menu open state. -->
    <div id="mobile-menu" :style="{ transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)' }"
      class="w-full bg-white px-6 py-6 sm:w-full">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" id="logo-link">
          <img class="logo-img" src="~/assets/logo/morent-logo.svg" alt="Logo Image" />
        </NuxtLink>
        <button id="close-icon" @click="toggleMenu" type="button" class="rounded-md p-2.5 text-gray-700">
          <img src="~/assets/icons/close.svg" alt="" />
        </button>
      </div>
      <div class="mt-6 flow-root" id="mobile-nav">
        <div class="-my-6 divide-y divide-gray-500/10">
          <div class="space-y-2 py-6">
            <NuxtLink to="/" :class="{ active: isPath('/') }">Home</NuxtLink>
            <NuxtLink to="/category" :class="{ active: isPath('/category') }">Category</NuxtLink>
            <NuxtLink to="/blogs" :class="{ active: isPath('/blogs') }">Blogs</NuxtLink>
            <NuxtLink to="/about" :class="{ active: isPath('/about') }">About Us</NuxtLink>
            <NuxtLink to="/contact" :class="{ active: isPath('/contact') }">Contact Us</NuxtLink>
          </div>
          <div class="space-y-2 py-6" v-if="authStore.isAuthenticated">
            <NuxtLink to="/favorites" :class="{ active: isPath('/contact') }">Favorites</NuxtLink>
          </div>
          <div class="py-6 !hidden" id="mobile-login">
            <NuxtLink to="/auth" :class="{ active: isPath('/auth') }">Login</NuxtLink>
          </div>
          <div class="space-y-2 py-6 !hidden" id="mobile-profile">
            <NuxtLink to="/profile" :class="{ active: isPath('/profile') }">Profile Setting</NuxtLink>
            <a class="logout" @click="confirmLogout">Logout</a>
          </div>
        </div>
      </div>
    </div>
    <ul id="nav" class="container-fluid space-x-[32px]">
      <li :class="{ active: isPath('/') }"><NuxtLink to="/">Home</NuxtLink></li>
      <li :class="{ active: isPath('/category') }"><NuxtLink to="/category">Category</NuxtLink></li>
      <li :class="{ active: isPath('/blogs') }"><NuxtLink to="/blogs">Blogs</NuxtLink></li>
      <li :class="{ active: isPath('/about') }"><NuxtLink to="/about">About Us</NuxtLink></li>
      <li :class="{ active: isPath('/contact') }"><NuxtLink to="/contact">Contact Us</NuxtLink></li>
    </ul>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Swal from 'sweetalert2';
import { useRoute, useRouter } from 'vue-router';
import { redirectSearch } from '~/utils/main';
import { useAuthStore } from '~/stores/auth';

import sampleProfileImage from '~/assets/images/sample-profile.jpg';

const authStore = useAuthStore()

// Reactive state to track whether the menu is open
const isMenuOpen = ref(false);
const searchQuery = ref('');
const isDropdownVisible = ref(false);
const profileImageSrc = ref(sampleProfileImage); // Default image

// Route handling
const route = useRoute();
const router = useRouter()
const isCategoryPage = computed(() => isPath('/category'));

function isPath(path: string) {
  return route.path === path;
}

// Watch for route changes
watch(() => route.path, () => {
  isMenuOpen.value = false;
})

// Function to toggle the menu state
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

// Function to handle media query changes
const handleResize = (e: any) => {
  if (e.matches) {
    isMenuOpen.value = false; // Automatically close the mobile menu when screen width is greater than 1024px
  }
};

onMounted(() => {
  // Create a media query list object
  const mediaQuery = window.matchMedia('(min-width: 1024px)');

  // Add listener to the media query to handle screen size changes
  mediaQuery.addEventListener('change', handleResize);

  // Initial check to close the menu if necessary
  if (mediaQuery.matches) {
    isMenuOpen.value = false;
  }

  // Clean up the event listener on component unmount
  onBeforeUnmount(() => {
    mediaQuery.removeEventListener('change', handleResize);
  });

  // Hide dropdown when clicking outside
  document.addEventListener('click', (event: any) => {
    if (
      isDropdownVisible.value &&
      !event.target.closest('#nav-profile') &&
      !event.target.closest('.dropdown-menu')
    ) {
      isDropdownVisible.value = false;
    }
  });
});

// Toggle dropdown visibility
const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value;
};

// Logout confirmation and handling
const confirmLogout = () => {
  Swal.fire({
    title: 'Are you sure to logout?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3563E9',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      authStore.logout()
    }
  });
};
</script>