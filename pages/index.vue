<template>
  <div id="body-wrapper">
    <div id="body" class="container-fluid">
      <Splide
        :options="{
          type: 'loop',
          autoplay: true,
          interval: 5000,
          perPage: 2,
          arrows: false,
          pagination: false,
          gap: '32px',
          breakpoints: {
            1000: {
              perPage: 1,
            },
          },
        }"
        aria-label="Slides"
        id="slide-wrapper"
      >
        <SplideSlide
          v-for="slide in data?.slides"
          :key="slide.id"
          :style="{
            backgroundImage: `url(${getAssetUrl(slide.background_image)})`,
          }"
        >
          <div class="space-y-[16px]" :style="{ color: slide.text_color }">
            <h2>{{ slide.title }}</h2>
            <p>{{ slide.description }}</p>
            <button
              class="slide-button"
              :style="{
                backgroundColor: slide.button_color,
                color: slide.button_text_color,
              }"
            >
              <NuxtLink to="#">{{ slide.button_text }}</NuxtLink>
            </button>
          </div>
          <img
            :src="getAssetUrl(slide.popup_image)"
            loading="lazy"
            class="pl-[56px]"
          />
        </SplideSlide>
      </Splide>
      <div id="booking" class="space-x-[44px]">
        <div class="booking-container" id="pick-up">
          <div>
            <img src="/assets/icons/mark.svg" alt="" />
            <h3>Pick - Up</h3>
          </div>
          <div>
            <div>
              <label>Location</label>
              <div class="select">
                <select class="city"></select>
              </div>
            </div>
            <div>
              <label>Date</label>
              <input type="date" class="date" />
            </div>
            <div>
              <label>Time</label>
              <input type="time" class="time" />
            </div>
          </div>
        </div>
        <div id="swap-icon">
          <img src="/assets/icons/swap.svg" alt="" class="icon" />
        </div>
        <div class="booking-container" id="drop-off">
          <div>
            <img src="/assets/icons/mark.svg" alt="" />
            <h3>Drop - Off</h3>
          </div>
          <div>
            <div>
              <label>Location</label>
              <div class="select">
                <select class="city"></select>
              </div>
            </div>
            <div>
              <label>Date</label>
              <input type="date" class="date" />
            </div>
            <div>
              <label>Time</label>
              <input type="time" class="time" />
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex items-center justify-between mb-[20px] mt-[36px] h-[44px] px-[20px]"
      >
        <h5 class="font-semibold text-[#90A3BF]">Popular Car</h5>
        <a href="/pages/category.html" class="text-[#3563E9] font-semibold"
          >View All</a
        >
      </div>
      <Splide
        :options="{
          arrows: false,
          pagination: false,
          gap: '32px',
          autoWidth: true,
        }"
        aria-label="Slides"
      >
        <SplideSlide v-for="car in data?.populars" :key="car.id" class="car-card">
          <div>
            <div class="-mt-[5px]">
              <div class="text-[20px] font-bold text-[#1A202C]">
                {{ car.model }}
              </div>
              <div class="text-[14px] font-bold text-[#90A3BF]">
                {{ car.type }}
              </div>
            </div>
            <img
              v-if="authStore.isAuthenticated"
              src="~/assets/icons/heart-outline.svg"
              class="icon favorite"
            />
          </div>
          <a href="#" aria-label="See more about car"
            ><img :src="getAssetUrl(car.card_image)" loading="lazy"
          /></a>
          <div class="space-y-[24px]">
            <div>
              <div>
                <img src="~/assets/icons/gas-station.svg" alt="" class="icon" />
                <span>{{ car.gasoline }}L</span>
              </div>
              <div>
                <img src="~/assets/icons/car.svg" alt="" class="icon" />
                <span>{{ car.steering }}</span>
              </div>
              <div>
                <img
                  src="~/assets/icons/profile-2user.svg"
                  alt=""
                  class="icon"
                />
                <span>{{ car.capacity }} People</span>
              </div>
            </div>
            <div>
              <div class="font-bold">
                <div>
                  <span class="text-[20px] text-[#1A202C]"
                    >${{
                      formatToTwoDecimals(
                        car.has_promotion ? car.promotion_price : car.price
                      )
                    }}/</span
                  >
                  <span class="text-[#90A3BF] text-[14px]">day</span>
                </div>
                <s v-if="car.has_promotion" class="text-[14px] text-[#90A3BF]"
                  >${{ formatToTwoDecimals(car.price) }}</s
                >
              </div>
              <button><a href="">Book Now</a></button>
            </div>
          </div>
        </SplideSlide>
      </Splide>
      <div
        class="flex items-center justify-between mb-[20px] mt-[36px] h-[44px] px-[20px]"
      >
        <h5 class="font-semibold text-[#90A3BF]">Recommendation Car</h5>
      </div>
      <div id="recommendation">
        <div class="car-card" v-for="car in data?.recommendations" :key="car.id">
          <div>
            <div class="-mt-[5px]">
              <div class="text-[20px] font-bold text-[#1A202C]">{{ car.model }}</div>
              <div class="text-[14px] font-bold text-[#90A3BF]">{{ car.type }}</div>
            </div>
            <img v-if="authStore.isAuthenticated" src="~/assets/icons/heart-outline.svg" alt="" class="icon favorite" />
          </div>
          <a href="" aria-label="See more about car"
            ><img :src="getAssetUrl(car.card_image)" loading="lazy"
          /></a>
          <div class="space-y-[24px]">
            <div>
              <div>
                <img src="~/assets/icons/gas-station.svg" alt="" class="icon" />
                <span>{{ car.gasoline }}L</span>
              </div>
              <div>
                <img src="~/assets/icons/car.svg" alt="" class="icon" />
                <span>{{ car.steering }}</span>
              </div>
              <div>
                <img
                  src="~/assets/icons/profile-2user.svg"
                  alt=""
                  class="icon"
                />
                <span>{{ car.capacity }} People</span>
              </div>
            </div>
            <div>
              <div class="font-bold">
                <div>
                  <span class="text-[20px] text-[#1A202C]"
                    >${{
                      formatToTwoDecimals(
                        car.has_promotion ? car.promotion_price : car.price
                      )
                    }}/</span
                  >
                  <span class="text-[#90A3BF] text-[14px]">day</span>
                </div>
                <s v-if="car.has_promotion" class="text-[14px] text-[#90A3BF]"
                  >${{ formatToTwoDecimals(car.price) }}</s
                >
              </div>
              <button><a href="">Book Now</a></button>
            </div>
          </div>
        </div>
      </div>
      <div class="my-[64px] flex ml-auto w-1/2 justify-between items-center">
        <button class="-translate-x-1/2">
          <a href="">Show more car</a>
        </button>
        <div class="font-medium text-[#90A3BF]">
          <span id="cars-count">{{ data?.carsCount }}</span> Car
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '~/assets/css/home.css';
</style>

<script setup lang="ts">
import { formatToTwoDecimals } from '@@/utils/main'
import { getAssetUrl, fetchCollection } from '@@/utils/publicAPI'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const { data, status, error } = await useAsyncData('data', async () => {
  const slides = (await fetchCollection('slides?filter[status][_eq]=published'))
    .data

  const populars = (
    await fetchCollection(
      'cars?filter[status][_eq]=published&filter[rent_times][_gte]=50&limit=8'
    )
  ).data
  const popularCarIds = populars.map((car: any) => car.id)

  const recommendations = (
    await fetchCollection(
      `cars?filter[status][_eq]=published&filter[rating][_gte]=4&limit=8&filter[id][_nin]=${popularCarIds.join(
        ','
      )}`
    )
  ).data

  const carsCount = (await fetchCollection('cars?filter[status][_eq]=published&meta=filter_count&limit=0')).meta.filter_count;

  return { slides, populars, recommendations, carsCount }
})
</script>
