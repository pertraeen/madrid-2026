<script setup>
import { computed, onMounted, ref } from 'vue'

const MADRID = { latitude: 40.4168, longitude: -3.7038 }

const forecast = ref([])
const loading = ref(true)
const error = ref('')

const weatherDescriptions = {
  0: ['Klart', '☀️'],
  1: ['For det meste klart', '🌤️'],
  2: ['Delvis skyet', '⛅'],
  3: ['Overskyet', '☁️'],
  45: ['Tåke', '🌫️'],
  48: ['Rimtåke', '🌫️'],
  51: ['Lett yr', '🌦️'],
  53: ['Yr', '🌦️'],
  55: ['Kraftig yr', '🌧️'],
  61: ['Lett regn', '🌦️'],
  63: ['Regn', '🌧️'],
  65: ['Kraftig regn', '🌧️'],
  71: ['Lett snø', '🌨️'],
  73: ['Snø', '🌨️'],
  75: ['Kraftig snø', '❄️'],
  80: ['Lette regnbyger', '🌦️'],
  81: ['Regnbyger', '🌧️'],
  82: ['Kraftige regnbyger', '⛈️'],
  85: ['Lette snøbyger', '🌨️'],
  86: ['Kraftige snøbyger', '❄️'],
  95: ['Tordenvær', '⛈️'],
  96: ['Tordenvær med hagl', '⛈️'],
  99: ['Kraftig tordenvær', '⛈️']
}

const updatedAt = computed(() => new Intl.DateTimeFormat('nb-NO', {
  hour: '2-digit',
  minute: '2-digit'
}).format(new Date()))

function formatDay(date, index) {
  if (index === 0) return 'I dag'

  return new Intl.DateTimeFormat('nb-NO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/Madrid'
  }).format(new Date(`${date}T12:00:00`))
}

function mostFrequent(codes) {
  const counts = new Map()

  for (const code of codes) {
    counts.set(code, (counts.get(code) ?? 0) + 1)
  }

  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
}

function representativeWeatherCode(date, index, daily, hourly) {
  const daytimeCodes = hourly.time
    .map((time, hourIndex) => ({
      time,
      code: hourly.weather_code[hourIndex],
      isDay: hourly.is_day[hourIndex]
    }))
    .filter(hour => hour.time.startsWith(date) && hour.isDay === 1)
    .map(hour => hour.code)

  // Preserve meaningful precipitation, fog, or thunderstorms when they occur
  // for more than a single daytime hour. Otherwise describe the dominant sky.
  const significantCodes = daytimeCodes.filter(code => code >= 45)
  const hasPersistentFog = significantCodes.filter(code => code === 45 || code === 48).length >= 2
  const hasMeaningfulPrecipitation = significantCodes.length >= 2 && daily.precipitation_sum[index] > 0
  if (hasPersistentFog || hasMeaningfulPrecipitation) {
    return mostFrequent(significantCodes)
  }

  const sunshineShare = daily.sunshine_duration[index] / daily.daylight_duration[index]
  if (sunshineShare >= 0.7) return 0
  if (sunshineShare >= 0.45) return 1
  if (sunshineShare >= 0.2) return 2
  return 3
}

async function loadForecast() {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams({
      latitude: MADRID.latitude,
      longitude: MADRID.longitude,
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunshine_duration,daylight_duration',
      hourly: 'weather_code,is_day',
      timezone: 'Europe/Madrid',
      forecast_days: '5'
    })
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)

    if (!response.ok) throw new Error('Forecast request failed')

    const { daily, hourly } = await response.json()
    if (!daily?.time?.length || !hourly?.time?.length) throw new Error('Invalid forecast data')

    forecast.value = daily.time.map((date, index) => {
      const weatherCode = representativeWeatherCode(date, index, daily, hourly)
      const [description, icon] = weatherDescriptions[weatherCode] ?? ['Ukjent vær', '🌡️']
      return {
        date,
        day: formatDay(date, index),
        description,
        icon,
        max: Math.round(daily.temperature_2m_max[index]),
        min: Math.round(daily.temperature_2m_min[index]),
        rain: daily.precipitation_probability_max[index]
      }
    })
  } catch {
    error.value = 'Kunne ikke hente værmeldingen akkurat nå.'
  } finally {
    loading.value = false
  }
}

onMounted(loadForecast)
</script>

<template>
  <section class="weather" aria-labelledby="weather-title">
    <div class="heading">
      <div>
        <p class="eyebrow">Madrid, Spania</p>
        <h2 id="weather-title">Værmelding</h2>
      </div>
      <button type="button" :disabled="loading" @click="loadForecast">
        {{ loading ? 'Henter…' : 'Oppdater' }}
      </button>
    </div>

    <p v-if="loading && !forecast.length" class="status">Henter værmeldingen…</p>
    <div v-else-if="error && !forecast.length" class="status error" role="alert">
      <span>{{ error }}</span>
      <button type="button" @click="loadForecast">Prøv igjen</button>
    </div>
    <template v-else>
      <div class="days">
        <article v-for="day in forecast" :key="day.date" class="day">
          <h3>{{ day.day }}</h3>
          <span class="icon" role="img" :aria-label="day.description">{{ day.icon }}</span>
          <p class="description">{{ day.description }}</p>
          <p class="temperature"><strong>{{ day.max }}°</strong> <span>{{ day.min }}°</span></p>
          <p class="rain" title="Sannsynlighet for nedbør">💧 {{ day.rain }} %</p>
        </article>
      </div>
      <p class="source">Oppdatert {{ updatedAt }} · Data fra Open-Meteo</p>
      <p v-if="error" class="inline-error" role="alert">{{ error }} Viser sist hentede varsel.</p>
    </template>
  </section>
</template>

<style scoped>
.weather {
  max-width: 1152px;
  margin: 24px auto 0;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg-alt));
}

.heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.eyebrow, h2, h3, p { margin: 0; }
.eyebrow { color: var(--vp-c-text-2); font-size: 13px; }
h2 { font-size: 24px; }
.heading button, .status button { padding: 7px 13px; border: 1px solid var(--vp-c-border); border-radius: 999px; background: var(--vp-c-bg); cursor: pointer; }
button:hover:not(:disabled) { border-color: var(--vp-c-brand-1); }
button:disabled { cursor: wait; opacity: .65; }
.days { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
.day { min-width: 0; padding: 16px 10px; border-radius: 12px; background: var(--vp-c-bg); text-align: center; }
.day h3 { min-height: 38px; font-size: 14px; text-transform: capitalize; }
.icon { display: block; margin: 5px 0; font-size: 32px; }
.description { min-height: 40px; color: var(--vp-c-text-2); font-size: 13px; }
.temperature { margin-top: 7px; font-size: 17px; }
.temperature span { color: var(--vp-c-text-2); }
.rain { margin-top: 4px; color: var(--vp-c-text-2); font-size: 12px; }
.source, .inline-error { margin-top: 12px; color: var(--vp-c-text-3); font-size: 12px; text-align: right; }
.inline-error { color: var(--vp-c-danger-1); }
.status { padding: 24px; color: var(--vp-c-text-2); text-align: center; }
.status.error { display: flex; align-items: center; justify-content: center; gap: 12px; color: var(--vp-c-danger-1); }

@media (max-width: 767px) {
  .weather { margin: 24px 24px 0; padding: 18px; }
  .days { grid-template-columns: repeat(2, 1fr); }
  .day:first-child { grid-column: 1 / -1; }
}

@media (min-width: 640px) and (max-width: 767px) { .weather { margin-inline: 48px; } }
</style>
