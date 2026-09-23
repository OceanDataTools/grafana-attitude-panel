# Changelog

All notable user-facing changes to this plugin are documented here, organized
by release and change type (`Added` / `Fixed` / `Changed` / `Breaking`).

**Policy:** purely internal changes with no effect on the plugin's behavior or
requirements (dependency bumps, CI/build tooling, scaffold syncs) are not
listed individually here, unless they change something a user would notice
or need to act on — e.g. a new minimum supported Grafana version.

## 1.0.0 - Unreleased

### Added

- Initial release: roll (stern view) or pitch (side view) attitude indicator,
  styled to match the Compass panel.
- Vehicle silhouettes: Level Bar, Ship, Airplane, Helicopter, Underwater Drone,
  Quadcopter, ROV, plus custom SVG/PNG images.
- Rotate-vehicle and rotate-dial modes, shaded horizon, limit angle zone,
  min/max markers over the time range, invert-angle option, configurable
  decimals and animation duration.
