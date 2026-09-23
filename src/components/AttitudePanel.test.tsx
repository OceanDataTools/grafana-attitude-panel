import React from 'react';
import { render, screen } from '@testing-library/react';
import { PanelProps } from '@grafana/data';
import { AttitudePanel, formatAngle, normalizeAngle } from './AttitudePanel';
import { SimpleOptions } from '../types';

function makeProps(overrides: {
  fields: Record<string, Array<number | null>>;
  options?: Partial<SimpleOptions>;
}): PanelProps<SimpleOptions> {
  const fields = Object.entries(overrides.fields).map(([name, values]) => ({ name, values }));

  return {
    data: { series: [{ fields }] },
    width: 400,
    height: 400,
    options: {
      mode: 'roll',
      angleField: 'angle',
      showValue: true,
      showLabels: true,
      vehicleType: 'bar',
      rotationMode: 'rotate-vehicle',
      ...overrides.options,
    },
    fieldConfig: { defaults: {}, overrides: [] },
    id: 1,
  } as unknown as PanelProps<SimpleOptions>;
}

describe('angle helpers', () => {
  it.each([
    [0, 0],
    [190, -170],
    [-190, 170],
    [360, 0],
    [180, 180],
    [-180, 180],
  ])('normalizeAngle(%p) === %p', (input, expected) => {
    expect(normalizeAngle(input)).toBeCloseTo(expected);
  });

  it('formats signed values and never shows a signed zero', () => {
    expect(formatAngle(3.24, 1)).toBe('+3.2°');
    expect(formatAngle(-12.5, 0)).toBe('-13°');
    expect(formatAngle(-0.04, 1)).toBe('0.0°');
    expect(formatAngle(0, 0)).toBe('0°');
  });
});

describe('AttitudePanel', () => {
  it('renders the vehicle and numeric readout when the angle is exactly 0', () => {
    render(<AttitudePanel {...makeProps({ fields: { angle: [0] } })} />);

    expect(screen.getByTestId('attitude-numeric-value')).toHaveTextContent('0.0°');
    expect(screen.getByTestId('attitude-vehicle').querySelector('polygon')).not.toBeNull();
  });

  it('shows "No data" when the angle is absent', () => {
    render(<AttitudePanel {...makeProps({ fields: { angle: [] } })} />);

    expect(screen.getByTestId('attitude-numeric-value')).toHaveTextContent('No data');
    expect(screen.getByTestId('attitude-vehicle').children).toHaveLength(0);
  });

  it('rotates the vehicle clockwise for positive roll (starboard down)', () => {
    render(<AttitudePanel {...makeProps({ fields: { angle: [10] } })} />);

    expect(screen.getByTestId('attitude-vehicle').getAttribute('transform')).toBe('rotate(10)');
    expect(screen.getByTestId('attitude-mode-label')).toHaveTextContent('ROLL');
  });

  it('rotates the vehicle counter-clockwise for positive pitch (bow up)', () => {
    render(<AttitudePanel {...makeProps({ fields: { angle: [10] }, options: { mode: 'pitch' } })} />);

    expect(screen.getByTestId('attitude-vehicle').getAttribute('transform')).toBe('rotate(-10)');
    expect(screen.getByTestId('attitude-mode-label')).toHaveTextContent('PITCH');
  });

  it('inverts the angle sign when invertAngle is set', () => {
    render(<AttitudePanel {...makeProps({ fields: { angle: [10] }, options: { invertAngle: true } })} />);

    expect(screen.getByTestId('attitude-vehicle').getAttribute('transform')).toBe('rotate(-10)');
    expect(screen.getByTestId('attitude-numeric-value')).toHaveTextContent('-10.0°');
  });

  it('rotates the dial instead of the vehicle in rotate-dial mode', () => {
    render(<AttitudePanel {...makeProps({ fields: { angle: [10] }, options: { rotationMode: 'rotate-dial' } })} />);

    expect(screen.getByTestId('attitude-vehicle').getAttribute('transform')).toBeNull();
    expect(screen.getByTestId('attitude-dial').getAttribute('transform')).toBe('rotate(-10)');
  });

  it('respects the decimals option', () => {
    render(<AttitudePanel {...makeProps({ fields: { angle: [-3.456] }, options: { decimals: 2 } })} />);

    expect(screen.getByTestId('attitude-numeric-value')).toHaveTextContent('-3.46°');
  });

  it('marks min and max over the time range, ignoring nulls', () => {
    render(<AttitudePanel {...makeProps({ fields: { angle: [2, -7, null, 12, 4] }, options: { showRange: true } })} />);

    expect(screen.getByTestId('attitude-range-min').getAttribute('transform')).toBe('rotate(-7)');
    expect(screen.getByTestId('attitude-range-max').getAttribute('transform')).toBe('rotate(12)');
  });

  it('draws the limit zone and flags the value once the limit is exceeded', () => {
    const { rerender } = render(
      <AttitudePanel {...makeProps({ fields: { angle: [5] }, options: { limitAngle: 15, limitColor: 'red' } })} />
    );
    expect(screen.getByTestId('attitude-limit-zone')).toBeInTheDocument();
    const normalFill = screen.getByTestId('attitude-numeric-value').getAttribute('fill');

    rerender(
      <AttitudePanel {...makeProps({ fields: { angle: [20] }, options: { limitAngle: 15, limitColor: 'red' } })} />
    );
    expect(screen.getByTestId('attitude-numeric-value').getAttribute('fill')).not.toBe(normalFill);
  });

  it('does not draw a limit zone when the limit is 0', () => {
    render(<AttitudePanel {...makeProps({ fields: { angle: [5] }, options: { limitAngle: 0 } })} />);

    expect(screen.queryByTestId('attitude-limit-zone')).toBeNull();
  });
});

