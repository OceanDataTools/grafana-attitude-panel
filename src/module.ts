import { PanelPlugin } from '@grafana/data';
import { AttitudePanel } from './components/AttitudePanel';
import { SimpleOptions } from './types';

const DRAWN_VEHICLES = ['bar', 'ship', 'airplane', 'helicopter', 'underwater-drone', 'quadcopter', 'rov'];

export const plugin = new PanelPlugin<SimpleOptions>(AttitudePanel).setPanelOptions((builder) => {
  builder
    .addRadio({
      path: 'mode',
      name: 'Mode',
      description:
        'Roll: vehicle seen from behind (starboard/right on the right). Pitch: vehicle seen from its starboard/right side (bow/nose on the right).',
      defaultValue: 'roll',
      settings: {
        options: [
          { value: 'roll', label: 'Roll' },
          { value: 'pitch', label: 'Pitch' },
        ],
      },
    })
    .addFieldNamePicker({
      path: 'angleField',
      name: 'Angle Field',
      description:
        'Select which field contains the roll or pitch angle in degrees. Positive roll = starboard/right side down, positive pitch = bow/nose up.',
      defaultValue: '',
    })
    .addBooleanSwitch({
      path: 'invertAngle',
      name: 'Invert Angle',
      description: 'Flip the sign of the angle, for data sources that use the opposite sign convention',
      defaultValue: false,
    })
    .addColorPicker({
      path: 'textColor',
      name: 'Text Color',
      category: ['Coloring'],
      description: 'Color of the text, tick marks and vehicle outline',
      defaultValue: '#111827',
      settings: { showAlpha: true, mode: 'hue' },
    })
    .addColorPicker({
      path: 'vehicleColor',
      name: 'Vehicle Color',
      category: ['Coloring'],
      description: 'Primary color of the vehicle (hull, fuselage, body) and the reference pointers',
      defaultValue: 'red',
      showIf: (opts) => DRAWN_VEHICLES.includes(opts.vehicleType || 'bar'),
      settings: { showAlpha: true, mode: 'hue' },
    })
    .addColorPicker({
      path: 'secondaryColor',
      name: 'Vehicle Secondary Color',
      category: ['Coloring'],
      description: 'Secondary color of the vehicle (superstructure, wings, frame)',
      defaultValue: 'gray',
      showIf: (opts) => DRAWN_VEHICLES.includes(opts.vehicleType || 'bar'),
      settings: { showAlpha: true, mode: 'hue' },
    })
    .addColorPicker({
      path: 'dialColor',
      name: 'Dial Color',
      category: ['Coloring'],
      description: 'Background color of the dial',
      defaultValue: 'white',
      settings: { showAlpha: true, mode: 'hue' },
    })
    .addColorPicker({
      path: 'bezelColor',
      name: 'Bezel Color',
      category: ['Coloring'],
      description: 'Outer ring color',
      defaultValue: '#c6c6c6',
      settings: { showAlpha: true, mode: 'hue' },
    })
    .addColorPicker({
      path: 'horizonColor',
      name: 'Horizon Color',
      category: ['Coloring'],
      description: 'Fill color of the lower half of the dial, below the horizon',
      defaultValue: 'rgba(59, 130, 246, 0.25)',
      showIf: (opts) => opts.showHorizon !== false,
      settings: { showAlpha: true, mode: 'hue' },
    })
    .addColorPicker({
      path: 'limitColor',
      name: 'Limit Color',
      category: ['Coloring'],
      description: 'Color of the limit zone on the dial and of the numeric value once the limit is exceeded',
      defaultValue: 'red',
      showIf: (opts) => (opts.limitAngle ?? 0) > 0,
      settings: { showAlpha: true, mode: 'hue' },
    })
    .addBooleanSwitch({
      path: 'showLabels',
      name: 'Show Scale Labels',
      description: 'Display degree labels (0, 30, 60, 90) around the dial',
      defaultValue: true,
    })
    .addBooleanSwitch({
      path: 'showHorizon',
      name: 'Show Horizon',
      description: 'Shade the lower half of the dial to mark the horizon',
      defaultValue: true,
    })
    .addBooleanSwitch({
      path: 'showValue',
      name: 'Show Numeric Value',
      description: 'Display the angle value in degrees',
      defaultValue: true,
    })
    .addBooleanSwitch({
      path: 'showModeLabel',
      name: 'Show Mode Label',
      description: 'Display "ROLL" or "PITCH" beneath the numeric value',
      defaultValue: true,
    })
    .addNumberInput({
      path: 'decimals',
      name: 'Decimals',
      description: 'Number of decimal places shown in the numeric value',
      defaultValue: 1,
      settings: { min: 0, max: 4, integer: true },
      showIf: (opts) => opts.showValue !== false,
    })
    .addBooleanSwitch({
      path: 'showRange',
      name: 'Show Min/Max Markers',
      description: 'Mark the minimum and maximum angle reached over the dashboard time range',
      defaultValue: false,
    })
    .addNumberInput({
      path: 'limitAngle',
      name: 'Limit Angle (°)',
      description:
        'Shade the dial beyond ± this angle and color the numeric value when it is exceeded. 0 disables the limit.',
      defaultValue: 0,
      settings: { min: 0, max: 90 },
    })
    .addSelect({
      path: 'vehicleType',
      name: 'Vehicle Type',
      description:
        'Select the vehicle silhouette. Each is drawn from behind in roll mode and from the side in pitch mode.',
      defaultValue: 'bar',
      settings: {
        options: [
          { value: 'bar', label: 'Level Bar' },
          { value: 'ship', label: 'Ship' },
          { value: 'airplane', label: 'Airplane' },
          { value: 'helicopter', label: 'Helicopter' },
          { value: 'underwater-drone', label: 'Underwater Drone' },
          { value: 'quadcopter', label: 'Quadcopter' },
          { value: 'rov', label: 'ROV' },
          { value: 'svg', label: 'Custom SVG' },
          { value: 'png', label: 'Custom PNG' },
        ],
      },
    })
    .addTextInput({
      path: 'vehicleSvg',
      name: 'Custom SVG URL / Base64',
      description:
        'Provide a URL or data URI for a custom SVG vehicle (stern view for roll, starboard side view for pitch), centered on its rotation point',
      defaultValue: '',
      showIf: (opts) => opts.vehicleType === 'svg',
    })
    .addTextInput({
      path: 'vehiclePng',
      name: 'Custom PNG URL / Base64',
      description:
        'Provide a URL or data URI for a custom PNG vehicle (stern view for roll, starboard side view for pitch), centered on its rotation point',
      defaultValue: '',
      showIf: (opts) => opts.vehicleType === 'png',
    })
    .addSelect({
      path: 'rotationMode',
      name: 'Rotation Mode',
      description:
        'Rotate the vehicle against a fixed horizon, or keep the vehicle fixed and rotate the dial (artificial horizon style)',
      settings: {
        options: [
          { value: 'rotate-vehicle', label: 'Rotate Vehicle' },
          { value: 'rotate-dial', label: 'Rotate Dial' },
        ],
      },
      defaultValue: 'rotate-vehicle',
    })
    .addNumberInput({
      path: 'animationDurationMs',
      name: 'Animation Duration (ms)',
      description:
        'How long vehicle/dial rotations take to animate. Lower this (or set to 0 to disable animation) for high-frequency live data where the default speed lags behind incoming updates.',
      defaultValue: 600,
      settings: { min: 0, max: 2000, step: 50 },
    });
});
