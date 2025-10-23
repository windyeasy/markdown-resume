export function getPDFHtml(headInner: string, bodyInner: string) {
  const html = `
   <html>
       ${headInner}
        <body>
          ${bodyInner}
        </body>
      </html>
  `
  return html
}
