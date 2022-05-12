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

      const filtered = list_all.filter((obj) => obj.title.includes("Lenovo"));

      filtered.map((obj) => obj.parentElement.parentElement);

      const selected_items = filtered.map((obj) => {
        const div = obj.parentElement.parentElement;
        const price = div.querySelector(".price").innerText;
        const title = obj.innerText;
        const description = div.children[2].innerText;

        return { title, price, description };
      });
      return selected_items;
    });

    const ordered_items = selected_items.sort();
    return ordered_items;
  }
}
module.exports = Bot;
