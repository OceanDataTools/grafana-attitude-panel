import { AttitudeMode } from '../../types';

export interface VehicleColors {
  text: string;
  vehicle: string;
  secondary: string;
}

export interface VehicleProps {
  radius: number;
  colors: VehicleColors;
  mode: AttitudeMode;
}

// Vehicles are drawn in a unit space where the dial radius is 75 units, so
// shapes should stay within roughly x ∈ [-46, 46] and y ∈ [-42, 30] to clear
// the scale labels and the numeric readout. Rotation happens about (0, 0).
export const UNITS_PER_RADIUS = 75;
export const OUTLINE_WIDTH = 0.8;
