import { test, expect, Page } from '@playwright/test';

async function waitForAnimations(page: Page, ms = 1500) {
  await page.waitForTimeout(ms);
}

async function scrollToAirlines(page: Page) {
  await page.getByRole('button', { name: /Browse airline limits/i }).click();
  await page.waitForTimeout(2000);
}

// ------------------------------------------------------------------
// Airlines Browse section
// ------------------------------------------------------------------

test.describe('AirlinesBrowse section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await scrollToAirlines(page);
  });

  test('Airlines section renders with heading', async ({ page }) => {
    await expect(page.locator('#airlines')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'BROWSE AIRLINES' })).toBeVisible();
  });

  test('Airlines section has light background', async ({ page }) => {
    const bg = await page.locator('#airlines').evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );
    // #F2F2F2 → rgb(242, 242, 242)
    expect(bg).toContain('242');
  });

  test('Shows "Showing X airlines" count', async ({ page }) => {
    await expect(page.locator('text=/Showing \\d+ airlines?/')).toBeVisible();
  });

  test('Airline table renders rows on desktop', async ({ page }) => {
    // Desktop table
    const table = page.locator('#airlines table');
    await expect(table).toBeVisible();

    // Should have airline rows
    const rows = table.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(5);
  });

  test('Table has correct column headers', async ({ page }) => {
    const table = page.locator('#airlines table');
    await expect(table.locator('th', { hasText: 'Airline' })).toBeVisible();
    await expect(table.locator('th', { hasText: 'Max Size' })).toBeVisible();
    await expect(table.locator('th', { hasText: 'Weight' })).toBeVisible();
    await expect(table.locator('th', { hasText: 'Notes' })).toBeVisible();
    await expect(table.locator('th', { hasText: 'Action' })).toBeVisible();
  });

  test('Search airline input is available', async ({ page }) => {
    const searchInput = page.locator('#airlines input[placeholder="Search airline..."]');
    await expect(searchInput).toBeVisible();
  });

  test('Search filters airline list', async ({ page }) => {
    const searchInput = page.locator('#airlines input[placeholder="Search airline..."]');
    await searchInput.fill('Ryanair');
    await page.waitForTimeout(300);

    const rows = page.locator('#airlines table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // All visible rows should contain Ryanair
    const firstRowText = await rows.first().textContent();
    expect(firstRowText?.toLowerCase()).toContain('ryanair');
  });

  test('Policy links exist on table rows', async ({ page }) => {
    const policyLinks = page.locator('#airlines table tbody a', { hasText: 'Policy' });
    const count = await policyLinks.count();
    expect(count).toBeGreaterThan(0);

    // Check that links have href
    const firstHref = await policyLinks.first().getAttribute('href');
    expect(firstHref).toBeTruthy();
    expect(firstHref).toMatch(/^https?:\/\//);
  });
});

// ------------------------------------------------------------------
// Bag type toggle (in AirlinesBrowse)
// ------------------------------------------------------------------

test.describe('Bag type selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await scrollToAirlines(page);
  });

  test('Cabin is selected by default', async ({ page }) => {
    const cabinBtn = page.locator('#airlines button', { hasText: 'Cabin' }).first();
    const cabinClass = await cabinBtn.getAttribute('class');
    expect(cabinClass).toContain('bg-accent');
  });

  test('Clicking Underseat switches bag type', async ({ page }) => {
    const underseatBtn = page.locator('#airlines button', { hasText: 'Underseat' }).first();
    await underseatBtn.click();
    await page.waitForTimeout(300);

    const underseatClass = await underseatBtn.getAttribute('class');
    expect(underseatClass).toContain('bg-accent');

    const cabinBtn = page.locator('#airlines button', { hasText: 'Cabin' }).first();
    const cabinClass = await cabinBtn.getAttribute('class');
    expect(cabinClass).not.toContain('bg-accent');
  });

  test('Clicking Checked switches bag type', async ({ page }) => {
    const checkedBtn = page.locator('#airlines button', { hasText: 'Checked' }).first();
    await checkedBtn.click();
    await page.waitForTimeout(300);

    const checkedClass = await checkedBtn.getAttribute('class');
    expect(checkedClass).toContain('bg-accent');
  });
});

// ------------------------------------------------------------------
// Sort dropdown
// ------------------------------------------------------------------

