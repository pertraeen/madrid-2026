import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/madrid-2026/',
  title: "Madrid 2026",
  description: "Ferieinformasjon",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' }
    ],

    sidebar: [
      {
        text: 'Nyttig',
        items: [
          { text: 'Reise', link: '/travel' },
          { text: 'Transport', link: '/transport' },
          { text: 'Shopping', link: '/shopping' },
          { text: 'Ord og uttrykk', link: '/translation' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
