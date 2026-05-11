import { useState, useEffect, useCallback } from 'react'
import { MapPin, AlertTriangle, X, Navigation, Loader2, CheckCircle2, Phone } from 'lucide-react'
import { useAuth } from '@/core/auth/AuthContext'
import { emergencyService, getCurrentPosition, buildMapsUrl } from '../services/emergencyService'
import { GeoLocation } from '@/shared/types'

// Botón de pánico — RF-03
// Flujo: víctima presiona → captura GPS → confirmación → envío de alerta

type Step = 'idle' | 'confirming' | 'locating' | 'ready' | 'sending' | 'sent' | 'error'

export const PanicButton = () => {
  const { user } = useAuth()
  const [step, setStep] = useState<Step>('idle')
  const [countdown, setCountdown] = useState(10)
  const [gpsLocation, setGpsLocation] = useState<GeoLocation | null>(null)
  const [gpsError, setGpsError] = useState<string | null>(null)
  const [manualAddress, setManualAddress] = useState('')
  const [message, setMessage] = useState('')
  const [alertId, setAlertId] = useState<string | null>(null)

  // Cuando se abre el modal intentamos obtener GPS automáticamente
  useEffect(() => {
    if (step !== 'confirming') return
    setStep('locating')
    setGpsError(null)

    getCurrentPosition()
      .then((loc) => {
        setGpsLocation(loc)
        setStep('ready')
      })
      .catch((err: Error) => {
        setGpsError(err.message)
        setStep('ready') // seguimos igual, el usuario puede escribir la dirección
      })
  }, [step === 'confirming'])

  // Countdown regresivo de 10s — si llega a 0 envía solo
  useEffect(() => {
    if (step !== 'ready') return
    setCountdown(10)
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          handleSend()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [step === 'ready'])

  const handleOpen = () => setStep('confirming')

  const handleCancel = () => {
    setStep('idle')
    setGpsLocation(null)
    setGpsError(null)
    setManualAddress('')
    setMessage('')
    setCountdown(10)
  }

  const handleSend = useCallback(async () => {
    if (step === 'sending' || step === 'sent') return
    if (!user) return
    setStep('sending')
    try {
      const result = await emergencyService.sendPanicAlert({
        victimId: user.id,
        victimName: user.name,
        victimEmail: user.email,
        location: gpsLocation ?? undefined,
        manualAddress: manualAddress.trim() || undefined,
        message: message.trim() || undefined,
      })
      setAlertId(result.id)
      setStep('sent')
      setTimeout(handleCancel, 4000)
    } catch {
      setStep('error')
    }
  }, [step, user, gpsLocation, manualAddress, message])

  const isOpen = step !== 'idle'

  return (
    <>
      {/* Botón rojo fijo en la esquina */}
      <button
        id="panic-button"
        onClick={handleOpen}
        aria-label="Botón de pánico — enviar alerta de emergencia"
        className="
          fixed bottom-8 right-8 z-50
          w-20 h-20 rounded-full
          bg-red-600 hover:bg-red-700 active:scale-95
          text-white font-bold text-xs text-center
          shadow-2xl shadow-red-600/50
          flex flex-col items-center justify-center gap-1
          transition-all duration-200
          border-4 border-white
        "
        style={{ animation: 'pulseRed 2s infinite' }}
      >
        <Phone className="w-6 h-6" strokeWidth={2.5} />
        <span className="leading-tight">SOS</span>
      </button>

      {/* Modal de confirmación */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={step !== 'sending' ? handleCancel : undefined}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-red-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg leading-tight">Alerta de Emergencia</h2>
                  <p className="text-red-100 text-xs">RF-03 — Botón de Pánico</p>
                </div>
              </div>
              {step !== 'sending' && step !== 'sent' && (
                <button onClick={handleCancel} className="text-white/70 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="px-6 py-5 space-y-4">

              {step === 'sending' && (
                <div className="flex flex-col items-center gap-4 py-6">
                  <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                  <p className="text-gray-700 font-medium text-center">Enviando alerta a los profesionales disponibles...</p>
                </div>
              )}

              {step === 'sent' && (
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-900 font-bold text-lg">¡Alerta enviada!</p>
                    <p className="text-gray-500 text-sm mt-1">ID: {alertId}</p>
                    <p className="text-gray-600 text-sm mt-2">Un profesional se pondrá en contacto contigo a la brevedad.</p>
                  </div>
                </div>
              )}

              {step === 'error' && (
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-gray-700 font-medium text-center">No se pudo enviar la alerta. Intenta de nuevo.</p>
                  <button
                    onClick={() => setStep('ready')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {step === 'locating' && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                  <p className="text-blue-700 text-sm font-medium">Obteniendo tu ubicación GPS...</p>
                </div>
              )}

              {step === 'ready' && (
                <>
                  {/* Contador para cancelar */}
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-red-700 text-sm font-medium">Enviando automáticamente en</p>
                    <span className="text-red-600 font-bold text-2xl w-10 text-center">{countdown}</span>
                  </div>

                  {/* GPS capturado */}
                  {gpsLocation ? (
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Navigation className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 font-semibold text-sm">Ubicación GPS capturada</span>
                      </div>
                      <p className="text-green-600 text-xs font-mono">
                        {gpsLocation.latitude.toFixed(6)}, {gpsLocation.longitude.toFixed(6)}
                      </p>
                      {gpsLocation.accuracy && (
                        <p className="text-green-500 text-xs mt-0.5">Precisión: ±{Math.round(gpsLocation.accuracy)} m</p>
                      )}
                      <a
                        href={buildMapsUrl(gpsLocation.latitude, gpsLocation.longitude)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-700 underline mt-1 inline-block"
                      >
                        Ver en Google Maps ↗
                      </a>
                    </div>
                  ) : gpsError ? (
                    <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                        <p className="text-yellow-700 text-xs">{gpsError}</p>
                      </div>
                    </div>
                  ) : null}

                  {/* Dirección manual — alternativa si no hay GPS */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      <MapPin className="w-4 h-4 inline-block mr-1 text-gray-500" />
                      Dirección o lugar (opcional)
                    </label>
                    <input
                      type="text"
                      value={manualAddress}
                      onChange={e => setManualAddress(e.target.value)}
                      placeholder="Ej: Calle 5, frente al parque central"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none text-sm transition-colors"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Mensaje (opcional)
                    </label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Describe brevemente la situación..."
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none text-sm resize-none transition-colors"
                    />
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSend}
                      className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Enviar Ahora
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 text-center pb-1">
                    Tu nombre e información de contacto se enviarán automáticamente con la alerta.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseRed {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7), 0 20px 60px rgba(220, 38, 38, 0.4); }
          50%       { box-shadow: 0 0 0 16px rgba(220, 38, 38, 0), 0 20px 60px rgba(220, 38, 38, 0.4); }
        }
      `}</style>
    </>
  )
}
