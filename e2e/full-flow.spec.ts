import { test, expect, Page } from '@playwright/test';

async function waitForAnimations(page: Page, ms = 1500) {
  await page.waitForTimeout(ms);
}

async function isInViewport(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }, selector);
}

/**
 * Navigate from Hero through BagTypePicker to Airlines with panel open.
 * This is the standard path: "Start checking" -> pick bag type -> "Next: browse airlines"
 */
async function navigateToAirlinesWithPanel(page: Page) {
  await page.getByRole('button', { name: 'Start checking' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: /Next: browse airlines/i }).click();
  await page.waitForTimeout(2000);
}

/**
 * Fill dimension inputs in the open CheckYourBagPanel.
 */
async function fillDimensions(page: Page, l: string, w: string, h: string) {
  await page.locator('input[placeholder="55"]').fill(l);
  await page.locator('input[placeholder="40"]').fill(w);
  await page.locator('input[placeholder="20"]').fill(h);
}

/**
 * Click "Check fit" button and wait for results.
 */
async function clickCheckFit(page: Page) {
  await page.getByRole('button', { name: /Check fit/i }).click();
  await page.waitForTimeout(500);
}

// ------------------------------------------------------------------
// Complete end-to-end flow
// ------------------------------------------------------------------

test.describe('Complete user flow', () => {
  test('Hero -> Start checking -> Underseat -> dims -> weight -> Check fit -> filter -> detail -> close', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    // 1. Click "Start checking" on Hero
    await page.getByRole('button', { name: 'Start checking' }).click();
    await page.waitForTimeout(1500);

    // 2. Should be at BagTypePicker
    const bagTypeVisible = await isInViewport(page, '#bag-type');
    expect(bagTypeVisible).toBe(true);

    // 3. Pick "Underseat" bag type
    const section = page.locator('#bag-type');
    await section.locator('text=Underseat').first().click();
    await page.waitForTimeout(300);

    // 4. Click "Next: browse airlines"
    await page.getByRole('button', { name: /Next: browse airlines/i }).click();
    await page.waitForTimeout(2000);

    // 5. Should be at Airlines section with panel open
    const airlinesVisible = await isInViewport(page, '#airlines');
    expect(airlinesVisible).toBe(true);
    await expect(page.locator('input[placeholder="55"]')).toBeVisible();

    // 6. Enter dimensions 30x25x15
    await fillDimensions(page, '30', '25', '15');

    // 7. Enter weight 5kg
    const weightInput = page.locator('input[placeholder="10"]');
    await weightInput.fill('5');

    // 8. Click "Check fit"
    await clickCheckFit(page);

    // 9. Verify fit results appeared
    await expect(page.locator('text=/Fits \\(\\d+\\)/')).toBeVisible();

    // 10. Click "Fits" filter chip
    const fitsChip = page.locator('button', { hasText: /^Fits \(\d+\)$/ });
    await fitsChip.click();
    await page.waitForTimeout(300);

    // Verify Fits chip is active
    const fitsClass = await fitsChip.getAttribute('class');
    expect(fitsClass).toContain('bg-accent');

    // 11. Open airline detail sheet (click first airline in table)
    const firstAirlineName = page.locator('#airlines table tbody tr').first().locator('td').first();
    await firstAirlineName.click();
    await page.waitForTimeout(500);

    const sheet = page.locator('[role="dialog"]');
    await expect(sheet).toBeVisible();

    // 12. Close detail sheet
    const closeBtn = sheet.locator('button[class*="absolute"]').first();
    await closeBtn.click();
    await page.waitForTimeout(500);

    await expect(sheet).not.toBeVisible();
  });
});

// ------------------------------------------------------------------
// Weight input
// ------------------------------------------------------------------

