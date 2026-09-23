import React, { useState, useEffect, useRef } from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme } from '@grafana/ui';
import { PanelDataErrorView } from '@grafana/runtime';
import { SimpleOptions } from 'types';
import {
  BarVehicle,
  ShipVehicle,
  AirplaneVehicle,
  HelicopterVehicle,
  UnderwaterDroneVehicle,
  QuadcopterVehicle,
  ROVVehicle,
  ImageVehicle,
} from './vehicles';

// Normalize any angle into (-180, 180] for display.
export function normalizeAngle(deg: number): number {
  const a = ((((deg + 180) % 360) + 360) % 360) - 180;
  return a === -180 ? 180 : a;
}

export function formatAngle(deg: number, decimals: number): string {
  const fixed = normalizeAngle(deg).toFixed(decimals);
  // Avoid "-0.0°" / "+0.0°" for values that round to zero
  if (Number(fixed) === 0) {
    return `${Math.abs(Number(fixed)).toFixed(decimals)}°`;
  }
  return `${Number(fixed) > 0 ? '+' : ''}${fixed}°`;
}

export const AttitudePanel: React.FC<PanelProps<SimpleOptions>> = ({
  data,
  width,
  height,
  options,
  fieldConfig,
  id,
}) => {
  const size = Math.min(width, height);
  const radius = size / 2;
  const mode = options.mode ?? 'roll';

  const theme = useTheme();

  const animationMs = options.animationDurationMs ?? 600;
  const transitionStyle = animationMs > 0 ? { transition: `transform ${animationMs}ms ease-in-out` } : {};

  // Positive roll (starboard down) turns the vehicle clockwise when seen from
  // behind; positive pitch (bow up) turns it counter-clockwise when seen from
  // starboard with the bow on the right. SVG rotate() is clockwise-positive.
  const screenSign = mode === 'pitch' ? -1 : 1;

  // === Extract helpers ===
  const findValues = (fieldName?: string): unknown[] | null => {
    if (!fieldName) {
      return null;
    }
    for (const series of data.series) {
      const field = series.fields.find((f) => f.name === fieldName);
      if (field && field.values.length) {
        return field.values as unknown[];
      }
    }
    return null;
  };

  const values = findValues(options.angleField);
  const toNumber = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
  const signed = (v: number | null) => (v === null ? null : options.invertAngle ? -v : v);

  const angle = signed(values ? toNumber(values[values.length - 1]) : null);

  let rangeMin: number | null = null;
  let rangeMax: number | null = null;
  if (options.showRange && values) {
    for (const raw of values) {
      const v = signed(toNumber(raw));
      if (v === null) {
        continue;
      }
      const n = normalizeAngle(v);
      rangeMin = rangeMin === null ? n : Math.min(rangeMin, n);
      rangeMax = rangeMax === null ? n : Math.max(rangeMax, n);
    }
  }

  // === Smooth angle interpolation ===
  const [displayAngle, setDisplayAngle] = useState(angle);
  const cumulativeAngleRef = useRef(angle);

  function unwrapAngle(prev: number | null, raw: number | null): number | null {
    // Initialize on first reading
    if (prev == null) {
      return raw;
    }

    if (raw == null) {
      return null;
    }

    let delta = raw - (prev % 360);

    if (delta > 180) {
      delta -= 360;
    }
    if (delta < -180) {
      delta += 360;
    }

    return prev + delta;
  }

  useEffect(() => {
    const prev = cumulativeAngleRef.current;
    const next = unwrapAngle(prev, angle);
    cumulativeAngleRef.current = next;
    setDisplayAngle(next);
  }, [angle]);

  const screenRotation = displayAngle !== null ? screenSign * displayAngle : null;

  // === Colors ===
  const colors = {
    text: theme.visualization.getColorByName(options.textColor || '#111827'),
    vehicle: theme.visualization.getColorByName(options.vehicleColor || 'red'),
    secondary: theme.visualization.getColorByName(options.secondaryColor || 'gray'),
    dial: theme.visualization.getColorByName(options.dialColor || 'white'),
    bezel: theme.visualization.getColorByName(options.bezelColor || '#c6c6c6'),
    horizon: theme.visualization.getColorByName(options.horizonColor || 'rgba(59, 130, 246, 0.25)'),
    limit: theme.visualization.getColorByName(options.limitColor || 'red'),
  };

  const limitAngle = options.limitAngle ?? 0;
  const hasLimit = limitAngle > 0 && limitAngle < 90;
  const overLimit = hasLimit && angle !== null && Math.abs(normalizeAngle(angle)) > limitAngle;

  // === Helpers ===
  // Polar angle measured clockwise from 12 o'clock, matching the compass panel.
  const polarToCartesian = (r: number, angleRad: number) => ({
    x: r * Math.sin(angleRad),
    y: -r * Math.cos(angleRad),
  });

  const annularSector = (rInner: number, rOuter: number, fromDeg: number, toDeg: number) => {
    const a1 = (fromDeg * Math.PI) / 180;
    const a2 = (toDeg * Math.PI) / 180;
    const largeArc = toDeg - fromDeg > 180 ? 1 : 0;
    const o1 = polarToCartesian(rOuter, a1);
    const o2 = polarToCartesian(rOuter, a2);
    const i1 = polarToCartesian(rInner, a1);
    const i2 = polarToCartesian(rInner, a2);
    return [
      `M ${o1.x} ${o1.y}`,
      `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${o2.x} ${o2.y}`,
      `L ${i2.x} ${i2.y}`,
      `A ${rInner} ${rInner} 0 ${largeArc} 0 ${i1.x} ${i1.y}`,
      'Z',
    ].join(' ');
  };

  // Scale ticks every 5°, labelled every 30° as the angle from the horizon
  // (0 at 3 and 9 o'clock, 90 at 12 and 6 o'clock).
  const isLabelled = (deg: number) => !!options.showLabels && deg % 30 === 0;

  const renderTicks = () =>
    Array.from({ length: 72 }).map((_, i) => {
      const deg = i * 5;
      if (isLabelled(deg)) {
        return null;
      }
      const [innerFrac, strokeWFrac] = deg % 30 === 0 ? [0.74, 0.02] : deg % 10 === 0 ? [0.8, 0.01] : [0.82, 0.008];
      const a = (deg * Math.PI) / 180;
      const p1 = polarToCartesian(radius * 0.86, a);
      const p2 = polarToCartesian(radius * innerFrac, a);
      return (
        <line
          key={deg}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          stroke={colors.text}
          strokeWidth={radius * strokeWFrac}
        />
      );
    });

  const renderLabels = () => (
    <g
      fontFamily="system-ui, sans-serif"
      fontSize={radius * 0.09}
      fill={colors.text}
      textAnchor="middle"
      dominantBaseline="central"
      fontWeight="700"
    >
      {Array.from({ length: 12 }).map((_, i) => {
        const deg = i * 30;
        const { x, y } = polarToCartesian(radius * 0.79, (deg * Math.PI) / 180);
        return (
          <text key={deg} x={x} y={y}>
            {Math.abs(90 - (deg % 180))}
          </text>
        );
      })}
    </g>
  );

  // Pointers at both ends of the vehicle's reference axis, reading off the scale.
  const renderPointers = () => {
    const tip = radius * 0.73;
    const base = radius * 0.65;
    const halfW = radius * 0.03;
    return [1, -1].map((side) => (
      <polygon
        key={side}
        points={`${side * tip},0 ${side * base},${-halfW} ${side * base},${halfW}`}
        fill={colors.vehicle}
        stroke={colors.text}
        strokeWidth={radius * 0.005}
      />
    ));
  };

  // Range markers sit on the bezel, at the dial positions the reference
  // pointers reached at the min/max angle.
  const renderRangeMarker = (value: number, testId: string) => {
    const tip = radius * 0.87;
    const base = radius * 0.95;
    const halfW = radius * 0.03;
    return (
      <g transform={`rotate(${screenSign * value})`} data-testid={testId}>
        {[1, -1].map((side) => (
          <polygon
            key={side}
            points={`${side * tip},0 ${side * base},${-halfW} ${side * base},${halfW}`}
            fill={colors.text}
          />
        ))}
      </g>
    );
  };

  const renderVehicle = () => {
    const props = { radius, colors, mode };
    switch (options.vehicleType) {
      case 'ship':
        return <ShipVehicle {...props} />;
      case 'airplane':
        return <AirplaneVehicle {...props} />;
      case 'helicopter':
        return <HelicopterVehicle {...props} />;
      case 'underwater-drone':
        return <UnderwaterDroneVehicle {...props} />;
      case 'quadcopter':
        return <QuadcopterVehicle {...props} />;
      case 'rov':
        return <ROVVehicle {...props} />;
      case 'svg':
        if (options.vehicleSvg) {
          return <ImageVehicle radius={radius} href={options.vehicleSvg} testId="attitude-svg-vehicle" />;
        }
        break;
      case 'png':
        if (options.vehiclePng) {
          return <ImageVehicle radius={radius} href={options.vehiclePng} testId="attitude-png-vehicle" />;
        }
        break;
    }
    return <BarVehicle {...props} />;
  };

  // Early return if no data
  if (!data.series || data.series.length === 0) {
    return <PanelDataErrorView fieldConfig={fieldConfig} panelId={id} data={data} needsNumberField />;
  }

  const rotateVehicle = options.rotationMode !== 'rotate-dial';
  const dialR = radius * 0.88;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {/* Outer bezel */}
        <circle cx={0} cy={0} r={radius * 0.98} fill={colors.bezel} stroke="#9ca3af" strokeWidth={radius * 0.01} />

        {/* Dial */}
        <circle cx={0} cy={0} r={dialR} fill={colors.dial} />

        <g
          transform={!rotateVehicle && screenRotation !== null ? `rotate(${-screenRotation})` : undefined}
          style={!rotateVehicle ? transitionStyle : {}}
          data-testid="attitude-dial"
        >
          {/* Horizon */}
          {options.showHorizon !== false && (
            <>
              <path
                d={`M ${-dialR} 0 A ${dialR} ${dialR} 0 0 0 ${dialR} 0 Z`}
                fill={colors.horizon}
                data-testid="attitude-horizon"
              />
              <line
                x1={-dialR}
                y1={0}
                x2={dialR}
                y2={0}
                stroke={colors.text}
                strokeWidth={radius * 0.006}
                strokeOpacity={0.5}
              />
            </>
          )}

          {/* Limit zones: everything more than ±limit from the horizon */}
          {hasLimit && (
            <g fill={colors.limit} fillOpacity={0.45} data-testid="attitude-limit-zone">
              <path d={annularSector(radius * 0.8, radius * 0.86, -90 + limitAngle, 90 - limitAngle)} />
              <path d={annularSector(radius * 0.8, radius * 0.86, 90 + limitAngle, 270 - limitAngle)} />
            </g>
          )}

          {options.showLabels && renderLabels()}
          {renderTicks()}

          {/* Min / max over the time range */}
          {rangeMin !== null && renderRangeMarker(rangeMin, 'attitude-range-min')}
          {rangeMax !== null && renderRangeMarker(rangeMax, 'attitude-range-max')}
        </g>

        {/* Dial rim, drawn over the rotating horizon fill */}
        <circle cx={0} cy={0} r={dialR} fill="none" stroke={colors.text} strokeWidth={radius * 0.015} />

        {/* Vehicle */}
        <g
          transform={rotateVehicle && screenRotation !== null ? `rotate(${screenRotation})` : undefined}
          style={rotateVehicle ? transitionStyle : {}}
          data-testid="attitude-vehicle"
        >
          {angle !== null && (
            <>
              {renderPointers()}
              {renderVehicle()}
            </>
          )}
        </g>

        {/* Numeric value */}
        {options.showValue !== false && (
          <text
            x={0}
            y={radius * 0.58}
            fontFamily="system-ui, sans-serif"
            fontSize={radius * 0.15}
            fill={overLimit ? colors.limit : colors.text}
            textAnchor="middle"
            fontWeight="600"
            data-testid="attitude-numeric-value"
          >
            {angle !== null ? formatAngle(angle, options.decimals ?? 1) : 'No data'}
          </text>
        )}

        {options.showModeLabel !== false && (
          <text
            x={0}
            y={radius * 0.7}
            fontFamily="system-ui, sans-serif"
            fontSize={radius * 0.07}
            fill={colors.text}
            textAnchor="middle"
            fontWeight="700"
            letterSpacing={radius * 0.01}
            data-testid="attitude-mode-label"
          >
            {mode === 'pitch' ? 'PITCH' : 'ROLL'}
          </text>
        )}
      </g>
    </svg>
  );
};
