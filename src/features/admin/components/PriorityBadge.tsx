import React from 'react';
import type { CasePriority } from '../types';

interface PriorityBadgeProps {
  priority: CasePriority;
  size?: 'sm' | 'md' | 'lg';
}

const priorityConfig = {
  critical: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    icon: '🚨',
    label: 'CRITICAL',
  },
  high: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    icon: '⚠️',
    label: 'HIGH',
  },
  medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    icon: '📌',
    label: 'MEDIUM',
  },
  low: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: 'ℹ️',
    label: 'LOW',
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
}) => {
  const config = priorityConfig[priority];
  const sizeClass = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${config.bg} ${config.text} ${sizeClass}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};
