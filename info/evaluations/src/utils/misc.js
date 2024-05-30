export function capitalize(str) {
  return str.replaceAll(/\S+/g, m => m[0].toUpperCase() + m.slice(1).toLowerCase())
}

export function initCopyButtons() {
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(button.dataset.clipboardText)
      alert(`Copied ${button.dataset.clipboardText} to clipboard`)
    })
  })
}