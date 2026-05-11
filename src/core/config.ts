// USE_MOCK=true  → trabaja sin backend (datos locales)
// USE_MOCK=false → llama al Spring Boot real
export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  USE_MOCK: import.meta.env.VITE_USE_MOCK !== 'false',
  MOCK_DELAY: 300, // ms de delay simulado en modo mock
  DEBUG: import.meta.env.DEV,
}

if (config.DEBUG) {
  console.log(
    config.USE_MOCK
      ? '📁 Modo MOCK — sin backend'
      : `🔗 Conectado a: ${config.API_URL}`
  )
}
