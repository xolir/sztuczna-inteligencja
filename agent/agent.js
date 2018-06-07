const puppeteer = require("puppeteer");
const Axios = require('axios');
const formData = require('form-data');

const getApiResponse = async (photoData) => {
    console.log(photoData);
    var form = new formData();

    form.append('photo', photoData)

    const resp = await Axios.post('http://localhost:5000/upload', {
        photo: photoData
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return resp.data
}

const getPhotoDescriptor = async (page) => {
    const photoURL = await page.$eval('.garbage-image', el => el.src);
    
    const classifierResponse = await Axios.post('http://localhost:5000/upload', {
        photo: photoURL
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return classifierResponse.data
};
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
await elements.fieldGarbage.click();

  let photoDescriptor = await getPhotoDescriptor(page);

  elements.plastic = await page.$('[data-testid="plastic"]')
  elements.paper = await page.$('[data-testid="paper"]')
  elements.glass = await page.$('[data-testid="glass"]')

  console.log('Debug info: Clicking on - ', photoDescriptor);
  elements[photoDescriptor].click();

  elements.fieldGarbage = await page.$('.garbage-active');
  await elements.fieldGarbage.click();
  photoDescriptor = await getPhotoDescriptor(page);
  elements[photoDescriptor].click();
  
});
