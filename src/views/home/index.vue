<script lang="ts" setup>
import Resume from '../../resumes/resume-template.md'
import { getPDFHtml } from './utils/embed'

const resumeEl = ref<HTMLDivElement | null>(null)
const iframeEl = ref<HTMLIFrameElement | null>(null)

function getHead() {
  const headElement = document.head

  const newHead = document.createElement('head')
  newHead.innerHTML = headElement.outerHTML
  return newHead
}

function downloadPdf() {
  if (resumeEl.value && iframeEl.value) {
    const resumeHtmlEl = resumeEl.value
    const iframe = iframeEl.value
    const headEl = getHead()

    const htmlContent = getPDFHtml(headEl, resumeHtmlEl)

    const doc = iframe.contentDocument || iframe?.contentWindow?.document
    if (!doc)
      return

    doc.open()
    doc.write(htmlContent)
    doc.close()

    iframe.onload = () => {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    }
  }
}
</script>

<template>
  <div class="home">
    <header class="header">
      <button @click="downloadPdf">
        下载为PDF
      </button>
    </header>

    <div ref="resumeEl" class="resume-container">
      <Resume />
    </div>
    <!-- 隐藏 iframe -->
    <iframe ref="iframeEl" style="display:none;" />
  </div>
</template>

<style scoped>
.header {
  width: 870px;
  display: flex;
  justify-content: flex-end;
  margin: 0 auto;
  padding: 10px;
  padding-right: 6px;
}

.header button {
  margin-left: 10px;
  border: none;
  outline: none;
  height: 40px;
  line-height: 40px;
  background-color: dodgerblue;
  padding: 0 15px;
  border-radius: 4px;
  color: white;
}

.resume-container {
  box-sizing: border-box;
  width: 870px;
  margin: 0px auto;
  background-color: #fff;
  padding-bottom: 0;
}
</style>
