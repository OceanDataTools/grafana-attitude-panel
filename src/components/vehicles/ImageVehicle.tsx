import React from 'react';

interface ImageVehicleProps {
  radius: number;
  href: string;
  testId: string;
}

// Custom images are fit (aspect preserved) into a square covering most of the
// dial and centered on the rotation point.
export const ImageVehicle: React.FC<ImageVehicleProps> = ({ radius, href, testId }) => {
  const size = radius * 1.25;
  return <image href={href} x={-size / 2} y={-size / 2} width={size} height={size} data-testid={testId} />;
};
