import React from 'react';
import { OUTLINE_WIDTH, UNITS_PER_RADIUS, VehicleProps } from './types';

export const UnderwaterDroneVehicle: React.FC<VehicleProps> = ({ radius, colors, mode }) => {
  const scale = radius / UNITS_PER_RADIUS;
  const stroke = { stroke: colors.text, strokeWidth: OUTLINE_WIDTH, strokeLinejoin: 'round' as const };

  return (
    <g transform={`scale(${scale})`} data-testid={`attitude-underwaterdrone-${mode}`}>
      {mode === 'roll' ? (
        <>
          {/* Tail view of a glider: wings, hull, rudder, antenna */}
          <rect x={-1} y={-36} width={2} height={16} fill={colors.text} />
          <polygon points="-2,-8 -1.2,-22 1.2,-22 2,-8" fill={colors.secondary} {...stroke} />
          <rect x={-42} y={-1.2} width={84} height={2.4} fill={colors.secondary} {...stroke} />
          <circle cx={0} cy={0} r={9} fill={colors.vehicle} {...stroke} />
          <circle cx={0} cy={0} r={3.5} fill={colors.secondary} {...stroke} />
        </>
      ) : (
        <>
          {/* Starboard side view, nose to the right */}
          <line x1={-38} y1={-12} x2={-46} y2={-32} stroke={colors.text} strokeWidth={1.5} strokeLinecap="round" />
          <polygon points="-34,-7 -40,-17 -44,-17 -42,-4" fill={colors.secondary} {...stroke} />
          <path d="M-44,-3 L-34,-7 L30,-7 Q44,-7 44,0 Q44,7 30,7 L-34,7 L-44,3 Z" fill={colors.vehicle} {...stroke} />
          <polygon points="6,-0.5 -6,-0.5 -14,2.5 -2,2.5" fill={colors.secondary} {...stroke} />
        </>
      )}
    </g>
  );
};
