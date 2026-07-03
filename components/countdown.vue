<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const now = ref(new Date())
let timer = null

const targetDate = new Date(2026, 6, 9, 5, 55, 0, 0)

const remaining = computed(() => {
	const diff = targetDate.getTime() - now.value.getTime()

	if (diff <= 0) {
		return { days: 0, hours: 0, minutes: 0 }
	}

	const totalMinutes = Math.floor(diff / (1000 * 60))
	const days = Math.floor(totalMinutes / (60 * 24))
	const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
	const minutes = totalMinutes % 60

	return { days, hours, minutes }
})

function pad(value) {
	return String(value).padStart(2, '0')
}

onMounted(() => {
	timer = setInterval(() => {
		now.value = new Date()
	}, 1000)
})

onUnmounted(() => {
	if (timer) {
		clearInterval(timer)
	}
})
</script>

<template>
	<div class="countdown">
		<p class="title">Tid til avreise</p>
		<p class="time">
			<strong>{{ remaining.days }}</strong> dager
			<strong>{{ pad(remaining.hours) }}</strong> timer
			<strong>{{ pad(remaining.minutes) }}</strong> minutter
		</p>
	</div>
</template>

<style scoped>
.countdown {
	display: grid;
	gap: 0.25rem;
}

.title {
	margin: 0;
	font-weight: 700;
}

.time {
	margin: 0;
}

.time strong {
	font-variant-numeric: tabular-nums;
}
</style>
