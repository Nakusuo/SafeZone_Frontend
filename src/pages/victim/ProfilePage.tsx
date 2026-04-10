import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Input, Alert } from '../../components'
import { ArrowLeft, User, Mail, Shield, Calendar, Edit2, Save, X } from 'lucide-react'

export const ProfilePage = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData(parsedUser)
    }
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Actualizar en localStorage
      sessionStorage.setItem('user', JSON.stringify(formData))
      setUser(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error guardando cambios:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      VICTIM: 'Víctima',
      PSYCHOLOGIST: 'Psicólogo/a',
      DEFENDER: 'Defensor/a Legal',
    }
    return labels[role] || role
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      VICTIM: 'bg-blue-50 text-blue-700',
      PSYCHOLOGIST: 'bg-secondary/10 text-secondary',
      DEFENDER: 'bg-primary/10 text-primary',
    }
    return colors[role] || 'bg-gray-100 text-gray-700'
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard/victim')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          {!isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>

      {/* Avatar y rol */}
      <Card className="mb-6 text-center py-8">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
        <div className="flex justify-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
            {getRoleLabel(user.role)}
          </span>
        </div>
      </Card>

      {/* Información Personal */}
      {isEditing ? (
        <Card title="Editar Información" className="mb-6">
          <div className="space-y-4">
            <Input
              label="Nombre completo"
              value={formData?.name}
              onChange={(value) => handleChange('name', value)}
            />
            <Input
              label="Correo electrónico"
              type="email"
              value={formData?.email}
              onChange={(value) => handleChange('email', value)}
              disabled
            />
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData(user)
                    setIsEditing(false)
                  }}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  isLoading={isSaving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar cambios
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card title="Información Personal" className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Correo electrónico</p>
                <p className="font-semibold text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Rol</p>
                <p className="font-semibold text-gray-900">{getRoleLabel(user.role)}</p>
              </div>
            </div>

            {user.createdAt && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Fecha de registro</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Seguridad */}
      <Card title="Seguridad" className="mb-6">
        <div className="space-y-3">
          <Alert
            type="info"
            message="Tu contraseña está encriptada y protegida. Nunca la compartimos con terceros."
          />
          <Button variant="outline" className="w-full">
            Cambiar contraseña
          </Button>
        </div>
      </Card>

      {/* Privacidad */}
      <Card title="Privacidad y Datos">
        <div className="space-y-3">
          <Alert
            type="info"
            message="Todos tus datos están encriptados y solo los profesionales asignados pueden acceder a ellos."
          />
          <Button variant="outline" className="w-full">
            Ver política de privacidad
          </Button>
        </div>
      </Card>
    </div>
  )
}
