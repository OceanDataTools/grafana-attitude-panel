import React from 'react';
import { OUTLINE_WIDTH, UNITS_PER_RADIUS, VehicleProps } from './types';

export const HelicopterVehicle: React.FC<VehicleProps> = ({ radius, colors, mode }) => {
  const scale = radius / UNITS_PER_RADIUS;
  const stroke = { stroke: colors.text, strokeWidth: OUTLINE_WIDTH, strokeLinejoin: 'round' as const };
  const strut = { stroke: colors.text, strokeWidth: 2, strokeLinecap: 'round' as const };

  return (
    <g transform={`scale(${scale})`} data-testid={`attitude-helicopter-${mode}`}>
      {mode === 'roll' ? (
        <>
          {/* Rear view: rotor disc edge-on, fuselage, tail boom end-on, skids */}
          <rect x={-46} y={-23} width={92} height={2.5} fill={colors.secondary} {...stroke} />
          <rect x={-1.5} y={-21} width={3} height={9} fill={colors.secondary} {...stroke} />
          <line x1={-8} y1={10} x2={-14} y2={19} {...strut} />
          <line x1={8} y1={10} x2={14} y2={19} {...strut} />
          <ellipse cx={0} cy={0} rx={13} ry={13} fill={colors.vehicle} {...stroke} />
          <circle cx={0} cy={-3} r={4.5} fill={colors.secondary} {...stroke} />
          <rect x={-8} y={-15} width={2} height={24} fill={colors.secondary} {...stroke} />
          <circle cx={-14} cy={19} r={2.5} fill={colors.secondary} {...stroke} />
          <circle cx={14} cy={19} r={2.5} fill={colors.secondary} {...stroke} />
        </>
      ) : (
        <>
          {/* Starboard side view, nose to the right */}
          <rect x={-40} y={-23} width={80} height={2.5} fill={colors.secondary} {...stroke} />
          <rect x={8.5} y={-21} width={3} height={9} fill={colors.secondary} {...stroke} />
          <line x1={2} y1={10} x2={0} y2={18} {...strut} />
          <line x1={18} y1={10} x2={20} y2={18} {...strut} />
          <path
            d="M-10,19 L26,19 Q30,19 31,15"
            fill="none"
            stroke={colors.text}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <polygon points="-34,-3 -43,-18 -46,-18 -44,0" fill={colors.vehicle} {...stroke} />
          <polygon points="-4,-6 -40,-3 -40,1 -4,5" fill={colors.vehicle} {...stroke} />
          <circle cx={-41} cy={-8} r={6} fill="none" stroke={colors.secondary} strokeWidth={1.5} />
          <ellipse cx={10} cy={0} rx={18} ry={12} fill={colors.vehicle} {...stroke} />
          <path d="M16,-11 Q26,-8 28,0 L16,0 Z" fill={colors.secondary} {...stroke} />
        </>
      )}
    </g>
  );
};
