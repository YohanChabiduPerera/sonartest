import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import 'chromedriver';
import fs from 'fs';

const testAddDoctorForm = async () => {
  const options = new chrome.Options();
  // options.addArguments('--headless'); // Uncomment to run in headless mode
  let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    console.log('Navigating to the login page');
    await driver.get('http://localhost:3000/login');

    await driver.wait(until.elementLocated(By.id('username')), 10000);
    await driver.wait(until.elementLocated(By.id('password')), 10000);

    let username = await driver.findElement(By.id('username'));
    await username.sendKeys('randula'); 

    let password = await driver.findElement(By.id('password'));
    await password.sendKeys('Randula_123'); 

    let loginButton = await driver.findElement(By.xpath("//button[text()='Login']")); 
    await loginButton.click();

    await driver.wait(until.urlIs('http://localhost:3000/superAdmin/dashboard'), 15000); 

    console.log('Navigated to the dashboard');

    console.log('Navigating to the Add Doctor form page');
    await driver.get('http://localhost:3000/user-add/doctor'); 

    let screenshot = await driver.takeScreenshot();
    fs.writeFileSync('screenshot.png', screenshot, 'base64');
    console.log('Screenshot saved as screenshot.png');

    await driver.wait(until.elementLocated(By.id('firstName')), 15000); 

    console.log('Page loaded and form element located');

    let firstName = await driver.findElement(By.id('firstName'));
    await firstName.sendKeys('John');

    let lastName = await driver.findElement(By.id('lastName'));
    await lastName.sendKeys('Doe');

    let email = await driver.findElement(By.id('email'));
    await email.sendKeys('john.doe@example.com');

    let specialization = await driver.findElement(By.id('specialization'));
    await specialization.click();
    let option = await driver.findElement(By.xpath("//li[contains(text(),'Cardiologist')]"));
    await option.click();

    let address = await driver.findElement(By.id('address'));
    await address.sendKeys('1234 Elm Street');

    let contact = await driver.findElement(By.id('contact'));
    await contact.sendKeys('1234567890');

    let submitButton = await driver.findElement(By.xpath("//button[text()='Add Doctor']"));
    await submitButton.click();

    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Successfully Added')]")), 10000);

    console.log('Test Passed: Doctor added successfully');
  } catch (err) {
    console.error('Test Failed:', err);
  } finally {
    await driver.quit();
  }
};

testAddDoctorForm();