test.describe('Sort functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await scrollToAirlines(page);
  });

  test('Sort dropdown has all options', async ({ page }) => {
    const sortSelect = page.locator('#airlines select').first();
    await expect(sortSelect).toBeVisible();

    const options = sortSelect.locator('option');
    const texts = await options.allTextContents();
    expect(texts).toContain('Largest allowance');
    expect(texts).toContain('Strictest');
    expect(texts).toContain('Alphabetical');
  });

  test('Sorting by Alphabetical reorders airlines', async ({ page }) => {
    const sortSelect = page.locator('#airlines select').first();
    await sortSelect.selectOption('alphabetical');
    await page.waitForTimeout(300);

    const rows = page.locator('#airlines table tbody tr');
    const firstAirlineName = await rows.first().locator('td').first().textContent();
    const secondAirlineName = await rows.nth(1).locator('td').first().textContent();

    // First airline should alphabetically precede the second
    if (firstAirlineName && secondAirlineName) {
      expect(firstAirlineName.localeCompare(secondAirlineName)).toBeLessThanOrEqual(0);
    }
  });

  test('"BEST" badge shows on first row when sorted by Largest', async ({ page }) => {
    const sortSelect = page.locator('#airlines select').first();
    await sortSelect.selectOption('largest');
    await page.waitForTimeout(300);

    const bestBadge = page.locator('#airlines table tbody tr').first().locator('text=BEST');
    await expect(bestBadge).toBeVisible();
  });
});

// ------------------------------------------------------------------
// Region filter
// ------------------------------------------------------------------

test.describe('Region filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await scrollToAirlines(page);
  });

  test('Region dropdown has all regions', async ({ page }) => {
    const regionSelect = page.locator('#airlines select').last();
    const options = regionSelect.locator('option');
    const texts = await options.allTextContents();
    expect(texts).toContain('All Regions');
    expect(texts).toContain('Europe');
    expect(texts).toContain('Asia Pacific');
    expect(texts).toContain('Americas');
    expect(texts).toContain('Middle East');
  });

  test('Filtering by Europe reduces airline count', async ({ page }) => {
    const countBefore = page.locator('text=/Showing \\d+ airlines?/');
    const textBefore = await countBefore.textContent();
    const numBefore = parseInt(textBefore?.match(/\d+/)?.[0] || '0');

    const regionSelect = page.locator('#airlines select').last();
    await regionSelect.selectOption('europe');
    await page.waitForTimeout(300);

    const countAfter = page.locator('text=/Showing \\d+ airlines?/');
    const textAfter = await countAfter.textContent();
    const numAfter = parseInt(textAfter?.match(/\d+/)?.[0] || '0');

    // Filtered count should be less than or equal
    expect(numAfter).toBeLessThanOrEqual(numBefore);
    expect(numAfter).toBeGreaterThan(0);
  });
});

// ------------------------------------------------------------------
// CheckYourBagPanel
// ------------------------------------------------------------------

test.describe('Check Your Bag Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    // Use "Start checking" to open the panel
    await page.getByRole('button', { name: 'Start checking' }).click();
    await page.waitForTimeout(1500);
    // Navigate to Airlines section where the panel lives
    await page.getByRole('button', { name: /Next: browse airlines/i }).click();
    await page.waitForTimeout(2000);
  });

  test('Panel trigger shows "Check your bag" text', async ({ page }) => {
    await expect(page.locator('text=Check your bag')).toBeVisible();
  });

  test('Panel is open (from Start checking flow)', async ({ page }) => {
    // Dimension fields should be visible since panel was opened
    await expect(page.locator('input[placeholder="55"]')).toBeVisible();
  });

  test('Dimension inputs accept values', async ({ page }) => {
    const lengthInput = page.locator('input[placeholder="55"]');
    const widthInput = page.locator('input[placeholder="40"]');
    const heightInput = page.locator('input[placeholder="20"]');

    await lengthInput.fill('50');
    await widthInput.fill('35');
    await heightInput.fill('25');

    await expect(lengthInput).toHaveValue('50');
    await expect(widthInput).toHaveValue('35');
    await expect(heightInput).toHaveValue('25');
  });

  test('"Check fit" button runs fit check and shows results', async ({ page }) => {
    // Fill dimensions
    await page.locator('input[placeholder="55"]').fill('50');
    await page.locator('input[placeholder="40"]').fill('35');
    await page.locator('input[placeholder="20"]').fill('20');

    // Click Check fit
    await page.getByRole('button', { name: /Check fit/i }).click();
    await page.waitForTimeout(500);

    // Fit filter chips should appear
    await expect(page.locator('text=/Fits \\(\\d+\\)/')).toBeVisible();
  });

  test('Fit filter chips work after checking', async ({ page }) => {
    // Fill dimensions
    await page.locator('input[placeholder="55"]').fill('50');
    await page.locator('input[placeholder="40"]').fill('35');
    await page.locator('input[placeholder="20"]').fill('20');

    await page.getByRole('button', { name: /Check fit/i }).click();
    await page.waitForTimeout(500);

    // Click "Fits" filter
    const fitsChip = page.locator('button', { hasText: /^Fits \(\d+\)$/ });
    await fitsChip.click();
    await page.waitForTimeout(300);

    // The fits chip should now be active (green accent background)
    const fitsClass = await fitsChip.getAttribute('class');
    expect(fitsClass).toContain('bg-accent');
  });

  test('Collapsing panel hides dimension inputs', async ({ page }) => {
    // Click the trigger to close
    await page.locator('button', { hasText: 'Check your bag' }).click();
    await page.waitForTimeout(500);

    // Dimension inputs should not be visible
    await expect(page.locator('input[placeholder="55"]')).not.toBeVisible();
  });
});

