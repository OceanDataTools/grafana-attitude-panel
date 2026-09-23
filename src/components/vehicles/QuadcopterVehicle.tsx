import React from 'react';
import { OUTLINE_WIDTH, UNITS_PER_RADIUS, VehicleProps } from './types';

export const QuadcopterVehicle: React.FC<VehicleProps> = ({ radius, colors, mode }) => {
  const scale = radius / UNITS_PER_RADIUS;
  const stroke = { stroke: colors.text, strokeWidth: OUTLINE_WIDTH, strokeLinejoin: 'round' as const };
  const leg = { stroke: colors.text, strokeWidth: 2, strokeLinecap: 'round' as const };
  // Seen from behind both visible rotors are rear rotors; from the side the
  // front rotor (right) takes the primary color to show which way is forward.
  const leftProp = mode === 'roll' ? colors.vehicle : colors.secondary;
  const gimbalX = mode === 'roll' ? 0 : 8;

  return (
    <g transform={`scale(${scale})`} data-testid={`attitude-quadcopter-${mode}`}>
      <line x1={-8} y1={5} x2={-16} y2={18} {...leg} />
      <line x1={8} y1={5} x2={16} y2={18} {...leg} />
      <line x1={-20} y1={18} x2={-12} y2={18} {...leg} />
      <line x1={12} y1={18} x2={20} y2={18} {...leg} />
      <rect x={-36} y={-1.5} width={72} height={3} fill={colors.secondary} {...stroke} />
      <rect x={-37} y={-9} width={6} height={7} fill={colors.secondary} {...stroke} />
      <rect x={31} y={-9} width={6} height={7} fill={colors.secondary} {...stroke} />
      <ellipse cx={-34} cy={-11} rx={12} ry={1.5} fill={leftProp} {...stroke} />
      <ellipse cx={34} cy={-11} rx={12} ry={1.5} fill={colors.vehicle} {...stroke} />
      <rect x={-10} y={-5} width={20} height={10} rx={2} fill={colors.vehicle} {...stroke} />
      <circle cx={gimbalX} cy={9} r={4} fill={colors.secondary} {...stroke} />
      <circle cx={gimbalX + (mode === 'roll' ? 0 : 2)} cy={9} r={1.6} fill={colors.text} />
    </g>
  );
};
