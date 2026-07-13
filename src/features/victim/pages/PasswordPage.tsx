import { useState } from 'react'
import { Eye, EyeOff, Shield, Check, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const PasswordPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [error, setError] = useState('')

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')

    if (field === 'new') {
      let strength = 0
      if (value.length >= 8) strength++
      if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++
      if (/\d/.test(value)) strength++
      if (/[^a-zA-Z\d]/.test(value)) strength++
      setPasswordStrength(strength)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    
    const userData = sessionStorage.getItem('user')
    if (!userData) {
      setError('Session expired. Please log in again.')
      return
    }
    
    const user = JSON.parse(userData)
    
    if (user.password !== formData.current) {
      setError('The current password is incorrect')
      return
    }
    
    if (formData.new !== formData.confirm) {
      setError('The new passwords do not match')
      return
    }
    
    if (formData.new.length < 8) {
      setError('The password must be at least 8 characters long')
      return
    }
    
    
    const appDataStr = sessionStorage.getItem('safezone_appdata')
    if (appDataStr) {
      const appData = JSON.parse(appDataStr)
      const userIndex = appData.users.findIndex((u: any) => u.id === user.id)
      if (userIndex >= 0) {
        appData.users[userIndex].password = formData.new
        sessionStorage.setItem('safezone_appdata', JSON.stringify(appData))
      }
    }
    
    
    user.password = formData.new
    sessionStorage.setItem('user', JSON.stringify(user))
    
    alert('Password updated successfully!')
    navigate('/dashboard/victim')
  }

  const passwordChecks = [
    { label: 'Mínimo 12 caracteres para mayor seguridad', valid: formData.new.length >= 12 },
    { label: 'Usa una combinación de mayúsculas, minúsculas y números', valid: /[a-z]/.test(formData.new) && /[A-Z]/.test(formData.new) && /\d/.test(formData.new) },
    { label: 'Incluye al menos un carácter especial (p. ej., @, #, $, !)', valid: /[^a-zA-Z\d]/.test(formData.new) },
    { label: 'Evita usar información personal como fechas de nacimiento', valid: true },
  ]

  return (
    <div className="w-full px-8 py-8 pb-16">
      
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-teal" />
          <h1 className="text-3xl font-bold text-gray-900">Cambiar Contraseña</h1>
        </div>
        <p className="text-gray-600">
          Tu seguridad es nuestra prioridad. Actualizar tu contraseña regularmente ayuda a proteger tu 
          santuario digital contra accesos no autorizados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-sm">
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.current}
                  onChange={(e) => handleChange('current', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.new}
                  onChange={(e) => handleChange('new', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              
              {formData.new && (
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition ${
                        passwordStrength === 1 ? 'w-1/4 bg-red-500' :
                        passwordStrength === 2 ? 'w-1/2 bg-yellow-500' :
                        passwordStrength === 3 ? 'w-3/4 bg-blue-500' :
                        'w-full bg-green-500'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {passwordStrength === 1 && 'Débil'}
                    {passwordStrength === 2 && 'Aceptable'}
                    {passwordStrength === 3 && 'Fuerte'}
                    {passwordStrength === 4 && 'Muy fuerte'}
                  </p>
                </div>
              )}
            </div>

            
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirm}
                  onChange={(e) => handleChange('confirm', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-teal hover:bg-teal/90 text-white px-4 py-2 rounded-lg font-bold"
              >
                Actualizar Contraseña
              </button>
            </div>

            
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>¿Olvidaste tu contraseña?</strong> Puedes solicitar un enlace de recuperación a tu correo electrónico de contacto si no recuerdas tu contraseña actual.
              </p>
            </div>
          </form>
        </div>

        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-teal to-teal/80 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Consejos de Seguridad</h2>
            <ul className="space-y-3">
              {passwordChecks.map((check, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${check.valid ? 'text-green-300' : 'text-white/40'}`} />
                  <span className={check.valid ? 'text-teal-light' : 'text-white/70'}>{check.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-teal">
              <h3 className="font-bold text-gray-900 mb-2">Actualizaciones Regulares</h3>
              <p className="text-sm text-gray-600">Cambia tu contraseña cada 3-6 meses para mejorar la seguridad</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-teal">
              <h3 className="font-bold text-gray-900 mb-2">Nunca Compartas</h3>
              <p className="text-sm text-gray-600">SafeZone nunca solicitará tu contraseña por correo electrónico o teléfono</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