// ------------------------------------------------------------------
// Airline Detail Sheet
// ------------------------------------------------------------------

test.describe('Airline Detail Sheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await scrollToAirlines(page);
  });

  test('Clicking airline name opens detail sheet', async ({ page }) => {
    // Click first airline in the table
    const firstAirlineName = page.locator('#airlines table tbody tr').first().locator('td').first();
    await firstAirlineName.click();
    await page.waitForTimeout(500);

    // Sheet overlay should appear — look for the Sheet content
    const sheetContent = page.locator('[role="dialog"]');
    await expect(sheetContent).toBeVisible();
  });

  test('Detail sheet shows airline name', async ({ page }) => {
    const firstRow = page.locator('#airlines table tbody tr').first();
    const airlineName = await firstRow.locator('td').first().locator('p.font-medium').textContent();

    await firstRow.locator('td').first().click();
    await page.waitForTimeout(500);

    // The sheet should contain the airline name
    const sheet = page.locator('[role="dialog"]');
    await expect(sheet).toContainText(airlineName || '');
  });

  test('Detail sheet can be closed', async ({ page }) => {
    // Open sheet
    await page.locator('#airlines table tbody tr').first().locator('td').first().click();
    await page.waitForTimeout(500);

    const sheet = page.locator('[role="dialog"]');
    await expect(sheet).toBeVisible();

    // Close via the X button
    const closeBtn = sheet.locator('button[class*="absolute"]').first();
    await closeBtn.click();
    await page.waitForTimeout(500);

    await expect(sheet).not.toBeVisible();
  });
});

// ------------------------------------------------------------------
// Overall visual structure
// ------------------------------------------------------------------

test.describe('Overall page structure', () => {
  test('All four sections exist in the DOM', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    await expect(page.locator('#hero')).toBeAttached();
    await expect(page.locator('#bag-type')).toBeAttached();
    await expect(page.locator('#airlines')).toBeAttached();
    await expect(page.locator('footer')).toBeAttached();
  });

  test('Header nav is always visible across sections', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    // Visible on Hero
    await expect(page.locator('header')).toBeVisible();

    // Scroll to airlines
    await page.getByRole('button', { name: /Browse airline limits/i }).click();
    await page.waitForTimeout(2000);

    // Still visible
    await expect(page.locator('header')).toBeVisible();

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(500);

    await expect(page.locator('header')).toBeVisible();
  });

  test('DotGridBackground is rendered', async ({ page }) => {
    await page.goto('/');
    // The dark sections should have the dot grid background
    const bg = page.locator('.relative.min-h-screen');
    await expect(bg).toBeAttached();
  });
});

// ------------------------------------------------------------------
// Visual screenshot tests
// ------------------------------------------------------------------

test.describe('Visual snapshots', () => {
  test('Hero section screenshot', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page, 2000);
    await expect(page).toHaveScreenshot('hero-section.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Airlines section screenshot', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await page.getByRole('button', { name: /Browse airline limits/i }).click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('airlines-section.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.05,
    });
  });
});
