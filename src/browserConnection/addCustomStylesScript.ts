export default function addCustomStylesScript(): void {
  (function(): void {
    const head = document.getElementsByTagName('head')[0]
    const style = document.createElement('style')
    style.type = 'text/css'
    style.media = 'all'
    style.innerHTML = `
      #game-page > .relative {
        top: 0 !important;
        left: 100px !important;
      }

      #tutorial {
        display: none;
      }
    `
    head.appendChild(style)
  }).call(this)
}
