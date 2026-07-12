import { useState, useEffect, useCallback } from 'react'
import { AlertTriangle, MapPin, Navigation, Clock, CheckCircle2, RefreshCw, ExternalLink } from 'lucide-react'
import { useAuth } from '@/core/auth/AuthContext'
import { emergencyService, buildMapsUrl } from '@/features/victim/services/emergencyService'
import { EmergencyAlert } from '@/shared/types'

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'a moment ago'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} h ago`
  return `${Math.floor(hrs / 24)} days ago`
}

export const EmergencyAlertsPanel = () => {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [attending, setAttending] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await emergencyService.getActiveAlerts()
      setAlerts(data)
    } catch (err) {
      console.error('Error loading alerts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [load])

  const handleAttend = async (alertId: string) => {
    if (!user || attending) return
    setAttending(alertId)
    try {
      await emergencyService.attendAlert(alertId, user.id, user.name)
      setAlerts(prev => prev.filter(a => a.id !== alertId))
    } catch (err) {
      console.error('Error attending alert:', err)
    } finally {
      setAttending(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-pulse mb-6">
        <div className="h-4 bg-red-200 rounded w-1/3 mb-3" />
        <div className="h-16 bg-red-100 rounded" />
      </div>
    )
  }

  
  if (alerts.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <h3 className="font-bold text-red-700 text-sm uppercase tracking-wide">
            Active Emergency Alerts ({alerts.length})
          </h3>
        </div>
        <button onClick={load} className="text-gray-400 hover:text-gray-600 transition-colors" title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map(alert => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onAttend={handleAttend}
            attending={attending === alert.id}
          />
        ))}
      </div>
    </div>
  )
}

interface AlertCardProps {
  alert: EmergencyAlert
  onAttend: (id: string) => void
  attending: boolean
}

const AlertCard = ({ alert, onAttend, attending }: AlertCardProps) => {
  const hasGps = !!alert.location
  const mapsUrl = hasGps ? buildMapsUrl(alert.location!.latitude, alert.location!.longitude) : null

  return (
    <div className="bg-white border-2 border-red-400 rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{alert.victimName}</p>
            <p className="text-gray-500 text-xs">{alert.victimEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs flex-shrink-0">
          <Clock className="w-3 h-3" />
          <span>{timeAgo(alert.createdAt)}</span>
        </div>
      </div>

      
      {hasGps && (
        <div className="flex items-start gap-2 mb-2 p-2.5 bg-green-50 rounded-lg">
          <Navigation className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-green-700 text-xs font-semibold">GPS Location</p>
            <p className="text-green-600 text-xs font-mono mt-0.5">
              {alert.location!.latitude.toFixed(6)}, {alert.location!.longitude.toFixed(6)}
            </p>
            {alert.location!.accuracy && (
              <p className="text-green-500 text-xs">±{Math.round(alert.location!.accuracy)} m</p>
            )}
          </div>
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-green-700 hover:text-green-900 font-medium transition-colors flex-shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Map
            </a>
          )}
        </div>
      )}

      
      {alert.manualAddress && (
        <div className="flex items-start gap-2 mb-2 p-2.5 bg-blue-50 rounded-lg">
          <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-700 text-xs font-semibold">Indicated Address</p>
            <p className="text-blue-600 text-xs mt-0.5">{alert.manualAddress}</p>
          </div>
        </div>
      )}

      {alert.message && (
        <div className="mb-3 p-2.5 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-xs font-semibold mb-0.5">Victim Message</p>
          <p className="text-gray-700 text-sm italic">"{alert.message}"</p>
        </div>
      )}

      {!hasGps && !alert.manualAddress && (
        <div className="flex items-center gap-2 mb-3 p-2.5 bg-yellow-50 rounded-lg">
          <MapPin className="w-4 h-4 text-yellow-600" />
          <p className="text-yellow-700 text-xs">Location not available</p>
        </div>
      )}

      <button
        onClick={() => onAttend(alert.id)}
        disabled={attending}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg font-semibold text-sm transition-colors"
      >
        {attending ? (
          <><RefreshCw className="w-4 h-4 animate-spin" /> Attending...</>
        ) : (
          <><CheckCircle2 className="w-4 h-4" /> Mark as Attended</>
        )}
      </button>
    </div>
  )
}
