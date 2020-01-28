const puppeteer = require('puppeteer');
const jsdom = require("jsdom")
const {JSDOM} = jsdom
global.DOMParser = new JSDOM().window.DOMParser

const isHeadless = false


async function scroll(page, scrollDelay = 1000) {
    let previousHeight;
    try {
        while (mutationsSinceLastScroll > 0 || initialScrolls > 0) {
            mutationsSinceLastScroll = 0;
            initialScrolls--;
            previousHeight = await page.evaluate(
                'document.body.scrollHeight'
            );
            await page.evaluate(
                'window.scrollTo(0, document.body.scrollHeight)'
            );
            await page.waitForFunction(
                `document.body.scrollHeight > ${previousHeight}`,
                {timeout: 600000}
            ).catch(e => console.log('scroll failed'));
            await page.waitFor(scrollDelay);
        }
    } catch (e) {
        console.log(e);
    }
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}




async function logIn(page) {

    await page.goto('https://www.facebook.com/',
        {waitUntil: 'networkidle2'})

    await page.waitForSelector('input[name="email"]')

    await page.type('input[name="email"]', "<your id>")
    await page.type('input[name="pass"]', "<password>")


    await page.click('label[id=loginbutton]')

    await page.waitForSelector('span[class="imgWrap"]')

}

async function goToPage(page, pageName) {

    await page.goto("https://m.facebook.com/" + pageName + "/",
        {waitUntil: 'networkidle2'})

//await scroll(page)
    await page.waitForSelector('div[data-nt="NT:BOX_3"]')
}




exports.gotopage = async function(){
    pagename = "goodrx"
    const browser = await puppeteer.launch({headless: isHeadless})
    const page = await browser.newPage()


    await page.setViewport({width: 1280, height: 800})


    await logIn(page)

    await goToPage(page, pageName)
}


