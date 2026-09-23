import React from 'react';
import { OUTLINE_WIDTH, UNITS_PER_RADIUS, VehicleProps } from './types';

export const ShipVehicle: React.FC<VehicleProps> = ({ radius, colors, mode }) => {
  const scale = radius / UNITS_PER_RADIUS;
  const stroke = { stroke: colors.text, strokeWidth: OUTLINE_WIDTH, strokeLinejoin: 'round' as const };

  return (
    <g transform={`scale(${scale})`} data-testid={`attitude-ship-${mode}`}>
      {mode === 'roll' ? (
        <>
          {/* Stern view: mast, superstructure with bridge wings, hull */}
          <rect x={-1.5} y={-42} width={3} height={18} fill={colors.secondary} {...stroke} />
          <rect x={-10} y={-36} width={20} height={2} fill={colors.secondary} {...stroke} />
          <rect x={-20} y={-24} width={40} height={18} fill={colors.secondary} {...stroke} />
          <rect x={-30} y={-24} width={60} height={5} fill={colors.secondary} {...stroke} />
          <path d="M-36,-6 L36,-6 L33,10 Q30,22 16,24 L-16,24 Q-30,22 -33,10 Z" fill={colors.vehicle} {...stroke} />
        </>
      ) : (
        <>
          {/* Starboard side view, bow to the right: mast, bridge, funnel, hull */}
          <rect x={16} y={-42} width={2.5} height={16} fill={colors.secondary} {...stroke} />
          <polygon points="-18,-6 -9,-6 -10,-24 -19,-24" fill={colors.secondary} {...stroke} />
          <rect x={8} y={-22} width={20} height={16} fill={colors.secondary} {...stroke} />
          <rect x={6} y={-28} width={24} height={6} fill={colors.secondary} {...stroke} />
          <rect x={8} y={-26.5} width={20} height={2} fill={colors.text} />
          <path d="M-44,-6 L28,-6 L46,-12 L38,12 L-38,12 Q-44,10 -44,4 Z" fill={colors.vehicle} {...stroke} />
        </>
      )}
    </g>
  );
};
