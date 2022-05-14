class Bot {
  constructor(page) {
    this.page = page;
  }

  async initBrowser() {
    await this.page.goto(
      "https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops"
    );

    await this.page.waitForSelector(".row", { visible: true });
  }
  async scrapAll() {
    const selected_items = await this.page.evaluate(() => {
      const list_all = Array.from(document.querySelectorAll("a.title"));
      const items = list_all.filter((obj) => obj.title.includes("Lenovo"));

      return items.map((obj) => obj.innerText);
    });

    var filtered_list = [];

    for (let item of selected_items) {
      await this.page.evaluate((item) => {
        const list_all = Array.from(document.querySelectorAll("a.title"));
        list_all.find((obj) => obj.innerText === item).click();
      }, item);
      await this.page.waitForSelector('[class="memory"]');
      const buttons_memory = await this.page.evaluate(
        () => document.querySelectorAll('[class="swatches"] button').length
      );

      for (let i = 1; i < buttons_memory; i++) {
        await this.page.click(`[class="swatches"] button:nth-child(${i})`);
        const title_item = await this.scrapTitle();
        const price_item = await this.scrapPrice();
        const memory_item = await this.scrapMemory();
        let description = await this.scrapDescription();
        let description_item = description.replace(
          "128GB" || "256GB" || "500GB",
          `${memory_item}`
        );
        let obj = { title_item, price_item, description_item, memory_item };
        filtered_list.push(obj);
      }
      await this.page.goto(
        "https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops"
      );
      await this.page.waitForSelector('[class="page-header"]');
    }

    filtered_list.sort(function (a, b) {
      if (
        parseFloat(a.price_item.replace("$", "")) <
        parseFloat(b.price_item.replace("$", ""))
      ) {
        return -1;
      } else {
        return true;
      }
    });
    return filtered_list;
  }

  async scrapTitle() {
    await this.page.waitForSelector('[class="caption"] h4:nth-child(2)');
    return await this.page.evaluate(
      () =>
        document.querySelector('[class="caption"] h4:nth-child(2)').innerText
    );
  }
  async scrapPrice() {
    await this.page.waitForSelector('[class="caption"] h4:nth-child(1)');
    return await this.page.evaluate(
      () =>
        document.querySelector('[class="caption"] h4:nth-child(1)').innerText
    );
  }
  async scrapDescription() {
    await this.page.waitForSelector('[class="caption"] p');
    return await this.page.evaluate(
      () => document.querySelector('[class="caption"] p').innerText
    );
  }
  async scrapMemory() {
    await this.page.waitForSelector(
      '[class="swatches"] [class="btn swatch btn-primary"]'
    );
    return await this.page.evaluate(
      () =>
        document.querySelector(
          '[class="swatches"] [class="btn swatch btn-primary"]'
        ).innerText
    );
  }
}
module.exports = Bot;
