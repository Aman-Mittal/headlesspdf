// run `node index.js` in the terminal

const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

var cnote = ''
app.get("/pdf", async (req, res) => {
    const url = 'https://cjdarcl.mywebxpress.com/GUI/Tracking_New1/Website/Track.Aspx?TenantName=cjdarcl&CONSIGNMENT=';
    cnote = req.query.target;
    const browser = await puppeteer.launch({
        headless: true
    });

    const webPage = await browser.newPage();

    await webPage.goto(url+cnote, {
        waitUntil: "networkidle2"
    });
    
    await webPage.evaluate(_ => {
        // Capture all links that start with javascript on the href property
        // and change it to # instead.
        document.querySelectorAll('a')
          .forEach(a => {
            a.remove();
          })
      });

     //await webPage.emulateMediaType('screen')

    const pdf = await webPage.pdf({
        format: "A4",
        landscape:true
    });
   
    await browser.close();

    res.contentType("application/pdf");
    res.send(pdf);
})

app.listen(3000, () => {
    console.log("Server started");
});
console.log(`Hello Node.js v${process.versions.node}!`);
