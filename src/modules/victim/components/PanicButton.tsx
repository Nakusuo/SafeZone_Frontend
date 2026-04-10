import React, { useState } from 'react';
import { Button } from '@/shared/components';
import { AlertTriangle } from 'lucide-react';

interface PanicButtonProps {
  onActivate?: () => void;
  className?: string;
}

/**
 * Botón de pánico para víctimas
 * Activa un protocolo de emergencia inmediato
 */
export const PanicButton: React.FC<PanicButtonProps> = ({ onActivate, className = '' }) => {
  const [isActivating, setIsActivating] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handlePanic = async () => {
    setIsActivating(true);
    try {
      // Aquí se integraría con el servicio de emergencia
      setIsActive(true);
      onActivate?.();
      
      // Auto-desactivar después de 3 segundos
      setTimeout(() => setIsActive(false), 3000);
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <button
      onClick={handlePanic}
      disabled={isActivating || isActive}
      className={`
        flex items-center justify-center gap-2 px-6 py-3 rounded-lg
        bg-red-600 hover:bg-red-700 text-white font-semibold
        transition-all duration-200 ${isActive ? 'animate-pulse' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <AlertTriangle size={20} />
      {isActive ? 'AYUDA EN CAMINO' : 'BOTÓN DE PÁNICO'}
    </button>
  );
};
