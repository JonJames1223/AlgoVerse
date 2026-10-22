import { test, expect } from '@playwright/test';

test('dashboard, search, honest roadmap, and responsive layouts', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Build your intuition.' })).toBeVisible();
  await expect(page.getByText('Your next discovery starts here.')).toBeVisible();
  await expect(page.locator('.algorithm-card')).toHaveCount(6);
  await page.screenshot({
    path: `docs/screenshots/dashboard-${testInfo.project.name}.png`,
    fullPage: true,
    animations: 'disabled',
  });
  const width = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  expect(width.scroll).toBeLessThanOrEqual(width.viewport);
  await page.locator('.search-trigger').click();
  await page.getByRole('searchbox', { name: 'Search algorithms' }).fill('merge');
  await page.locator('.search-result').click();
  await expect(page.getByRole('heading', { name: 'Merge Sort', exact: true })).toBeVisible();
  await page.goto('/roadmap/pathfinding');
  await expect(page.getByText('Planned for Phase 03')).toBeVisible();
  await page.getByRole('link', { name: 'Explore the sorting lab' }).click();
  await expect(page.getByRole('heading', { name: 'Bubble Sort', exact: true })).toBeVisible();
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByRole('link', { name: 'Dashboard', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Build your intuition.' })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('exact stepping, backward restoration, scrubbing, and input validation', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/sorting/bubble');
  await page.getByRole('button', { name: 'Custom input' }).click();
  await page.getByLabel('Your values').fill('3, -1, 2, 2');
  await page.getByRole('button', { name: 'Apply array' }).click();
  await page.getByRole('button', { name: 'Step forward' }).click();
  const explanation = await page.getByTestId('step-explanation').innerText();
  await expect(page.getByTestId('comparisons')).toHaveText('01');
  await expect(page.locator('[aria-current="step"]')).toContainText('if a[j] > a[j + 1]');
  await page.getByRole('button', { name: 'Step forward' }).click();
  await expect(page.getByTestId('swaps')).toHaveText('01');
  await page.getByRole('button', { name: 'Step backward' }).click();
  await expect(page.getByTestId('swaps')).toHaveText('00');
  await expect(page.getByTestId('step-explanation')).toHaveText(explanation);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `docs/screenshots/lab-${testInfo.project.name}.png`,
    fullPage: true,
    animations: 'disabled',
  });
  await page
    .getByLabel('Visualization step')
    .fill((await page.getByLabel('Visualization step').getAttribute('max')) ?? '0');
  await page.getByText('Read current values').click();
  await expect(page.getByTestId('array-values')).toHaveText('[-1, 2, 2, 3]');
  await expect(page.getByRole('button', { name: 'Replay', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reset visualization' }).click();
  await expect(page.getByTestId('array-values')).toHaveText('[3, -1, 2, 2]');
  await expect(page.getByTestId('comparisons')).toHaveText('00');
  await page.getByLabel('Your values').fill('1, nope, 2');
  await page.getByRole('button', { name: 'Apply array' }).click();
  await expect(page.getByRole('alert')).toContainText('Use numbers');
  const width = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  expect(width.scroll).toBeLessThanOrEqual(width.viewport);
});

test('play, pause, resume, dataset replacement, persistence, and other algorithms', async ({
  page,
}) => {
  await page.goto('/sorting/bubble');
  await page.getByLabel('Playback speed').fill('4');
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(page.getByTestId('step-index')).not.toHaveText('0');
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const index = await page.getByTestId('step-index').innerText();
  await page.waitForTimeout(500);
  await expect(page.getByTestId('step-index')).toHaveText(index);
  await page.getByRole('button', { name: 'Resume', exact: true }).click();
  await expect(page.getByTestId('step-index')).not.toHaveText(index);
  await page.getByRole('button', { name: 'New array' }).click();
  await expect(page.getByTestId('step-index')).toHaveText('0');
  await page.waitForTimeout(300);
  await expect(page.getByTestId('step-index')).toHaveText('0');
  await page.getByRole('button', { name: 'Advanced', exact: true }).click();
  await page.reload();
  await expect(page.getByLabel('Playback speed')).toHaveValue('4');
  await expect(page.getByRole('button', { name: 'Advanced', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  for (const id of ['selection', 'insertion']) {
    await page.goto(`/sorting/${id}`);
    await page.getByRole('button', { name: 'Custom input' }).click();
    await page.getByLabel('Your values').fill('2, -3, 2, 0');
    await page.getByRole('button', { name: 'Apply array' }).click();
    await page
      .getByLabel('Visualization step')
      .fill((await page.getByLabel('Visualization step').getAttribute('max')) ?? '0');
    await page.getByText('Read current values').click();
    await expect(page.getByTestId('array-values')).toHaveText('[-3, 0, 2, 2]');
  }
  await page.goto('/');
  await expect(page.locator('.recent-list a')).toHaveCount(3);
});

test('invalid routes recover and corrupted preferences do not crash', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('algoverse:preferences', '{broken');
    localStorage.setItem('algoverse:recent', '["unknown"]');
  });
  await page.goto('/sorting/insertion');
  await expect(page.getByLabel('Playback speed')).toHaveValue('1');
  await page.goto('/sorting/unknown');
  await expect(page.getByRole('heading', { name: 'Let’s find your way back.' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to dashboard', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Build your intuition.' })).toBeVisible();
});