describe('AttitudePanel animation duration', () => {
  it('defaults the vehicle transition to 600ms when unset', () => {
    render(<AttitudePanel {...makeProps({ fields: { angle: [5] } })} />);

    expect(screen.getByTestId('attitude-vehicle').getAttribute('style')).toContain('600ms');
  });

  it('disables the transition entirely when animationDurationMs is 0', () => {
    render(<AttitudePanel {...makeProps({ fields: { angle: [5] }, options: { animationDurationMs: 0 } })} />);

    expect(screen.getByTestId('attitude-vehicle').getAttribute('style')).toBeFalsy();
  });
});

describe('AttitudePanel vehicle shapes', () => {
  const types = ['bar', 'ship', 'airplane', 'helicopter', 'underwater-drone', 'quadcopter', 'rov'] as const;
  const modes = ['roll', 'pitch'] as const;

  it.each(types.flatMap((t) => modes.map((m) => [t, m] as const)))(
    'renders the %s vehicle in %s mode',
    (type, mode) => {
      render(<AttitudePanel {...makeProps({ fields: { angle: [5] }, options: { vehicleType: type, mode } })} />);

      const testId = `attitude-${type.replace('-', '')}-${mode}`;
      expect(screen.getByTestId('attitude-vehicle').querySelector(`[data-testid="${testId}"]`)).not.toBeNull();
    }
  );

  it('falls back to the level bar when a custom image type has no URL', () => {
    render(
      <AttitudePanel {...makeProps({ fields: { angle: [5] }, options: { vehicleType: 'svg', vehicleSvg: '' } })} />
    );

    expect(screen.getByTestId('attitude-bar-roll')).toBeInTheDocument();
  });

  it('renders a custom PNG vehicle', () => {
    render(
      <AttitudePanel
        {...makeProps({
          fields: { angle: [5] },
          options: { vehicleType: 'png', vehiclePng: 'data:image/png;base64,AAAA' },
        })}
      />
    );

    expect(screen.getByTestId('attitude-png-vehicle').getAttribute('href')).toBe('data:image/png;base64,AAAA');
  });
});
