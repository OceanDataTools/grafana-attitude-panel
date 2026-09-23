import React from 'react';
import { OUTLINE_WIDTH, UNITS_PER_RADIUS, VehicleProps } from './types';

export const AirplaneVehicle: React.FC<VehicleProps> = ({ radius, colors, mode }) => {
  const scale = radius / UNITS_PER_RADIUS;
  const stroke = { stroke: colors.text, strokeWidth: OUTLINE_WIDTH, strokeLinejoin: 'round' as const };

  return (
    <g transform={`scale(${scale})`} data-testid={`attitude-airplane-${mode}`}>
      {mode === 'roll' ? (
        <>
          {/* Tail view: dihedral wings, engines, fuselage, tailplane, fin */}
          <polygon points="-46,-2 -7,2 -7,6 -46,1" fill={colors.secondary} {...stroke} />
          <polygon points="46,-2 7,2 7,6 46,1" fill={colors.secondary} {...stroke} />
          <circle cx={-18} cy={8} r={4.5} fill={colors.secondary} {...stroke} />
          <circle cx={18} cy={8} r={4.5} fill={colors.secondary} {...stroke} />
          <circle cx={-18} cy={8} r={1.8} fill={colors.text} />
          <circle cx={18} cy={8} r={1.8} fill={colors.text} />
          <circle cx={0} cy={0} r={9} fill={colors.vehicle} {...stroke} />
          <polygon points="-17,-7 -3,-5 -3,-3 -17,-5" fill={colors.secondary} {...stroke} />
          <polygon points="17,-7 3,-5 3,-3 17,-5" fill={colors.secondary} {...stroke} />
          <polygon points="-2.5,-6 -1,-30 1,-30 2.5,-6" fill={colors.vehicle} {...stroke} />
        </>
      ) : (
        <>
          {/* Starboard side view, nose to the right */}
          <polygon points="-26,-6 -38,-28 -45,-28 -44,-6" fill={colors.vehicle} {...stroke} />
          <path d="M-44,-6 L30,-6 Q46,-5 46,0 Q45,5 30,5 L-26,5 L-44,-2 Z" fill={colors.vehicle} {...stroke} />
          <polygon points="34,-5 40,-4 42.5,-1 34,-1" fill={colors.text} />
          <polygon points="-30,-3 -44,-3 -45,-0.5 -32,-0.5" fill={colors.secondary} {...stroke} />
          <polygon points="10,1 -12,1 -18,4 4,4" fill={colors.secondary} {...stroke} />
          <rect x={-2} y={4} width={14} height={5} rx={2.5} fill={colors.secondary} {...stroke} />
        </>
      )}
    </g>
  );
};
