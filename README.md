# Attitude Panel

[![GitHub Sponsor](https://img.shields.io/github/sponsors/webbpinner?label=Sponsor&logo=GitHub)](https://github.com/sponsors/webbpinner)
[![License](https://img.shields.io/github/license/OceanDataTools/grafana-attitude-panel)](LICENSE)

## Overview / Introduction

**Attitude** is a Grafana visualization plugin for displaying the **roll** or **pitch** of a vessel, aircraft, ROV or
any other vehicle on a dial. It is the companion to the
[Compass panel](https://grafana.com/grafana/plugins/oceandatatools-compass-panel/) (a yaw indicator) and shares its
look: a bezel, a dial with a degree scale, a vehicle silhouette and a numeric readout.

A single panel is configured as either:

- **Roll**: the vehicle seen from behind (starboard/right side on the right).
- **Pitch**: the vehicle seen from its starboard/right side (bow/nose on the right).

Place a roll panel and a pitch panel next to a compass panel for a complete attitude display.

![Roll with ship](https://raw.githubusercontent.com/OceanDataTools/grafana-attitude-panel/main/src/screenshots/attitude-roll-with-ship.png) ![Pitch with ship](https://raw.githubusercontent.com/OceanDataTools/grafana-attitude-panel/main/src/screenshots/attitude-pitch-with-ship.png)

---

## Features

- Roll (stern view) or pitch (side view) mode in one panel.
- Smoothly animated rotation, with configurable animation duration.
- Rotate the vehicle against a fixed horizon, or keep the vehicle fixed and rotate the dial (artificial horizon style).
- Built-in vehicle silhouettes, each drawn from behind and from the side:
  - **Level Bar**: classic attitude-indicator symbol.
  - **Ship**, **Airplane**, **Helicopter**, **Underwater Drone**, **Quadcopter**, **ROV**.
  - **Custom SVG** / **Custom PNG**: load your own image.
- Degree scale labelled from the horizon (0 at the horizon, 90 at vertical).
- Optional shaded horizon.
- Optional limit angle: shades the dial beyond ± the limit and colors the readout when it is exceeded.
- Optional min/max markers showing the extremes reached over the dashboard time range.
- Signed numeric readout with configurable decimals.

---

## Getting Started

1. Install the plugin by copying it into Grafana's plugin directory or installing from the Grafana Marketplace.
2. Restart Grafana.
3. Add a new panel and select **Attitude** as the visualization.
4. Choose **Roll** or **Pitch** mode and select the field containing the angle in degrees.

---

## Sign convention

| Mode  | Positive value              | On screen                         |
| ----- | --------------------------- | --------------------------------- |
| Roll  | Starboard / right side down | Vehicle rotates clockwise         |
| Pitch | Bow / nose up               | Vehicle rotates counter-clockwise |

This matches the usual aerospace and marine (right-handed, x forward, y starboard, z down) convention. If your data
source uses the opposite sign, enable **Invert Angle**.

---

## Options

### Data Options

- **Mode**: Roll or Pitch.
- **Angle Field**: The numeric field containing the roll or pitch angle in degrees.
- **Invert Angle**: Flip the sign of the angle.

### Display Options

- **Show Scale Labels**: Degree labels (0, 30, 60, 90) around the dial.
- **Show Horizon**: Shade the lower half of the dial.
- **Show Numeric Value**: Signed readout (e.g. `+3.2°`).
- **Show Mode Label**: `ROLL` / `PITCH` caption beneath the readout.
- **Decimals**: Decimal places in the readout (default 1).
- **Show Min/Max Markers**: Markers on the bezel at the minimum and maximum angle over the time range.
- **Limit Angle (°)**: Shade the dial beyond ± this angle and color the readout when exceeded. `0` disables it.
- **Rotation Mode**: Rotate Vehicle (fixed horizon) or Rotate Dial (fixed vehicle).
- **Animation Duration (ms)**: How long rotations take to animate (default 600ms). Lower this, or set it to 0, for
  high-frequency live data.

### Vehicle Options

- **Vehicle Type**: Level Bar, Ship, Airplane, Helicopter, Underwater Drone, Quadcopter, ROV, Custom SVG, Custom PNG.
- **Custom SVG / PNG URL**: URL or data URI of your own image. Draw it as a stern view for roll and a starboard side
  view (bow to the right) for pitch, centered on the rotation point. It is fit into a square covering most of the dial.

### Colors

- **Text Color**: Labels, ticks, readout and vehicle outline.
- **Vehicle Color**: Primary vehicle color (hull, fuselage, body) and the reference pointers.
- **Vehicle Secondary Color**: Superstructure, wings, frame.
- **Dial Color** / **Bezel Color**: Dial background and outer rim.
- **Horizon Color**: Fill below the horizon.
- **Limit Color**: Limit zone and over-limit readout.

---

## Screenshots

![Roll with ship](https://raw.githubusercontent.com/OceanDataTools/grafana-attitude-panel/main/src/screenshots/attitude-roll-with-ship.png)

_Ship seen from astern for vessel roll_

![Pitch with ship](https://raw.githubusercontent.com/OceanDataTools/grafana-attitude-panel/main/src/screenshots/attitude-pitch-with-ship.png)

_Ship seen from starboard for vessel pitch_

![Roll with limit and min/max](https://raw.githubusercontent.com/OceanDataTools/grafana-attitude-panel/main/src/screenshots/attitude-with-limit-and-range.png)

_20° limit zone and min/max markers over the time range, readout over the limit_

![Roll with level bar](https://raw.githubusercontent.com/OceanDataTools/grafana-attitude-panel/main/src/screenshots/attitude-roll-with-bar.png)

_Default level bar symbol_

![Roll with airplane](https://raw.githubusercontent.com/OceanDataTools/grafana-attitude-panel/main/src/screenshots/attitude-roll-with-airplane.png)

_Airplane seen from behind_

![Pitch with airplane (rotate dial)](https://raw.githubusercontent.com/OceanDataTools/grafana-attitude-panel/main/src/screenshots/attitude-pitch-with-airplane.png)

_Airplane side view with the dial rotating instead of the vehicle_

![Pitch with helicopter](https://raw.githubusercontent.com/OceanDataTools/grafana-attitude-panel/main/src/screenshots/attitude-pitch-with-helicopter.png)

_Helicopter side view_

![Pitch with underwater drone](https://raw.githubusercontent.com/OceanDataTools/grafana-attitude-panel/main/src/screenshots/attitude-pitch-with-underwater-drone.png)

_Underwater drone (glider) side view_

![Roll with quadcopter](https://raw.githubusercontent.com/OceanDataTools/grafana-attitude-panel/main/src/screenshots/attitude-roll-with-quadcopter.png)

_Quadcopter seen from behind_

![Roll with ROV](https://raw.githubusercontent.com/OceanDataTools/grafana-attitude-panel/main/src/screenshots/attitude-roll-with-rov.png)

_ROV seen from behind_

![Pitch with ROV](https://raw.githubusercontent.com/OceanDataTools/grafana-attitude-panel/main/src/screenshots/attitude-pitch-with-rov.png)

_ROV side view_
