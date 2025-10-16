const { chromium } = require('playwright');
const { BadRequestErrorException } = require('../middlewares/custom-error');
const scrapTemplateHook = require('../webhooks/scrap-template');
const { executeWebhook } = require('../webhooks/invoice-file');
const defaults = require('../config/defaults');

const checkIfNotEmpty = (value) => value === 'null' ? undefined : value;

const generatePDF = async (req, res, next) => {
  let browser;

  try {
    const {
      url, webhook, config, username, password,
      element_id, page_break_before, delay, navigationTimeout,
    } = req.body;


    if (!url) throw new BadRequestErrorException('URL is required');

    const newConfig = mergeConfig(config);

    //Launch browser 
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ httpCredentials: { username: username || '', password: password || '' } });

    console.group('\x1b[33m%s\x1b[0m', `\n[${new Date().toISOString()}] Scraping process started...`);
    const timeout = isNaN(parseFloat(navigationTimeout)) ? defaults.timeout : parseFloat(navigationTimeout * 1000);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
    await page.waitForTimeout(3 * 1000);


    const _delay = isNaN(parseFloat(delay)) ? defaults.delay : parseFloat(delay * 1000);

    await page.waitForTimeout(_delay);

    if (element_id && element_id !== 'null') {
      await waitToElementsByIds(element_id, page, 'visible');
    }
    console.log('Page elements loaded');

    if (page_break_before && page_break_before !== 'null') {
      await waitToElementsByIds(page_break_before, page, 'attached', async (locator) => {
        await locator.evaluate((el) => {
          el.style.pageBreakBefore = 'always';
          el.style.breakBefore = 'page';
          el.style.marginTop = '0';
          el.style.paddingTop = '0';
          el.style.breakInside = 'avoid';
          el.style.minHeight = 'unset';
        });
      });
    }
    //Page To PDF
    console.log('Page ready for pdf conversion');
    const pdf = await page.pdf(newConfig);

    //Close Page
    await page.close();
    console.log('Page Closed');

    //Convert PDF TO Buffer
    console.log('Page converted to pdf');
    const pdfFile = Buffer.from(pdf);
    await browser.close();

    console.groupEnd();
    console.log('\x1b[32m%s\x1b[0m', `[${new Date().toISOString()}] Scraping process completed successfully!`);

    // Update user created pdf's
    await scrapTemplateHook(req.user, next);

    //Post pdf to webhook
    if (webhook && webhook !== 'null') await executeWebhook(req, pdfFile.toString('base64'), next);

    //Send pdf back to client
    res.contentType('application/pdf');
    res.send(pdfFile);
  } catch (error) {
    next(error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

function mergeConfig(config) {
  return {
    ...config,
    height: checkIfNotEmpty(config?.height),
    width: checkIfNotEmpty(config?.width),
    pageRanges: checkIfNotEmpty(config?.pageRanges),
  };
}

async function waitToElementsByIds(selectors, page, waitingState = 'attached', afterWaitFn) {
  const elementIds = (selectors || '')
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);

  if (elementIds.length === 0) return;

  await Promise.all(elementIds.map(async (id) => {
    const locator = page.locator(`#${id}`);
    await locator.waitFor({ state: waitingState });
    if (typeof afterWaitFn === 'function') {
      await afterWaitFn(locator);
    }
  }));
}

module.exports = { generatePDF };
