export const config = {
  USE_LOCAL_DATA: true,
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  MOCK_DELAY: 300,
  DEBUG: false,
}

if (config.DEBUG) {
  console.log('🔧 SafeZone Config:', config)
  console.log(
    config.USE_LOCAL_DATA
      ? '📁 Usando datos locales'
      : `🔗 Conectado a: ${config.API_URL}`
  )
}
