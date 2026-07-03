<script setup>
import { computed, onMounted, ref } from 'vue'

const eurAmount = ref(1)
const eurToNokRate = ref(null)
const loading = ref(true)
const error = ref('')
const FALLBACK_RATE = 11.5

const nokAmount = computed(() => {
	if (eurToNokRate.value === null) {
		return null
	}

	return eurAmount.value * eurToNokRate.value
})

const formattedRate = computed(() => {
	if (eurToNokRate.value === null) {
		return '-'
	}

	return eurToNokRate.value.toFixed(4)
})

const formattedNokAmount = computed(() => {
	if (nokAmount.value === null) {
		return '-'
	}

	return nokAmount.value.toFixed(2)
})

async function loadRate() {
	loading.value = true
	error.value = ''

	try {
		const cdnResponse = await fetch(
			'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json'
		)

		if (cdnResponse.ok) {
			const cdnData = await cdnResponse.json()
			const cdnRate = cdnData?.eur?.nok

			if (typeof cdnRate === 'number') {
				eurToNokRate.value = cdnRate
				return
			}
		}

		const pagesResponse = await fetch('https://latest.currency-api.pages.dev/v1/currencies/eur.json')

		if (!pagesResponse.ok) {
			throw new Error('Kunne ikke hente valutakurs.')
		}

		const pagesData = await pagesResponse.json()
		const pagesRate = pagesData?.eur?.nok

		if (typeof pagesRate !== 'number') {
			throw new Error('Ugyldig kursdata mottatt.')
		}

		eurToNokRate.value = pagesRate
	} catch (err) {
		if (eurToNokRate.value === null) {
			eurToNokRate.value = FALLBACK_RATE
			error.value = 'Kunne ikke hente live-kurs akkurat na (nettverk/CORS). Viser en omtrentlig kurs.'
		} else {
			error.value = 'Kunne ikke oppdatere kursen na (nettverk/CORS). Viser sist hentede kurs.'
		}
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	void loadRate()
})
</script>

<template>
	<section class="VPFeatures currency-feature">
		<div class="container">
			<div class="items">
				<div class="item grid-3">
					<article class="VPFeature box">
						<h2 class="title">Valutakalkulator</h2>

						<p v-if="loading" class="details">Henter dagens EUR til NOK-kurs...</p>
						<template v-else>
							<p v-if="error" class="details warning">{{ error }}</p>
							<p class="rate">1 EUR = {{ formattedRate }} NOK</p>

							<label class="field" for="eur-input">
								<span class="label">EUR</span>
								<input
									id="eur-input"
									v-model.number="eurAmount"
									type="number"
									min="0"
									step="0.01"
								>
							</label>

							<p class="result">{{ formattedNokAmount }} NOK</p>
						</template>

						<button class="refresh" type="button" @click="loadRate">
							Oppdater kurs
						</button>
					</article>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.currency-feature {
	padding: 0 24px;
}

@media (min-width: 640px) {
	.currency-feature {
		padding: 0 48px;
	}
}

@media (min-width: 960px) {
	.currency-feature {
		padding: 0 64px;
	}
}

.container {
	margin: 0 auto;
	max-width: 1152px;
}

.items {
	display: flex;
	flex-wrap: wrap;
	margin: -8px;
}

.item {
	padding: 8px;
	width: 100%;
}

@media (min-width: 640px) {
	.item.grid-3 {
		width: calc(100% / 2);
	}
}

@media (min-width: 768px) {
	.item.grid-3 {
		width: calc(100% / 3);
	}
}

.VPFeature {
	display: block;
	border: 1px solid var(--vp-c-bg-soft);
	border-radius: 12px;
	height: 100%;
	background-color: var(--vp-c-bg-soft);
	transition: border-color 0.25s, background-color 0.25s;
}

.box {
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 24px;
	height: 100%;
}

.title,
.rate,
.result,
.details {
	margin: 0;
}

.title {
	line-height: 24px;
	font-size: 16px;
	font-weight: 600;
}

.details,
.rate,
.label {
	line-height: 24px;
	font-size: 14px;
	font-weight: 500;
	color: var(--vp-c-text-2);
}

.field {
	display: grid;
	gap: 0.25rem;
	width: fit-content;
}

.field input {
	width: 8.5rem;
	padding: 0.35rem 0.45rem;
	border: 1px solid var(--vp-c-border);
	border-radius: 6px;
	background: var(--vp-c-bg);
}

.result {
	font-size: 16px;
	font-weight: 700;
}

.details.error {
	color: #b42318;
}

.details.warning {
	color: var(--vp-c-text-2);
}

.refresh {
	margin-top: auto;
	width: fit-content;
	border: 1px solid var(--vp-c-border);
	border-radius: 999px;
	padding: 0.35rem 0.75rem;
	font-size: 13px;
	background: var(--vp-c-bg);
	cursor: pointer;
}

.refresh:hover {
	border-color: var(--vp-c-brand-1);
}
</style>
