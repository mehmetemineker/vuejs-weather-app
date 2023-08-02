<script lang="ts" setup>
import axios from "axios";
import { onMounted, onUnmounted, ref, watch } from "vue";
import defaultCityPhoto from '@/assets/city.jpg';
import { useWeatherStore } from '../store/weather'

const weatherStore = useWeatherStore()

const props = defineProps({
  city: { type: String, required: true },
  interval: { type: Number, default: 10000 }
})

const cityPhotoUrl = ref<string>('');
const temp = ref<string>('');
const desc = ref<string>('');
const counter = ref(props.interval / 1000);

let timer: NodeJS.Timer;

const getCityPhotoUrl = async (city: string) => {
  await axios.get(`https://api.teleport.org/api/urban_areas/slug:${city.toLocaleLowerCase()}/images/`)
    .then((response: any) => {
      cityPhotoUrl.value = response.data?.photos[0]?.image?.mobile;
    }).catch(async () => {
      cityPhotoUrl.value = defaultCityPhoto;
    })
}

const getCityWeather = async (city: string) => {
  const url = import.meta.env.VITE_WEATHER_API_URL;
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  await axios
    .get(`${url}weather`, {
      params: {
        q: city.toLocaleLowerCase(),
        units: 'metric',
        appid: apiKey
      }
    })
    .then((response) => {
      const { data } = response;
      temp.value = Math.round(data.main.temp) + '°C';
      desc.value = data.weather[0].description;
    })
};

onMounted(async () => {
  await getCityWeather(props.city)
  await getCityPhotoUrl(props.city)

  timer = setInterval(() => {
    counter.value--
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
});

const remove = () => {
  weatherStore.cities = weatherStore.cities.filter((m: string) => m !== props.city)
}

const refresh = async () => {
  counter.value = props.interval / 1000
  await getCityWeather(props.city)
}

watch(counter, async () => {
  if (counter.value === 0) {
    await refresh()
  }
})
</script>

<template>
  <Card style="width: 25em">
    <template #header>
      <div class="h-15rem bg-cover text-right p-2" :style="{ backgroundImage: `url(${cityPhotoUrl})` }">
        <Button icon="pi pi-times" severity="danger" text rounded aria-label="Remove" @click="remove" />
        <Button icon="pi pi-refresh" severity="success" text rounded aria-label="Refresh" @click="refresh" />

      </div>
    </template>
    <template #title>{{ city }}</template>
    <template #content>
      <p>
        {{ temp }}
      </p>
      <p>
        {{ desc }}
      </p>
    </template>

    <template #footer>{{ counter }}</template>
  </Card>
</template>