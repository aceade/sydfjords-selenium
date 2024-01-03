// Example adapted from https://www.selenium.dev/documentation/webdriver/getting_started/using_selenium/
const {By, Builder} = require('selenium-webdriver');
const assert = require("assert");

  describe('First script', function () {
    let driver;
    
    before(async () => {
        // using Firefox because it closes the browser window when done
        // and Chrome reports some odd "policy violation" message
      driver = await new Builder().forBrowser('firefox').build();
    });

    after(async () => await driver.quit());
    
    it('First Selenium script with mocha', async function () {
      await driver.get('https://www.selenium.dev/selenium/web/web-form.html');
      
      let title = await driver.getTitle();
      assert.equal("Web form", title);
      
      await driver.manage().setTimeouts({implicit: 500});
      
      let textBox = await driver.findElement(By.name('my-text'));
      let submitButton = await driver.findElement(By.css('button'));
      
      await textBox.sendKeys('Selenium');
      await submitButton.click();
      
      let message = await driver.findElement(By.id('message'));
      let value = await message.getText();
      assert.equal("Received!", value);
    });
  
    
  });