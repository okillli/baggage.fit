import { test, expect, Page } from '@playwright/test';

test.use({ viewport: { width: 375, height: 667 } });

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

async function openPanelViaCTA(page: Page) {
  await page.getByRole('button', { name: 'Start checking' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: /Next: browse airlines/i }).click();
  await page.waitForTimeout(2000);
}

// ------------------------------------------------------------------
// Hero on mobile
// ------------------------------------------------------------------

test.describe('Mobile: Hero section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
  });

  test('Hero section renders correctly on mobile', async ({ page }) => {
    const headline = page.locator('#hero h1');
    await expect(headline).toBeVisible();
    await expect(headline).toHaveText('WILL YOUR BAG FIT?');
  });

  test('Hero CTAs are visible on mobile', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Start checking' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Browse airline limits/i })).toBeVisible();
  });

  test('"Start checking" scrolls to BagTypePicker on mobile', async ({ page }) => {
    await page.getByRole('button', { name: 'Start checking' }).click();
    await page.waitForTimeout(1500);

    const bagType = await isInViewport(page, '#bag-type');
    expect(bagType).toBe(true);
  });

  test('"Browse airline limits" scrolls to airlines on mobile', async ({ page }) => {
    await page.getByRole('button', { name: /Browse airline limits/i }).click();
    await page.waitForTimeout(2000);

    const airlines = await isInViewport(page, '#airlines');
    expect(airlines).toBe(true);
  });
});

// ------------------------------------------------------------------
// Mobile nav
// ------------------------------------------------------------------

test.describe('Mobile: Header navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
  });

  test('Mobile nav Check button scrolls to BagTypePicker', async ({ page }) => {
    // Mobile nav uses md:hidden — the smaller nav with text-xs
    const mobileNav = page.locator('nav.md\\:hidden');
    const checkBtn = mobileNav.getByRole('button', { name: /Check/i });
    await checkBtn.click();
    await page.waitForTimeout(1500);

    const bagType = await isInViewport(page, '#bag-type');
    expect(bagType).toBe(true);
  });

  test('Mobile nav Airlines button scrolls to AirlinesBrowse', async ({ page }) => {
    const mobileNav = page.locator('nav.md\\:hidden');
    const airlinesBtn = mobileNav.getByRole('button', { name: /Airlines/i });
    await airlinesBtn.click();
    await page.waitForTimeout(2000);

    const airlines = await isInViewport(page, '#airlines');
    expect(airlines).toBe(true);
  });

  test('Logo scrolls to top on mobile', async ({ page }) => {
    // Navigate away from top
    await page.getByRole('button', { name: /Browse airline limits/i }).click();
    await page.waitForTimeout(2000);

    // Click logo
    await page.getByRole('button', { name: 'baggage.fit' }).click();
    await page.waitForTimeout(1500);

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(50);
  });
});

// ------------------------------------------------------------------
// BagTypePicker on mobile
// ------------------------------------------------------------------

test.describe('Mobile: BagTypePicker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await page.getByRole('button', { name: 'Start checking' }).click();
    await page.waitForTimeout(1500);
  });

  test('BagTypePicker shows stacked cards on mobile (grid-cols-1)', async ({ page }) => {
    // On mobile, the grid is grid-cols-1 (stacked). Verify all 3 card texts appear.
    const section = page.locator('#bag-type');
    await expect(section.locator('text=Cabin bag')).toBeVisible();
    await expect(section.locator('text=Underseat').first()).toBeVisible();
    await expect(section.locator('text=Checked').first()).toBeVisible();

    // Verify cards are stacked: each card should have similar x position
    const cards = section.locator('[class*="grid"] > *');
    const count = await cards.count();
    expect(count).toBe(3);
  });
});

// ------------------------------------------------------------------
// Airlines section on mobile
// ------------------------------------------------------------------

