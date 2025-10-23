<script lang="ts" setup>
import Resume from '../../resumes/resume.md'
import { getPDFHtml } from './utils/embed'

const resumeEl = ref<HTMLDivElement | null>(null)
const iframeEl = ref<HTMLIFrameElement | null>(null)

function getHead() {
  const headElement = document.head

  const newHead = document.createElement('head')
  newHead.innerHTML = headElement.outerHTML

  const styleElement = document.createElement('style')
  styleElement.textContent = `
    @page { size: A4; margin: 0mm; }

    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: #fff;
      color: #000;
    }

    /* 打印隐藏元素 */
    @media print {
      .no-print { display: none; }
    }
    .resume-container {
      width: 800px;
      margin: 0px auto;
      padding: 30px;
      padding-top: 40px;
      background-color: #fff;
      box-shadow: none;
    }
  `
  newHead.appendChild(styleElement)
  return newHead.outerHTML
}

function downloadPdf() {
  if (resumeEl.value && iframeEl.value) {
    const resumeHtml = resumeEl.value.outerHTML
    const iframe = iframeEl.value
    iframe.srcdoc = getPDFHtml(getHead(), resumeHtml)

    iframe.onload = () => {
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

<style>
.header {
  width: 820px;
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
  width: 820px;
  margin: 0px auto;
  padding: 20px;
  padding-top: 40px;
  background-color: #fff;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
