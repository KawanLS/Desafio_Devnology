const puppeteer = require("puppeteer");
const Bot = require("./Bot");
const http = require("http");
const port = 3000;

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const bot = new Bot(page);

  await bot.initBrowser();
  const result = await bot.scrapAll();

  browser.close();

  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(result, null, 2));
    res.end();
  });

  server.listen(port, () => {
    console.log(`Servidor escutando em http://localhost:${port}`);
  });
})();
