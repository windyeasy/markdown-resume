import type { ResumeMainInfo } from './logics'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Markdown from 'vite-plugin-md'
import { parseCustomSyntaxToMd, parseMainInfoToHtml, parseYmlToObject } from './logics'

function getMarkdownContent(infoLayout: string, headMd: string, newContent: string) {
  const className = `layout-${infoLayout}`
  if (infoLayout === 'right') {
    return `<div class="${className}"><div class="md-resume-content">${newContent}</div>${headMd}</div>`
  }
  return `<div class="${className}">${headMd}<div class="md-resume-content">${newContent}</div></div>`
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/], // <--
    }),
    Markdown({
      transforms: {
        before(code: string, _: string) {
          const obj = parseYmlToObject(code) as ResumeMainInfo
          let headMd = ''
          if (obj) {
            headMd = parseMainInfoToHtml(obj)
          }
          const infoLayout = obj.infoLayout || 'top'

          const newCode = code.replace(/^---[\s\S]*?---\s*/, '')
          const newContent = parseCustomSyntaxToMd(newCode)

          return getMarkdownContent(infoLayout, headMd, newContent)
        },
      },
    }),
    UnoCSS(),
    Components({
      dts: true,
    }),
    AutoImport({
      dts: true, // or a custom path
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md

      ],
      imports: [
        'vue',
        'vue-router',
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
