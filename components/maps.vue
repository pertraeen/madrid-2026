<script setup>
const address = 'Calle de Guipúzcoa, 12, Madrid, Comunidad de Madrid 28020'
const encodedAddress = encodeURIComponent(address)
const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
const embedUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`
</script>

<template>
  <section class="destination" aria-labelledby="destination-title">
    <div class="heading">
      <div>
        <p class="eyebrow">Reisemålet vårt</p>
        <h2 id="destination-title">Calle de Guipúzcoa 12</h2>
      </div>
      <span aria-hidden="true">📍</span>
    </div>

    <a
      class="map-link"
      :href="mapUrl"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`Åpne ${address} i Google Maps`"
    >
      <iframe
        :src="embedUrl"
        :title="`Kart over ${address}`"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        tabindex="-1"
      />
      <span class="open-map">Åpne i Google Maps ↗</span>
    </a>

    <p class="address">{{ address }}</p>
  </section>
</template>

<style scoped>
.destination {
  max-width: 1152px;
  margin: 24px auto 0;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.heading span { font-size: 28px; }
.eyebrow, h2, p { margin: 0; }
.eyebrow { color: var(--vp-c-text-2); font-size: 13px; }
h2 { font-size: 24px; }

.map-link {
  position: relative;
  display: block;
  overflow: hidden;
  height: 260px;
  border-radius: 12px;
  background: var(--vp-c-bg-alt);
}

.map-link:focus-visible { outline: 3px solid var(--vp-c-brand-1); outline-offset: 3px; }
.map-link iframe { width: 100%; height: 100%; border: 0; pointer-events: none; }

.open-map {
  position: absolute;
  right: 12px;
  bottom: 12px;
  padding: 8px 12px;
  border-radius: 999px;
  color: #fff;
  background: #1a73e8;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgb(0 0 0 / 25%);
}

.map-link:hover .open-map { background: #1557b0; }
.address { margin-top: 12px; color: var(--vp-c-text-2); font-size: 14px; }

@media (max-width: 767px) {
  .destination { margin: 24px 24px 0; padding: 18px; }
  .map-link { height: 220px; }
}

@media (min-width: 640px) and (max-width: 767px) {
  .destination { margin-inline: 48px; }
}
</style>
