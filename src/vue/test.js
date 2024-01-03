const {By, Builder} = require('selenium-webdriver');
const assert = require("assert");

  describe('OG Vue app', function () {
    let driver;
    
    before(async () => {
        // using Firefox because it closes the browser window when done
        // and Chrome reports some odd "policy violation" message
      driver = await new Builder().forBrowser('firefox').build();
    });

    after(async () => await driver.quit());
    
    it('Loading Home page', async function () {
      await driver.get('https://aceade.github.io/sydfjords/#/');
      
      let title = await driver.getTitle();
      assert.equal("Visit the Sydfjords", title);
      
      await driver.manage().setTimeouts({implicit: 2000});
      
      // easiest way to check this sort of thing is to await the Promise and then get attributes
      let hero = await driver.findElement(By.css("#hero")).getAttribute("src");
      assert.equal(hero, "https://aceade.github.io/sydfjords/hero-480w.webp");
      let header = await driver.findElement(By.css("h1")).getText();
      assert.equal("Welcome to a land steeped in magic", header);

    });

    it("Changing language on home page", async function() {
      await driver.get('https://aceade.github.io/sydfjords/#/');

      let homeLink = await driver.findElement(By.css("a"));
      let homeLinkText = await homeLink.getText();
      assert.equal(homeLinkText, "Home");

      // open the menu by hovering over it
      const openMenuLink =  driver.findElement(By.css(".dropbtn"));
      const actions = driver.actions({async: true});
      await actions.move({origin: openMenuLink}).perform();

      await driver.findElement(By.xpath('//button[text()="عربي"]')).click();
      homeLinkText = await homeLink.getText();
      assert.equal(homeLinkText, "الصفحة الرئيسية");

      // switch to Irish
      await driver.findElement(By.xpath('//button[text()="Gaeilge"]')).click();
      homeLinkText = await homeLink.getText();
      assert.equal(homeLinkText, "Príomhleathanach");
    });

    it("Navbar dropdown for attractions", async() => {
      await driver.get('https://aceade.github.io/sydfjords/#/');
      let attractionsMenuVisible = await driver.findElement(By.id("attractionMenu")).isDisplayed();
      assert.equal(false, attractionsMenuVisible);

      // find the dropbtn classed-button above attractionMenu
      const buttons = await driver.findElements(By.css(".dropbtn"));
      const actions = driver.actions({async: true});
      await actions.move({origin: buttons[1]}).perform();

      attractionsMenuVisible = await driver.findElement(By.id("attractionMenu")).isDisplayed();
      assert.equal(true, attractionsMenuVisible);
    });
  
    
  });