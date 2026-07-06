import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/madrid-2026/',
  title: "Madrid 2026",
  description: "Ferieinformasjon",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Transport', link: '/transport' }
    ],

    sidebar: [
      {
        text: 'Nyttig',
        items: [
          { text: 'Transport', link: '/transport' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
