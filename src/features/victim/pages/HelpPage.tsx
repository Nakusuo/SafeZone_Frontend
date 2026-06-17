import { Phone, MessageSquare, MapPin, AlertCircle, Shield } from 'lucide-react'

export const HelpPage = () => {
  return (
    <div className="w-full px-8 py-8 pb-16">
      
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Immediate Help & Emergency Directory</h1>
        <p className="text-gray-600 text-lg">
          Find fast and secure support near you. These services are free and confidential.
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        
        <div className="bg-white rounded-lg border-l-4 border-red-500 p-8 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Emergency Line</h2>
          </div>
          <p className="text-3xl font-bold text-red-600 mb-2">911</p>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />
            Call Now
          </button>
        </div>

        
        <div className="bg-white rounded-lg border-l-4 border-teal p-8 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-teal" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Women's Helpline</h2>
          </div>
          <p className="text-3xl font-bold text-teal mb-2">100</p>
          <button className="w-full bg-teal hover:bg-teal/90 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Contact
          </button>
        </div>
      </div>

      {/* Support Centers */}
      <div className="bg-white rounded-lg p-8 mb-12 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <MapPin className="w-6 h-6 text-teal" />
          <h2 className="text-2xl font-bold text-gray-900">Nearby Support Centers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Center 1 */}
          <div className="border border-gray-200 rounded-lg p-6 hover:border-teal transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                📍
              </div>
              <h3 className="font-bold text-gray-900">Family Police Station</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Av. Central 452, Sector Norte</p>
            <div className="flex items-center gap-2 text-teal mb-4">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">(01) 458-7890</span>
            </div>
            <button className="text-teal font-medium text-sm hover:underline flex items-center gap-1">
              View on map →
            </button>
          </div>

          {/* Center 2 */}
          <div className="border border-gray-200 rounded-lg p-6 hover:border-teal transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                🏥
              </div>
              <h3 className="font-bold text-gray-900">Regional Hospital</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Calle Hospilario s/n</p>
            <div className="flex items-center gap-2 text-teal mb-4">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">Immediate emergencies</span>
            </div>
            <button className="text-teal font-medium text-sm hover:underline flex items-center gap-1">
              Get directions →
            </button>
          </div>

          {/* Center 3 */}
          <div className="border border-gray-200 rounded-lg p-6 hover:border-teal transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                👥
              </div>
              <h3 className="font-bold text-gray-900">CEM (Women's Emergency Center)</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Jr. de la Paz 123, Mezzanine</p>
            <div className="flex items-center gap-2 text-teal mb-4">
              <span className="text-xs font-medium">Mon - Fri: 08:00 - 18:00</span>
            </div>
            <button className="text-teal font-medium text-sm hover:underline flex items-center gap-1">
              More information →
            </button>
          </div>
        </div>
      </div>

      
      <div className="bg-gradient-to-r from-teal to-teal/80 text-white rounded-lg p-12 mb-12">
        <h2 className="text-3xl font-bold mb-6">Your safety is our only priority at this moment.</h2>
        <p className="text-teal-light mb-6">
          Remember that you are not alone. These services are designed to provide immediate legal, medical, and psychological protection.
          If you feel in immediate danger, press the panic button or call 911 directly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium border border-white/40 transition">
            Free Legal Advice
          </button>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium border border-white/40 transition">
            Temporary Shelters
          </button>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium border border-white/40 transition">
            Psychological Support
          </button>
        </div>
      </div>

      
      <div className="bg-gradient-to-b from-gray-100 to-gray-50 rounded-lg p-12 text-center">
        <div className="w-full h-64 bg-gradient-to-br from-teal/10 to-secondary/10 rounded-lg flex items-center justify-center mb-6">
          <span className="text-gray-400 text-6xl">🌅</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Explore Support Centers</h3>
        <p className="text-gray-600">
          Updated location and services available in your area. All our partner centers meet international standards
          of confidentiality and specialized care.
        </p>
      </div>
    </div>
  )
}