test.describe('Weight input behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await navigateToAirlinesWithPanel(page);
  });

  test('Enter weight in kg, switch to lb, verify placeholder changes', async ({ page }) => {
    // Default is kg, placeholder should be "10"
    const weightInput = page.locator('input[placeholder="10"]');
    await expect(weightInput).toBeVisible();

    // Enter weight
    await weightInput.fill('5');
    await expect(weightInput).toHaveValue('5');

    // The weight label should contain "(optional)"
    await expect(page.locator('label', { hasText: 'Weight (optional)' })).toBeVisible();

    // Switch to lb by clicking the "lb" toggle button
    const lbButton = page.locator('button', { hasText: 'lb' }).first();
    await lbButton.click();
    await page.waitForTimeout(300);

    // After switching, placeholder changes to "22"
    const weightInputLb = page.locator('input[placeholder="22"]');
    await expect(weightInputLb).toBeVisible();

    // Enter 15lb
    await weightInputLb.fill('15');
    await expect(weightInputLb).toHaveValue('15');
  });
});

// ------------------------------------------------------------------
// Unit toggles
// ------------------------------------------------------------------

test.describe('Unit toggle behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await navigateToAirlinesWithPanel(page);
  });

  test('Toggle dimension unit from cm to in', async ({ page }) => {
    // Locate the DimensionInput container (has the "Dimensions" label)
    const dimSection = page.locator('.space-y-4', { has: page.locator('text=Dimensions') });

    // Default: the "cm" button should be active (bg-accent text)
    const cmButton = dimSection.locator('button', { hasText: /^cm$/ });
    await expect(cmButton).toBeVisible();

    // Click the "in" toggle button within the dimension section
    const inButton = dimSection.locator('button', { hasText: /^in$/ });
    await inButton.click();
    await page.waitForTimeout(300);

    // After toggle, verify the "in" button is active (has text-background = active style)
    const inClass = await inButton.getAttribute('class');
    expect(inClass).toContain('text-background');

    // The "cm" button should now be inactive
    const cmClass = await cmButton.getAttribute('class');
    expect(cmClass).toContain('text-muted-foreground');
  });

  test('Toggle weight unit from kg to lb', async ({ page }) => {
    // Default is kg
    await expect(page.locator('input[placeholder="10"]')).toBeVisible();

    // Click "lb" toggle
    const lbButton = page.locator('button', { hasText: 'lb' }).first();
    await lbButton.click();
    await page.waitForTimeout(300);

    // Now placeholder should be "22"
    await expect(page.locator('input[placeholder="22"]')).toBeVisible();
  });
});

// ------------------------------------------------------------------
// Bag type switch changes table data
// ------------------------------------------------------------------

test.describe('Bag type switching in Airlines section', () => {
  test('Selecting Checked changes table data', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await page.getByRole('button', { name: /Browse airline limits/i }).click();
    await page.waitForTimeout(2000);

    // Get first airline's dimension text for cabin (default)
    const firstRowDims = page.locator('#airlines table tbody tr').first().locator('td').nth(1);
    const cabinDims = await firstRowDims.textContent();

    // Switch to "Checked" bag type
    const checkedBtn = page.locator('#airlines button', { hasText: 'Checked' }).first();
    await checkedBtn.click();
    await page.waitForTimeout(300);

    // Get dimension text after switch — should be different (checked bags are usually bigger)
    const checkedDims = await firstRowDims.textContent();

    // The dimension text should change (cabin vs checked have different limits)
    // Note: This may fail if the first airline has same dims for both, but very unlikely
    expect(checkedDims).not.toBe(cabinDims);
  });
});

// ------------------------------------------------------------------
// Fit with oversized bag
// ------------------------------------------------------------------

test.describe('Fit check with oversized bag', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await navigateToAirlinesWithPanel(page);
  });

  test('Oversized bag shows "Doesn\'t fit" chips', async ({ page }) => {
    // Enter very large dimensions that won't fit most airlines
    await fillDimensions(page, '70', '50', '30');
    await clickCheckFit(page);

    // Should show "Doesn't fit" filter chip with count > 0
    await expect(page.locator('text=/Doesn.t fit \\(\\d+\\)/')).toBeVisible();

    // The count should be non-zero
    const doesntFitChip = page.locator('button', { hasText: /Doesn.t fit \(\d+\)/ });
    const chipText = await doesntFitChip.textContent();
    const count = parseInt(chipText?.match(/\d+/)?.[0] || '0');
    expect(count).toBeGreaterThan(0);
  });
});

