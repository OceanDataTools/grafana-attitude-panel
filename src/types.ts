export type AttitudeMode = 'roll' | 'pitch';

export type VehicleType =
  | 'bar'
  | 'ship'
  | 'airplane'
  | 'helicopter'
  | 'underwater-drone'
  | 'quadcopter'
  | 'rov'
  | 'svg'
  | 'png';

export interface SimpleOptions {
  mode?: AttitudeMode;
  angleField?: string;
  invertAngle?: boolean;

  textColor?: string;
  vehicleColor?: string;
  secondaryColor?: string;
  dialColor?: string;
  bezelColor?: string;
  horizonColor?: string;
  limitColor?: string;

  showLabels?: boolean;
  showHorizon?: boolean;
  showValue?: boolean;
  showModeLabel?: boolean;
  showRange?: boolean;
  decimals?: number;
  limitAngle?: number;

  vehicleType?: VehicleType;
  vehicleSvg?: string;
  vehiclePng?: string;

  rotationMode?: 'rotate-vehicle' | 'rotate-dial';

  animationDurationMs?: number;
}
