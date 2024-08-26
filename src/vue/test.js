const {By, Builder, until} = require('selenium-webdriver');
const assert = require("assert");
const logging = require('selenium-webdriver/lib/logging');

  describe('OG Vue app', function () {
    let driver;
    
    before(async () => {
        // using Firefox because it closes the browser window when done
        // and Chrome reports some odd "policy violation" message
      driver = await new Builder().forBrowser('firefox').build();
      const prefs = new logging.Preferences();
      prefs.setLevel(logging.Type.BROWSER, logging.Level.DEBUG);

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

    it("Loading About page", async() => {
      await driver.get('https://aceade.github.io/sydfjords/#/about');
      const headers = await driver.findElements(By.css("h2"));
      const firstText = await headers[0].getText();
      assert.equal(firstText, "Tourism offices");

      const secondText = await headers[1].getText();
      assert.equal(secondText, "Email us");

      const thirdText = await headers[2].getText();
      assert.equal(thirdText, "About");
    });

    it("Testing email form (invalid details)", async() => {
      await driver.get('https://aceade.github.io/sydfjords/#/about');

      let nameField = await driver.findElement(By.id("name"));
      let emailField = await driver.findElement(By.id("email"));
      let messageField = await driver.findElement(By.id("message"));
      let submitButton = await driver.findElement(By.css("#emailForm button"));
      let submitStatus = await driver.findElement(By.id("submitStatus"));

      await nameField.sendKeys("Selena Ium");
      await emailField.sendKeys("test@example.com");
      await submitButton.click();

      let statusText = await submitStatus.getText();
      assert.equal(statusText, "Please fill out all fields");

      await nameField.click();
      await nameField.clear();
      await nameField.sendKeys("Selena Ium");
      await emailField.click();
      await emailField.clear();
      await emailField.sendKeys("test@example.com");
      await messageField.click();
      await messageField.clear();
      await messageField.sendKeys("This is a test");
      const nameText = await driver.findElement(By.id("name")).getAttribute("value");
      const emailText = await emailField.getAttribute("value");
      const messageText = await messageField.getAttribute("value");
      console.info(`nameField text: ${nameText}\nemailText: ${emailText}\nmessageText: ${messageText}`);
      await submitButton.click();

      statusText = await submitStatus.getText();
      assert.equal(statusText, "Sending...");
      await driver.wait(until.elementTextIs(submitStatus, ""), 5000);
    });

    xit("Testing email form (valid details)", async() => {
      await driver.get('https://aceade.github.io/sydfjords/#/about');

      let nameField = await driver.findElement(By.id("name"));
      let emailField = await driver.findElement(By.id("email"));
      let messageField = await driver.findElement(By.id("message"));
      let submitButton = await driver.findElement(By.css("#emailForm button"));
      let submitStatus = await driver.findElement(By.id("submitStatus"));

      await nameField.click();
      await nameField.clear();
      await nameField.sendKeys("Selena Ium");
      await emailField.click();
      await emailField.clear();
      await emailField.sendKeys("test@example.com");
      await messageField.click();
      await messageField.clear();
      await messageField.sendKeys("This is a test");
      const nameText = await driver.findElement(By.id("name")).getAttribute("value");
      const emailText = await emailField.getAttribute("value");
      const messageText = await messageField.getAttribute("value");
      console.info(`nameField text: ${nameText}\nemailText: ${emailText}\nmessageText: ${messageText}`);
      await submitButton.click();

      let statusText = await submitStatus.getText();
      // since the email endpoint is no longer deployed, this will only be "sending"
      assert.equal(statusText, "Sending...");
      await driver.wait(until.elementTextIs(submitStatus, ""), 5000);
    });
  
    
  });