// ------------------------------------------------------------------
// Fit with small bag
// ------------------------------------------------------------------

test.describe('Fit check with small bag', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await navigateToAirlinesWithPanel(page);
  });

  test('Small bag shows "Fits" chips with high count', async ({ page }) => {
    // Enter very small dimensions that should fit all airlines
    await fillDimensions(page, '30', '20', '15');
    await clickCheckFit(page);

    // Should show "Fits" filter chip with a high count
    const fitsChip = page.locator('button', { hasText: /^Fits \(\d+\)$/ });
    await expect(fitsChip).toBeVisible();

    const chipText = await fitsChip.textContent();
    const fitsCount = parseInt(chipText?.match(/\d+/)?.[0] || '0');
    expect(fitsCount).toBeGreaterThan(10);
  });
});

// ------------------------------------------------------------------
// Weight affects fit
// ------------------------------------------------------------------

test.describe('Weight affects fit outcome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await navigateToAirlinesWithPanel(page);
  });

  test('Heavy weight causes doesnt-fit despite fitting dimensions', async ({ page }) => {
    // Enter small dimensions (should fit dimensionally)
    await fillDimensions(page, '40', '30', '15');

    // Enter very heavy weight (25kg exceeds most cabin limits)
    const weightInput = page.locator('input[placeholder="10"]');
    await weightInput.fill('25');

    await clickCheckFit(page);

    // Some airlines should now not fit due to weight
    await expect(page.locator('text=/Doesn.t fit \\(\\d+\\)/')).toBeVisible();

    const doesntFitChip = page.locator('button', { hasText: /Doesn.t fit \(\d+\)/ });
    const chipText = await doesntFitChip.textContent();
    const doesntFitCount = parseInt(chipText?.match(/\d+/)?.[0] || '0');
    expect(doesntFitCount).toBeGreaterThan(0);
  });
});

// ------------------------------------------------------------------
// Search then check fit
// ------------------------------------------------------------------

test.describe('Search then check fit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await navigateToAirlinesWithPanel(page);
  });

  test('Search filters airlines, then check fit works with filter chips', async ({ page }) => {
    // Search for a specific airline
    const searchInput = page.locator('#airlines input[placeholder="Search airline..."]');
    await searchInput.fill('Ryanair');
    await page.waitForTimeout(300);

    // Verify filtered results
    const rows = page.locator('#airlines table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Now fill dimensions and check fit
    await fillDimensions(page, '50', '35', '20');
    await clickCheckFit(page);

    // Fit filter chips should appear
    await expect(page.locator('text=/Fits \\(\\d+\\)/')).toBeVisible();

    // Clear search to see all airlines with fit results
    await searchInput.clear();
    await page.waitForTimeout(300);

    // Filter chips should still be there
    await expect(page.locator('text=/Fits \\(\\d+\\)/')).toBeVisible();
  });
});

// ------------------------------------------------------------------
// Panel collapse preserves results
// ------------------------------------------------------------------

test.describe('Panel collapse preserves results', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await navigateToAirlinesWithPanel(page);
  });

  test('Collapsing panel keeps fit filter chips visible', async ({ page }) => {
    // Fill dimensions and check fit
    await fillDimensions(page, '50', '35', '20');
    await clickCheckFit(page);

    // Verify fit chips exist
    await expect(page.locator('text=/Fits \\(\\d+\\)/')).toBeVisible();

    // Collapse the panel
    await page.locator('button', { hasText: 'Check your bag' }).click();
    await page.waitForTimeout(500);

    // Dimension inputs should be hidden
    await expect(page.locator('input[placeholder="55"]')).not.toBeVisible();

    // But fit filter chips should still be visible
    await expect(page.locator('text=/Fits \\(\\d+\\)/')).toBeVisible();
    await expect(page.locator('text=/Doesn.t fit \\(\\d+\\)/')).toBeVisible();
  });
});
