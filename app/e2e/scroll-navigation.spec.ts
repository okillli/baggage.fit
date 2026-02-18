import { test, expect, Page } from '@playwright/test';

// Helpers

/** Wait for GSAP entrance animations to settle */
async function waitForAnimations(page: Page, ms = 1500) {
  await page.waitForTimeout(ms);
}

/** Scroll to a normalized position (0–1) of the page height */
async function scrollToNormalized(page: Page, fraction: number) {
  await page.evaluate((f) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, maxScroll * f);
  }, fraction);
  await page.waitForTimeout(600);
}

/** Get the vertical center of an element in the viewport */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getElementViewportCenter(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, centerY: rect.top + rect.height / 2 };
  }, selector);
}

/** Check if element is roughly in the viewport */
async function isInViewport(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }, selector);
}

// ------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------

test.describe('Page load and Hero section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/baggage/i);
  });

  test('Hero section is visible on load', async ({ page }) => {
    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();
  });

  test('Hero headline is visible after entrance animation', async ({ page }) => {
    const headline = page.locator('#hero h1');
    await expect(headline).toBeVisible();
    await expect(headline).toHaveText('WILL YOUR BAG FIT?');
  });

  test('Hero subtitle is visible', async ({ page }) => {
    const sub = page.locator('#hero p').first();
    await expect(sub).toContainText('Check cabin, underseat, and checked limits');
  });

  test('Hero CTAs are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Start checking' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Browse airline limits/i })).toBeVisible();
  });

  test('Scroll indicator is visible on Hero', async ({ page }) => {
    await expect(page.locator('text=Scroll to begin')).toBeVisible();
  });
});

test.describe('Hero CTA navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
  });

  test('"Start checking" scrolls to BagTypePicker section', async ({ page }) => {
    await page.getByRole('button', { name: 'Start checking' }).click();
    // Wait for GSAP scroll animation
    await page.waitForTimeout(1500);

    const bagType = await isInViewport(page, '#bag-type');
    expect(bagType).toBe(true);
  });

  test('"Browse airline limits" scrolls to Airlines section', async ({ page }) => {
    await page.getByRole('button', { name: /Browse airline limits/i }).click();
    await page.waitForTimeout(2000);

    const airlines = await isInViewport(page, '#airlines');
    expect(airlines).toBe(true);
  });
});

test.describe('Header navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
  });

  test('Header is visible', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
  });

  test('Logo text is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'baggage.fit' })).toBeVisible();
  });

  test('"Check" nav scrolls to BagTypePicker', async ({ page }) => {
    const checkBtn = page.locator('header').getByRole('button', { name: /Check/i }).first();
    await checkBtn.click();
    await page.waitForTimeout(1500);

    const bagType = await isInViewport(page, '#bag-type');
    expect(bagType).toBe(true);
  });

  test('"Airlines" nav scrolls to AirlinesBrowse', async ({ page }) => {
    const airlinesBtn = page.locator('header').getByRole('button', { name: /Airlines/i }).first();
    await airlinesBtn.click();
    await page.waitForTimeout(2000);

    const airlines = await isInViewport(page, '#airlines');
    expect(airlines).toBe(true);
  });

  test('Logo click scrolls back to top from Airlines', async ({ page }) => {
    // First scroll to airlines
    const airlinesBtn = page.locator('header').getByRole('button', { name: /Airlines/i }).first();
    await airlinesBtn.click();
    await page.waitForTimeout(2000);

    // Now click logo
    await page.getByRole('button', { name: 'baggage.fit' }).click();
    await page.waitForTimeout(1500);

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(50);
  });

  test('Header gets background on scroll', async ({ page }) => {
    // Initially transparent
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const headerInitial = await page.locator('header').evaluate((el) =>
      getComputedStyle(el).backdropFilter
    );

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(300);

    // Should now have backdrop blur
    const headerClass = await page.locator('header').getAttribute('class');
    expect(headerClass).toContain('backdrop-blur');
  });
});

test.describe('BagTypePicker section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);
    // Scroll to BagTypePicker
    await page.getByRole('button', { name: 'Start checking' }).click();
    await page.waitForTimeout(1500);
  });

  test('BagTypePicker section is visible after scroll', async ({ page }) => {
    await expect(page.locator('#bag-type')).toBeVisible();
  });

  test('Shows STEP 1 / BAG TYPE label', async ({ page }) => {
    await expect(page.locator('text=STEP 1 / BAG TYPE')).toBeVisible();
  });

  test('Shows "WHAT ARE YOU CARRYING?" heading', async ({ page }) => {
    await expect(page.locator('text=WHAT ARE YOU CARRYING?')).toBeVisible();
  });

  test('Three bag type cards are rendered', async ({ page }) => {
    const section = page.locator('#bag-type');
    await expect(section.locator('text=Cabin bag')).toBeVisible();
    await expect(section.locator('text=Underseat').first()).toBeVisible();
    await expect(section.locator('text=Checked').first()).toBeVisible();
  });

  test('"Next: browse airlines" button scrolls to Airlines', async ({ page }) => {
    await page.getByRole('button', { name: /Next: browse airlines/i }).click();
    await page.waitForTimeout(2000);

    const airlines = await isInViewport(page, '#airlines');
    expect(airlines).toBe(true);
  });
});

test.describe('Scroll animation behavior', () => {
  test('Hero exit animation hides content when scrolling past', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    // Scroll well past the Hero pin
    await scrollToNormalized(page, 0.3);
    await page.waitForTimeout(800);

    // The hero headline should be off-screen or have opacity 0
    const heroH1 = page.locator('#hero h1');
    const opacity = await heroH1.evaluate((el) => getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeLessThan(0.3);
  });

  test('BagTypePicker entrance animation makes cards visible', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    // Navigate to BagTypePicker
    await page.getByRole('button', { name: 'Start checking' }).click();
    await page.waitForTimeout(1500);

    // Cards should be visible
    const cards = page.locator('#bag-type [class*="grid"] > *');
    const count = await cards.count();
    expect(count).toBe(3);

    for (let i = 0; i < count; i++) {
      const opacity = await cards.nth(i).evaluate((el) => getComputedStyle(el).opacity);
      expect(parseFloat(opacity)).toBeGreaterThan(0.5);
    }
  });
});

test.describe('Footer navigation', () => {
  test('"Check another bag" scrolls back to Hero', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    // Scroll to the bottom of the page
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(1000);

    // Click "Check another bag" button
    const checkAnother = page.getByRole('button', { name: /Check another bag/i });
    await expect(checkAnother).toBeVisible();
    await checkAnother.click();
    await page.waitForTimeout(1500);

    // Should be back near top
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const scrollY = await page.evaluate(() => window.scrollY);
    // Because it scrolls to center of Hero pin, it might not be exactly 0
    // but should be well above airlines section
    const heroVisible = await isInViewport(page, '#hero');
    expect(heroVisible).toBe(true);
  });

  test('Footer has social links', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(500);

    await expect(page.locator('a[aria-label="Twitter"]')).toBeVisible();
    await expect(page.locator('a[aria-label="GitHub"]')).toBeVisible();
    await expect(page.locator('a[aria-label="Email"]')).toBeVisible();
  });

  test('Footer has copyright text', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(500);

    await expect(page.locator('text=baggage.fit — Built for travelers')).toBeVisible();
  });
});
