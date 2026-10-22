import { test, expect } from '@playwright/test';
import { sortAlgorithms } from '../src/algorithms/sorting';
import { algorithms } from '../src/data/algorithms';

for (const id of ['merge', 'quick', 'heap'] as const) {
  test(`${id} integrates with navigation, explanations, counters, and reversible playback`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    const input = [8, 3, -1, 3, 0, 5, 2, 9];
    const frames = sortAlgorithms[id](input);
    const changed = frames.findIndex(
      (frame) => frame.operation === 'swap' || frame.operation === 'overwrite',
    );
    const before = frames[changed - 1];
    const after = frames[changed];
    // Capture settled bar positions; Motion's JS animations are not stopped by screenshot options.
    if (id === 'merge') await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/sorting/bubble');
    await page
      .getByRole('navigation', { name: 'Sorting algorithm', exact: true })
      .getByRole('link', { name: algorithms[id].name, exact: true })
      .click();
    await expect(
      page.getByRole('heading', { name: algorithms[id].name, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: 'Sorting algorithm', exact: true }).getByRole('link'),
    ).toHaveCount(6);
    await page.getByRole('button', { name: 'Custom input' }).click();
    await page.getByLabel('Your values').fill(input.join(', '));
    await page.getByRole('button', { name: 'Apply array' }).click();
    await page.getByText('Read current values').click();
    await page.getByLabel('Visualization step').fill(String(changed));
    await expect(page.getByTestId('array-values')).toHaveText(
      `[${after.items.map((item) => item.value).join(', ')}]`,
    );
    await expect(page.locator('[aria-current="step"]')).toContainText(
      algorithms[id].pseudocode[after.line].trim(),
    );
    await expect(page.getByTestId('step-explanation')).toHaveText(after.explanation);
    const counter = id === 'merge' ? 'writes' : 'swaps';
    await expect(page.getByTestId(counter)).toHaveText(
      String(id === 'merge' ? after.writes : after.swaps).padStart(2, '0'),
    );
    await expect(page.locator('[data-testid^="bar-"]')).toHaveCount(input.length);
    if (id === 'merge') {
      await expect(page.getByTestId('merge-buffer')).toHaveText(
        `[${after.buffer.map((item) => item.value).join(', ')}]`,
      );
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `docs/screenshots/merge-${testInfo.project.name}.png`,
        fullPage: true,
        animations: 'disabled',
        scale: 'css',
      });
    }
    await page.getByRole('button', { name: 'Step backward' }).click();
    await expect(page.getByTestId('array-values')).toHaveText(
      `[${before.items.map((item) => item.value).join(', ')}]`,
    );
    await expect(page.getByTestId('step-explanation')).toHaveText(before.explanation);
    await expect(page.getByTestId(counter)).toHaveText(
      String(id === 'merge' ? before.writes : before.swaps).padStart(2, '0'),
    );
    if (id === 'merge')
      await expect(page.getByTestId('merge-buffer')).toHaveText(
        `[${before.buffer.map((item) => item.value).join(', ')}]`,
      );
    await page.getByRole('button', { name: 'Step forward' }).click();
    await expect(page.getByTestId('step-explanation')).toHaveText(after.explanation);
    await page.getByLabel('Visualization step').fill(String(frames.length - 1));
    await expect(page.getByTestId('array-values')).toHaveText('[-1, 0, 2, 3, 3, 5, 8, 9]');
    await page.getByRole('button', { name: 'Reset visualization' }).click();
    await expect(page.getByTestId('array-values')).toHaveText('[8, 3, -1, 3, 0, 5, 2, 9]');
    await expect(page.getByTestId(counter)).toHaveText('00');
    if (id === 'merge') await expect(page.getByTestId('merge-buffer')).toHaveText('[]');
    await page.reload();
    await expect(
      page.getByRole('heading', { name: algorithms[id].name, exact: true }),
    ).toBeVisible();
    const widths = await page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: innerWidth,
    }));
    expect(widths.content).toBeLessThanOrEqual(widths.viewport);
    await page.goto('/');
    await expect(page.locator('.recent-list')).toContainText(algorithms[id].name);
    expect(errors).toEqual([]);
  });
}
