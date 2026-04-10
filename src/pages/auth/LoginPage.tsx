import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, AlertCircle } from 'lucide-react'
import { Input, Button } from '../../components'
import { authService } from '../../services/auth'

export const LoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos')
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.login(formData.email, formData.password)
      sessionStorage.setItem('token', response.token)
      sessionStorage.setItem('user', JSON.stringify(response.user))
      
      // Redirigir según rol
      const dashboardMap: Record<string, string> = {
        VICTIM: '/dashboard/victim',
        PSYCHOLOGIST: '/dashboard/psychologist',
        DEFENDER: '/dashboard/defender',
      }
      
      navigate(dashboardMap[response.user.role] || '/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-teal h-14 flex items-center px-8">
        <h1 className="text-white text-xl font-bold">SafeZone</h1>
      </div>

      {/* Main */}
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 space-y-6">
          {/* Title */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido</h2>
            <p className="text-sm text-gray-600">Inicie sesión para acceder a su refugio digital y recursos de seguridad.</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-3 bg-danger-light border border-accent/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
              <p className="text-sm text-accent font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(value) => handleChange('email', value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-900">Password</label>
                <a href="#" className="text-xs text-primary hover:underline">¿Olvidó su contraseña?</a>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(value) => handleChange('password', value)}
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-teal hover:bg-teal/90 text-white py-2.5 rounded-lg font-medium mt-6"
              isLoading={isLoading}
            >
              Inicia Sesión →
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tiene cuenta? <a href="/register" className="text-teal font-medium hover:underline">Regístrese</a>
            </p>
          </div>
        </div>
      </div>

      {/* Safety message */}
      <div className="fixed bottom-6 right-6 max-w-sm">
        <div className="bg-teal-light border border-teal/20 rounded-lg p-4 flex gap-3">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-teal">Tu seguridad es nuestra prioridad</p>
            <p className="text-xs text-teal/70">Utilizamos cifrado de extremo a extremo para proteger</p>
            <a href="#" className="text-xs text-teal font-medium hover:underline">los datos.</a>
          </div>
        </div>
      </div>
    </div>
  )
}
