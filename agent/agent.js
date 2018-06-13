const puppeteer = require("puppeteer");
const Axios = require('axios');
const formData = require('form-data');

const getPhotoDescriptor = async (page) => {
    await page.$('.garbage-image');
    const photoURL = await page.$eval('.garbage-image', el => el.src);

    // TODO Add Try/Catch in case of server can't recognize anything
    const classifierResponse = await Axios.post('http://localhost:5000/upload', {
        photo: photoURL
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return classifierResponse.data
};

const collectGarbage = async (page, elements) => {
    elements.fieldGarbage = await page.$('.garbage-active');
    await elements.fieldGarbage.click();

    let photoDescriptor = await getPhotoDescriptor(page);
  
    elements.plastic = await page.$('[data-testid="plastic"]')
    elements.paper = await page.$('[data-testid="paper"]')
    elements.glass = await page.$('[data-testid="glass"]')
  
    console.log('Debug info: Clicking on - ', photoDescriptor);
    await elements[photoDescriptor].click();
    return
}
puppeteer.launch({
    headless: false,
    slowMo: 200,
}).then(async browser => {
  const elements = {};
  const page = await browser.newPage();
  await page.goto("http://localhost:3000");

  elements.goUp = await page.$('[data-testid="go-up"]');
  elements.goDown = await page.$('[data-testid="go-down"]');
  elements.goLeft = await page.$('[data-testid="go-left"]');
  elements.goRight = await page.$('[data-testid="go-right"]');
  elements.fieldGarbage = await page.$('.garbage-active');

  const gameStateRef = await page.evaluate(() => window.state);

//   await elements.goLeft.click();
//   await elements.goLeft.click();
//   await elements.goDown.click();
//   await elements.goDown.click();
//   await elements.goDown.click();
    await collectGarbage(page, elements);
    await collectGarbage(page, elements);
    await collectGarbage(page, elements);


  
});
