export function setOG({ title, description, image }) {
  const ensure = (name, content) => {
    let el = document.querySelector(`meta[property="${name}"]`) || document.querySelector(`meta[name="${name}"]`)
    if (!el) {
      el = document.createElement('meta')
      if (name.startsWith('og:')) el.setAttribute('property', name)
      else el.setAttribute('name', name)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }
  if (title) ensure('og:title', title)
  if (description) ensure('og:description', description)
  if (image) ensure('og:image', image)
  ensure('twitter:card', 'summary_large_image')
  if (title) ensure('twitter:title', title)
  if (description) ensure('twitter:description', description)
  if (image) ensure('twitter:image', image)
}
