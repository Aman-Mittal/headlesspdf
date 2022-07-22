
const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

var cnote = ''
app.set('port', (process.env.PORT || 5000))



app.get("/pdf", async (req, res) => {
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
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
        format: "A2",
        pageRanges: '1'
    });
   
    await browser.close();

    res.contentType("application/pdf");
    res.send(pdf);
})

app.listen(app.get('port'), () => {
    console.log("Server started");
    console.log("Node app is running at localhost:" + app.get('port'))
});
