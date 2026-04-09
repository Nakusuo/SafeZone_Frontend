// Archivo de configuración para cambiar entre datos locales y API real
// Actualiza este archivo según tus necesidades

export const config = {
  // Cambiar a 'true' para usar datos locales, 'false' para API
  USE_LOCAL_DATA: true,

  // URL de la API (solo se usa si USE_LOCAL_DATA es false)
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',

  // Simular latencia de red en datos locales (ms)
  MOCK_DELAY: 300,

  // Debug mode
  DEBUG: false,
}

// Log de configuración
if (config.DEBUG) {
  console.log('🔧 SafeZone Config:', config)
  console.log(
    config.USE_LOCAL_DATA
      ? '📁 Usando datos locales'
      : `🔗 Conectado a: ${config.API_URL}`
  )
}
