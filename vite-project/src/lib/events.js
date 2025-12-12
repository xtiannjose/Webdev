export function logEvent(name, data = {}) {
  console.log('[event]', name, data)
}

export function logError(name, error) {
  console.error('[error]', name, error)
}