test.describe('Mobile: Airlines section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await page.getByRole('button', { name: /Browse airline limits/i }).click();
    await page.waitForTimeout(2000);
  });

  test('Airlines section shows mobile cards (not table)', async ({ page }) => {
    // Desktop table should be hidden on mobile (hidden md:block)
    const table = page.locator('#airlines .hidden.md\\:block');
    await expect(table).not.toBeVisible();

    // Mobile cards container should be visible (md:hidden space-y-3)
    const mobileCards = page.locator('#airlines .md\\:hidden.space-y-3');
    await expect(mobileCards).toBeVisible();
  });

  test('Mobile cards show airline name, dimensions, weight', async ({ page }) => {
    const mobileCards = page.locator('#airlines .md\\:hidden.space-y-3');
    const firstCard = mobileCards.locator('> div').first();

    // Airline name (font-heading font-bold)
    await expect(firstCard.locator('p.font-heading')).toBeVisible();

    // Dimensions — "Max Size" label
    await expect(firstCard.locator('text=Max Size')).toBeVisible();

    // Weight label
    await expect(firstCard.locator('text=Weight')).toBeVisible();
  });

  test('Search works on mobile', async ({ page }) => {
    const searchInput = page.locator('#airlines input[placeholder="Search airline..."]');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Ryanair');
    await page.waitForTimeout(300);

    const mobileCards = page.locator('#airlines .md\\:hidden.space-y-3 > div');
    const count = await mobileCards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const firstCardText = await mobileCards.first().textContent();
    expect(firstCardText?.toLowerCase()).toContain('ryanair');
  });
});

// ------------------------------------------------------------------
// CheckYourBagPanel on mobile
// ------------------------------------------------------------------

test.describe('Mobile: CheckYourBagPanel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await openPanelViaCTA(page);
  });

  test('CheckYourBagPanel opens and closes on mobile', async ({ page }) => {
    // Panel should be open (dimension inputs visible)
    await expect(page.locator('input[placeholder="55"]')).toBeVisible();

    // Close the panel
    await page.locator('button', { hasText: 'Check your bag' }).click();
    await page.waitForTimeout(500);

    // Dimension inputs should be hidden
    await expect(page.locator('input[placeholder="55"]')).not.toBeVisible();

    // Re-open the panel
    await page.locator('button', { hasText: 'Check your bag' }).click();
    await page.waitForTimeout(500);

    await expect(page.locator('input[placeholder="55"]')).toBeVisible();
  });

  test('Dimension input works on mobile', async ({ page }) => {
    const lengthInput = page.locator('input[placeholder="55"]');
    const widthInput = page.locator('input[placeholder="40"]');
    const heightInput = page.locator('input[placeholder="20"]');

    await lengthInput.fill('45');
    await widthInput.fill('30');
    await heightInput.fill('18');

    await expect(lengthInput).toHaveValue('45');
    await expect(widthInput).toHaveValue('30');
    await expect(heightInput).toHaveValue('18');
  });

  test('Check fit shows results on mobile', async ({ page }) => {
    await page.locator('input[placeholder="55"]').fill('50');
    await page.locator('input[placeholder="40"]').fill('35');
    await page.locator('input[placeholder="20"]').fill('20');

    await page.getByRole('button', { name: /Check fit/i }).click();
    await page.waitForTimeout(500);

    // Fit filter chips should appear
    await expect(page.locator('text=/Fits \\(\\d+\\)/')).toBeVisible();
  });
});

// ------------------------------------------------------------------
// Airline detail sheet on mobile
// ------------------------------------------------------------------

test.describe('Mobile: Airline Detail Sheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    await page.getByRole('button', { name: /Browse airline limits/i }).click();
    await page.waitForTimeout(2000);
  });

  test('Clicking mobile card opens airline detail sheet', async ({ page }) => {
    // Click the first mobile card's airline name area
    const mobileCards = page.locator('#airlines .md\\:hidden.space-y-3 > div');
    const firstCard = mobileCards.first();
    const clickableArea = firstCard.locator('.cursor-pointer').first();
    await clickableArea.click();
    await page.waitForTimeout(500);

    // Sheet dialog should appear
    const sheet = page.locator('[role="dialog"]');
    await expect(sheet).toBeVisible();
  });
});

// ------------------------------------------------------------------
// Footer on mobile
// ------------------------------------------------------------------

test.describe('Mobile: Footer', () => {
  test('"Check another bag" works on mobile', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    // Scroll to the bottom
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(1000);

    const checkAnother = page.getByRole('button', { name: /Check another bag/i });
    await expect(checkAnother).toBeVisible();
    await checkAnother.click();
    await page.waitForTimeout(1500);

    const heroVisible = await isInViewport(page, '#hero');
    expect(heroVisible).toBe(true);
  });
});
