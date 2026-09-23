import React from 'react';
import { OUTLINE_WIDTH, UNITS_PER_RADIUS, VehicleProps } from './types';

export const BarVehicle: React.FC<VehicleProps> = ({ radius, colors, mode }) => {
  const scale = radius / UNITS_PER_RADIUS;
  const stroke = { stroke: colors.text, strokeWidth: OUTLINE_WIDTH, strokeLinejoin: 'round' as const };

  return (
    <g transform={`scale(${scale})`} data-testid={`attitude-bar-${mode}`}>
      {mode === 'roll' ? (
        <>
          <polygon points="0,-20 4.5,-11 -4.5,-11" fill={colors.secondary} {...stroke} />
          <polygon points="-44,-2.5 -9.5,-2.5 -9.5,9 -14.5,9 -14.5,2.5 -44,2.5" fill={colors.vehicle} {...stroke} />
          <polygon points="44,-2.5 9.5,-2.5 9.5,9 14.5,9 14.5,2.5 44,2.5" fill={colors.vehicle} {...stroke} />
        </>
      ) : (
        <>
          <polygon points="-40,-2.5 0,-2.5 0,2.5 -40,2.5" fill={colors.secondary} {...stroke} />
          <polygon points="0,-2.5 30,-2.5 30,-7.5 44,0 30,7.5 30,2.5 0,2.5" fill={colors.vehicle} {...stroke} />
        </>
      )}
      <circle cx={0} cy={0} r={4} fill="white" {...stroke} />
    </g>
  );
};
