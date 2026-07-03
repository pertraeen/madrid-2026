import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Countdown from '../../../components/countdown.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-info-after': () => h(Countdown)
    })
  }
}
