import { test, expect } from '@grafana/plugin-e2e';

test('should display "No data" in case panel data is empty', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '3' });
  await expect(panelEditPage.panel.locator).toContainText('No data');
});

test('should display numeric roll value when enabled', async ({ gotoPanelEditPage, readProvisionedDashboard }) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '1' });

  await expect(panelEditPage.panel.locator.getByTestId('attitude-numeric-value')).toBeVisible();
  await expect(panelEditPage.panel.locator.getByTestId('attitude-mode-label')).toHaveText('ROLL');
});

test('should display pitch mode', async ({ gotoPanelEditPage, readProvisionedDashboard }) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '2' });

  await expect(panelEditPage.panel.locator.getByTestId('attitude-mode-label')).toHaveText('PITCH');
});
