import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Countdown from '../../../components/countdown.vue'
import Currency from '../../../components/currency.vue'
import Weather from '../../../components/weather.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-info-after': () => h(Countdown),
      'home-features-after': () => h('div', [h(Weather), h(Currency)])
    })
  }
}
