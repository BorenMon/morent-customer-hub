<template>
  <header>
    <nav class="container-fluid">
      <div class="lg:flex" id="logo">
        <a href="/" id="logo-link">
          <img class="logo-img" src="~/assets/logo/morent-logo.svg" alt="Logo Image" />
        </a>
      </div>
      <div id="menu-icon-wrapper">
        <button type="button" class="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          id="menu-icon" @click="toggleMenu">
          <img src="~/assets/icons/menu.svg" alt="" />
        </button>
      </div>
      <div id="search-box-1" class="rounded-full">
        <img src="~/assets/icons/search-normal.svg" alt="" class="icon ml-[18px] search-icon" @click="redirectSearch" />
        <input type="text" class="placeholder:text-gray-400 search-input" name="search"
          placeholder="Search something here" v-model="searchQuery" @keypress.enter.prevent="redirectSearch" />
      </div>
      <div id="icons-wrapper" class="space-x-[20px]">
        <a href="/pages/favorites.html" class="nav-icon">
          <img src="~/assets/icons/heart.svg" alt="" class="icon" />
        </a>
        <a href="/pages/auth.html" id="login" class="font-semibold !hidden">
          Login&nbsp;<img src="~/assets/icons/login.svg" alt="" class="icon" />
        </a>
        <div class="relative inline-block text-left" id="profile">
          <img src="" alt="Profile" id="nav-profile" class="shadow-md" />
          <div
            class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden"
            role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <div class="py-1" role="none">
              <a href="/pages/profile.html" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" role="menuitem"
                tabindex="-1" id="menu-item-0">Profile Setting</a>
              <div class="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer logout" role="menuitem"
                tabindex="-1">
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
          <img src="~/assets/icons/search-normal.svg" alt="" class="icon ml-[18px] search-icon" @click="redirectSearch" />
          <input type="text" class="placeholder:text-gray-400 search-input" name="search"
            placeholder="Search something here" v-model="searchQuery" @keypress.enter.prevent="redirectSearch" />
        </div>
      </div>
    </nav>

    <div id="nav-backdrop" v-if="isMenuOpen" @click="toggleMenu" class="backdrop">
    </div>
    <!-- Mobile menu, show/hide based on menu open state. -->
    <div id="mobile-menu" :style="{ transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)' }"
      class="w-full bg-white px-6 py-6 sm:w-full">
      <div class="flex items-center justify-between">
        <a href="/" id="logo-link">
          <img class="logo-img" src="~/assets/logo/morent-logo.svg" alt="Logo Image" />
        </a>
        <button id="close-icon" @click="toggleMenu" type="button" class="rounded-md p-2.5 text-gray-700">
          <img src="~/assets/icons/close.svg" alt="" />
        </button>
      </div>
      <div class="mt-6 flow-root" id="mobile-nav">
        <div class="-my-6 divide-y divide-gray-500/10">
          <div class="space-y-2 py-6">
            <a href="/" class="active">Home</a>
            <a href="/pages/category.html">Category</a>
            <a href="/pages/blogs.html">Blogs</a>
            <a href="/pages/about.html">About Us</a>
            <a href="/pages/contact.html">Contact Us</a>
          </div>
          <div class="space-y-2 py-6">
            <a href="/pages/favorites.html">Favorites</a>
          </div>
          <div class="py-6 !hidden" id="mobile-login">
            <a href="/pages/auth.html">Login</a>
          </div>
          <div class="space-y-2 py-6 !hidden" id="mobile-profile">
            <a href="/pages/profile.html">Profile Setting</a>
            <a class="logout">Logout</a>
          </div>
        </div>
      </div>
    </div>
    <ul id="nav" class="container-fluid space-x-[32px]">
      <li class="active"><a href="/">Home</a></li>
      <li><a href="/pages/category.html">Category</a></li>
      <li><a href="/pages/blogs.html">Blogs</a></li>
      <li><a href="/pages/about.html">About Us</a></li>
      <li><a href="/pages/contact.html">Contact Us</a></li>
    </ul>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Swal from 'sweetalert2';
import { useRoute } from 'vue-router';

// Reactive state to track whether the menu is open
const isMenuOpen = ref(false);
const searchQuery = ref('');
const isDropdownVisible = ref(false);
const profileImageSrc = ref('/assets/images/sample-profile.jpg'); // Default image

// Function to toggle the menu state
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

// Function to handle media query changes
const handleResize = (e) => {
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
  document.addEventListener('click', (event) => {
    if (
      isDropdownVisible.value &&
      !event.target.closest('#nav-profile') &&
      !event.target.closest('.dropdown-menu')
    ) {
      isDropdownVisible.value = false;
    }
  });
});

// Simulate fetching profile
async function fetchProfile() {
  // Simulate an API call to fetch the profile
  return { avatar: '/assets/images/sample-profile.jpg' }; // Example response
}

// Route handling to check if on category page
const route = useRoute();
const isCategoryPage = computed(() => route.path.includes('/pages/category'));

// Redirect search function
const redirectSearch = () => {
  if (searchQuery.value) {
    console.log(`Redirecting to search results for: ${searchQuery.value}`);
    // Add logic for search redirection
  }
};

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
      // Logout logic here
      console.log('Logged out.');
      // Simulate a logout function and page reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  });
};
</script>