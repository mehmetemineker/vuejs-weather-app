<script setup lang="ts">
import { ref } from 'vue';
import WeatherCard from '@/components/WeatherCard.vue'
import { useWeatherStore } from '@/store/weather'

const weatherStore = useWeatherStore()

const cityName = ref<string>('');

const addCity = () => {
  const cityNameNormalized = cityName.value.toLocaleLowerCase()

  if (cityNameNormalized && weatherStore.cities.indexOf(cityNameNormalized) === -1) {
    weatherStore.cities.push(cityNameNormalized)
  }

  cityName.value = ''
}

</script>

<template>
  <div>
    <InputText v-model="cityName" placeholder="Enter City" />
    <Button label="Submit" @click="addCity" />
  </div>


  <div class="grid">
    <div class="col-3" v-for="city in weatherStore.cities">
      <WeatherCard :city="city" />
    </div>
  </div>
</template>
