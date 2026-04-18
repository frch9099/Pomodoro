const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  console.log('=== DESKTOP TESTS (md+) ===\n');

  await page.goto('http://localhost:5173/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const timerText = await page.locator('text=Focus Time').count();
  console.log(`1. Timer page shows: ${timerText > 0 ? 'PASS' : 'FAIL'}`);

  const gridCols = await page.evaluate(() => {
    const grid = document.querySelector('.grid');
    return grid ? getComputedStyle(grid).gridTemplateColumns : 'not found';
  });
  console.log(`2. 2-column layout: ${gridCols.includes('1fr 1fr') || gridCols.includes('256px') ? 'PASS' : 'FAIL'} (${gridCols})`);

  const currentTree = await page.locator('text=Current Tree').count();
  console.log(`3. GamificationPanel has Current Tree: ${currentTree > 0 ? 'PASS' : 'FAIL'}`);

  const treeVisual = await page.locator('.TreeVisual').count();
  console.log(`4. TreeVisual present: ${treeVisual > 0 ? 'PASS' : 'FAIL'}`);

  const streakText = await page.locator('text=Streak').count();
  console.log(`5. StreakDisplay present: ${streakText > 0 ? 'PASS' : 'FAIL'}`);

  // Check gold color for active streak
  const streakFlame = await page.locator('[class*="text-\\[\\#FFD54F\]"]').count();
  console.log(`6. StreakDisplay gold color (#FFD54F): ${streakFlame > 0 ? 'PASS' : 'FAIL'}`);

  const footer = await page.locator('footer').count();
  console.log(`7. Footer visible: ${footer > 0 ? 'PASS' : 'FAIL'}`);

  const forestView = await page.locator('text=Your Forest').count();
  console.log(`8. ForestView below layout: ${forestView > 0 ? 'PASS' : 'FAIL'}`);

  // Header navigation
  await page.locator('nav button:has-text("Tasks")').click();
  await page.waitForTimeout(500);
  const tasksView = await page.locator('text=Add a task').count() + await page.locator('text=Templates').count();
  console.log(`9. Header navigation (Tasks): ${tasksView > 0 ? 'PASS' : 'FAIL'}`);

  await page.locator('nav button:has-text("Stats")').click();
  await page.waitForTimeout(500);
  const statsView = await page.locator('text=Total Pomodoros').count();
  console.log(`10. Header navigation (Stats): ${statsView > 0 ? 'PASS' : 'FAIL'}`);

  await page.locator('nav button:has-text("Timer")').click();
  await page.waitForTimeout(500);

  console.log('\n=== CSS CUSTOM PROPERTIES ===\n');

  const cssVars = await page.evaluate(() => {
    const body = document.body;
    const style = getComputedStyle(body);
    return {
      bgPrimary: style.getPropertyValue('--bg-primary').trim(),
      accentGold: style.getPropertyValue('--accent-gold').trim(),
      textPrimary: style.getPropertyValue('--text-primary').trim(),
      radiusMd: style.getPropertyValue('--radius-md').trim()
    };
  });

  console.log(`--bg-primary: ${cssVars.bgPrimary === '#FAF9F7' ? 'PASS' : 'FAIL'} (${cssVars.bgPrimary})`);
  console.log(`--accent-gold: ${cssVars.accentGold === '#FFD54F' ? 'PASS' : 'FAIL'} (${cssVars.accentGold})`);
  console.log(`--text-primary: ${cssVars.textPrimary === '#2D3830' ? 'PASS' : 'FAIL'} (${cssVars.textPrimary})`);
  console.log(`--radius-md: ${cssVars.radiusMd === '12px' ? 'PASS' : 'FAIL'} (${cssVars.radiusMd})`);

  console.log('\n=== MOBILE TESTS (< 768px) ===\n');

  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const mobilePage = await mobileContext.newPage();

  await mobilePage.goto('http://localhost:5173/');
  await mobilePage.waitForLoadState('networkidle');
  await mobilePage.waitForTimeout(1000);

  const tasksTab = await mobilePage.locator('button:has-text("Tasks")').count();
  const treeTab = await mobilePage.locator('button:has-text("Tree")').count();
  console.log(`1. Mobile Tasks tab: ${tasksTab > 0 ? 'PASS' : 'FAIL'}`);
  console.log(`2. Mobile Tree tab: ${treeTab > 0 ? 'PASS' : 'FAIL'}`);

  if (treeTab > 0) {
    await mobilePage.locator('button:has-text("Tree")').click();
    await mobilePage.waitForTimeout(500);
    const currentTreeMobile = await mobilePage.locator('text=Current Tree').count();
    console.log(`3. Tree tab shows GamificationPanel: ${currentTreeMobile > 0 ? 'PASS' : 'FAIL'}`);
    const forestMobile = await mobilePage.locator('text=Your Forest').count();
    console.log(`4. Tree tab shows ForestView: ${forestMobile > 0 ? 'PASS' : 'FAIL'}`);
  }

  const mobileFooter = await mobilePage.locator('footer').count();
  console.log(`5. Mobile Footer visible: ${mobileFooter > 0 ? 'PASS' : 'FAIL'}`);

  console.log('\n=== FUNCTIONAL TESTS ===\n');

  const startBtn = await page.locator('[aria-label="Start timer"]').first();
  if (startBtn) {
    await startBtn.click();
    await page.waitForTimeout(1500);
    const title = await page.title();
    console.log(`1. Timer countdown: ${title.includes('🍅') ? 'PASS' : 'FAIL'} (title: ${title})`);
  } else {
    console.log('1. Timer countdown: FAIL (start button not found)');
  }

  console.log('\n=== CONSOLE ERRORS ===\n');
  if (errors.length === 0) {
    console.log('No console errors: PASS');
  } else {
    console.log('Console errors: FAIL');
    errors.forEach(e => console.log(`  ERROR: ${e}`));
  }

  console.log('\n=== OVERALL ASSESSMENT ===');
  console.log('Tests completed. Check results above.');

  await browser.close();
})();
