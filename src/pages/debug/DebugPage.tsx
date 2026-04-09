import { useState } from 'react'
import { Card, Button } from '../../components'
import { Trash2, RefreshCw } from 'lucide-react'
import { resetData, localStorageService } from '../../services/localStorage'

export const DebugPage = () => {
  const [data, setData] = useState<any>(null)
  const [showData, setShowData] = useState(false)

  const handleLoadData = () => {
    const allData = localStorageService.getAllData()
    setData(allData)
    setShowData(true)
  }

  const handleResetData = () => {
    if (window.confirm('¿Reseteamos los datos a valores iniciales? Se perderán todos los cambios de esta sesión.')) {
      resetData()
      handleLoadData()
      console.log('✓ Datos reseteados')
    }
  }

  const handleClearLocalStorage = () => {
    if (window.confirm('¿Limpiar localStorage completamente? Se perderán todos los datos.')) {
      localStorage.removeItem('safezone_appdata')
      setData(null)
      setShowData(false)
      console.log('✓ localStorage limpiado')
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Panel de Debugging</h1>
        <p className="text-gray-600">Gestiona datos locales y localStorage del navegador</p>
      </div>

      {/* Controles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button variant="primary" className="w-full" onClick={handleLoadData}>
          📊 Cargar Datos
        </Button>
        <Button variant="secondary" className="w-full" onClick={handleResetData}>
          <RefreshCw className="w-4 h-4 inline mr-2" />
          Resetear
        </Button>
        <Button variant="danger" className="w-full" onClick={handleClearLocalStorage}>
          <Trash2 className="w-4 h-4 inline mr-2" />
          Limpiar Todo
        </Button>
      </div>

      {/* Información */}
      <Card type="info" className="mb-8">
        <div className="space-y-2">
          <p><strong>Clave localStorage:</strong> <code className="bg-gray-100 px-2 py-1 rounded">safezone_appdata</code></p>
          <p><strong>Almacenamiento usado:</strong> {
            localStorage.getItem('safezone_appdata')?.length 
              ? `${(localStorage.getItem('safezone_appdata')?.length || 0) / 1024} KB`
              : 'Vacío'
          }</p>
          <p className="text-xs text-gray-600">
            Los cambios se guardan automáticamente. Limpiar cache del navegador borra los datos.
          </p>
        </div>
      </Card>

      {/* Visualización de datos */}
      {showData && data && (
        <Card title="Datos Cargados en localStorage">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">👥 Usuarios ({data.users?.length || 0})</h3>
              <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(data.users, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📋 Reportes ({data.reports?.length || 0})</h3>
              <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(data.reports, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🧠 Evaluaciones ({data.evaluations?.length || 0})</h3>
              <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(data.evaluations, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">⚖️ Actualizaciones Legales ({data.legalUpdates?.length || 0})</h3>
              <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(data.legalUpdates, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      )}

      {!showData && (
        <Card type="warning" className="text-center">
          <p className="text-gray-700">Haz clic en "Cargar Datos" para ver el contenido de localStorage</p>
        </Card>
      )}
    </div>
  )
}
