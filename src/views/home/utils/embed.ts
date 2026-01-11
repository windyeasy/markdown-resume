export function getPDFHtml(headEl: HTMLHeadElement, contentEl: HTMLDivElement) {
  const html = document.createElement('html')
  const body = document.createElement('body')

  body.innerHTML = contentEl.outerHTML

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
      background-color: #fff;
      padding-bottom: 30px;
    }
  `
  body.appendChild(styleElement)
  html.appendChild(headEl)
  html.appendChild(body)
  return html.outerHTML
}
