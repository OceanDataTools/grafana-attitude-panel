import React from 'react';
import { OUTLINE_WIDTH, UNITS_PER_RADIUS, VehicleProps } from './types';

export const ROVVehicle: React.FC<VehicleProps> = ({ radius, colors, mode }) => {
  const scale = radius / UNITS_PER_RADIUS;
  const stroke = { stroke: colors.text, strokeWidth: OUTLINE_WIDTH, strokeLinejoin: 'round' as const };
  const frame = { fill: 'none', stroke: colors.secondary, strokeWidth: 3 };
  const halfW = mode === 'roll' ? 30 : 38;

  return (
    <g transform={`scale(${scale})`} data-testid={`attitude-rov-${mode}`}>
      {/* Tether termination, flotation block, open frame, skids */}
      <rect x={-2} y={-34} width={4} height={6} fill={colors.text} />
      <rect x={-halfW} y={-12} width={halfW * 2} height={28} {...frame} />
      <rect x={-halfW - 2} y={-28} width={halfW * 2 + 4} height={16} rx={2} fill={colors.vehicle} {...stroke} />
      <rect x={-halfW - 2} y={17} width={halfW * 2 + 4} height={3} rx={1} fill={colors.secondary} {...stroke} />
      {mode === 'roll' ? (
        <>
          <circle cx={-18} cy={3} r={6.5} fill={colors.secondary} {...stroke} />
          <circle cx={18} cy={3} r={6.5} fill={colors.secondary} {...stroke} />
          <circle cx={-18} cy={3} r={2.5} fill={colors.text} />
          <circle cx={18} cy={3} r={2.5} fill={colors.text} />
        </>
      ) : (
        <>
          <rect x={-40} y={-2} width={9} height={10} rx={1.5} fill={colors.secondary} {...stroke} />
          <circle cx={0} cy={3} r={6.5} fill={colors.secondary} {...stroke} />
          <circle cx={0} cy={3} r={2.5} fill={colors.text} />
          <circle cx={31} cy={-4} r={4} fill={colors.text} />
          <polyline
            points="36,6 44,11 44,20"
            fill="none"
            stroke={colors.text}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </g>
  );
};
