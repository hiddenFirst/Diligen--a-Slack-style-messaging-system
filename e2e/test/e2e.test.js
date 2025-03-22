import {test, beforeAll, afterAll, beforeEach, afterEach, expect} from 'vitest';
import puppeteer from 'puppeteer';
import path from 'path';
import express from 'express';
import http from 'http';

import 'dotenv/config';
import app from '../../backend/src/app.js';

let backend;
let frontend;
let browser;
let page;

beforeAll(() => {
  backend = http.createServer(app);
  backend.listen(3010, () => {
    console.log('Backend Running at http://localhost:3010');
  });
  frontend = http.createServer(
      express()
          .use('/assets', express.static(
              path.join(__dirname, '..', '..', 'frontend', 'dist', 'assets')))
          .get('*', function(req, res) {
            res.sendFile('index.html',
                {root: path.join(__dirname, '..', '..', 'frontend', 'dist')});
          }),
  );
  frontend.listen(3000, () => {
    console.log('Frontend Running at http://localhost:3000');
  });
});

afterAll(async () => {
  await backend.close();
  await frontend.close();
  setImmediate(function() {
    frontend.emit('close');
  });
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true,
    /*
     * Use these two settings instead of the one above if you want to see the
     * browser. However, in the grading system e2e test run headless, so make
     * sure they work that way before submitting.
     */
    // headless: false,
    slowMo: 70,
  });
  page = await browser.newPage();
  await page.setViewport({
    width: 500,
    height: 800,
  });
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  const childProcess = browser.process();
  if (childProcess) {
    await childProcess.kill(9);
  }
});

test('0) Mobile mode: Should render login page in App', async () => {
  // wait login button appear，means App render in mobile
  await page.waitForSelector('[aria-label="login"]');
  const loginButton = await page.$('[aria-label="login"]');
  expect(loginButton).not.toBeNull();
});

test('1) Invalid Login shows error message', async () => {
  // type wrong email / password
  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'wrong@books.com');
  await page.type('input[name="password"]', 'wrongpwd');

  // click login button (aria-label="login")
  await page.click('[aria-label="login"]');

  // Wait error message send out
  // "Invalid token email or password" appear in page
  await page.waitForSelector('text=Invalid token email or password');
  expect(await page.$('text=Invalid token email or password'))
      .not.toBeNull();
}, 15000);

test('2) Successful Login => see BottomBar', async () => {
  // type correct account
  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'molly@books.com');
  await page.type('input[name="password"]', 'mollymember');

  // click login button
  await page.click('[aria-label="login"]');

  // wait jump to Home and display BottomBar
  await page.waitForSelector('[aria-label="bottom-bar"]');
  expect(await page.$('[aria-label="bottom-bar"]')).not.toBeNull();
}, 15000);

test('3) Select Workspace => see TopBar in General', async () => {
  // Login
  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'molly@books.com');
  await page.type('input[name="password"]', 'mollymember');
  await page.click('[aria-label="login"]');
  await page.waitForSelector('[aria-label="header"]');

  // choice workspace
  await page.waitForSelector('[aria-label="workspaces-drop-down"]');
  await page.click('[aria-label="workspaces-drop-down"]');
  // click workspace "General"
  await page.click('text=General');

  await page.waitForSelector('text= General');
  expect(await page.$('text= General')).not.toBeNull();
}, 20000);

test('4) Select Workspace => load Channels in CSE186', async () => {
  // Login
  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'molly@books.com');
  await page.type('input[name="password"]', 'mollymember');
  await page.click('[aria-label="login"]');
  await page.waitForSelector('[aria-label="bottom-bar"]');

  // choice workspace
  // 例如: aria-label="workspaces-drop-down"
  await page.waitForSelector('[aria-label="workspaces-drop-down"]');
  await page.click('[aria-label="workspaces-drop-down"]');
  // 假设出现 workspace "CSE186"
  await page.click('text=CSE186');

  // 检查是否加载 Channel 组件
  // 假设 "General" channel name
  await page.waitForSelector('text=# Assignment1');
  expect(await page.$('text=# Assignment1')).not.toBeNull();
  expect(await page.$('text=# Assignment2')).not.toBeNull();
  expect(await page.$('text=# Assignment3')).not.toBeNull();
  expect(await page.$('text=# Assignment4')).not.toBeNull();
}, 20000);

test('5) Navigate to /messages => load messages', async () => {
  // Login
  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'molly@books.com');
  await page.type('input[name="password"]', 'mollymember');
  await page.click('[aria-label="login"]');
  await page.waitForSelector('[aria-label="bottom-bar"]');

  // click channel "Assignment1"
  await page.waitForSelector('text=# Assignment1');
  await page.click('text=# Assignment1');

  // jump to /messages
  // check does messages appear
  await page.waitForSelector('text=Welcome to channel!');
  expect(await page.$('text=Welcome to channel!')).not.toBeNull();
}, 20000);

test('6) Post new message => see it in message list', async () => {
  // Login
  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'molly@books.com');
  await page.type('input[name="password"]', 'mollymember');
  await page.click('[aria-label="login"]');
  await page.waitForSelector('[aria-label="bottom-bar"]');

  // type new message
  await page.waitForSelector('[placeholder*="Send a message to');
  await page.type('[placeholder*="Send a message to"]', 'Hello E2E test');
  // click sent buttom (aria-label="post")
  await page.click('[aria-label="post"]');

  // check new message "Hello E2E test" appear in message list
  await page.waitForSelector('text=Hello E2E test');
  expect(await page.$('text=Hello E2E test')).not.toBeNull();
}, 20000);

test('6-1) navegating new message => see message list date', async () => {
  // Login
  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'molly@books.com');
  await page.type('input[name="password"]', 'mollymember');
  await page.click('[aria-label="login"]');
  await page.waitForSelector('[aria-label="bottom-bar"]');

  const messageDates = await page.$$eval('[aria-label="message-date"]',
      (nodes) => nodes.map((node) => node.innerText.trim()),
  );

  const parsedDates = messageDates.map((date) => new Date(date));
  for (let i = 0; i < parsedDates.length - 1; i++) {
    expect(parsedDates[i].getTime())
        .toBeLessThanOrEqual(parsedDates[i + 1].getTime());
  }
}, 20000);

test('7) BackIcon to Home page => see if leave message page', async () => {
  // Login
  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'molly@books.com');
  await page.type('input[name="password"]', 'mollymember');
  await page.click('[aria-label="login"]');
  await page.waitForSelector('[aria-label="bottom-bar"]');

  // wait for header and click "Back-To-Home" buttom
  await page.waitForSelector('[aria-label="header"]');
  await page.waitForSelector('[aria-label="Back-To-Home"]');
  await page.click('[aria-label="Back-To-Home"]');

  // check if back to Home Page
  await page.waitForSelector('text=CSE186');
  expect(await page.$('text=CSE186')).not.toBeNull();
}, 20000);

test('8) Switch Page to SettingPage => see name and Logout', async () => {
  // Login
  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'molly@books.com');
  await page.type('input[name="password"]', 'mollymember');
  await page.click('[aria-label="login"]');
  await page.waitForSelector('[aria-label="bottom-bar"]');

  // wait for header and click "Back-To-Home" buttom
  await page.waitForSelector('text=Settings');
  await page.click('text=Settings');

  // check if back to Home Page
  await page.waitForSelector('text=molly');
  await page.waitForSelector('text=Sign out of CSE186');
  expect(await page.$('text=CSE186')).not.toBeNull();
  expect(await page.$('text=Sign out of CSE186')).not.toBeNull();
}, 20000);

test('9) Switch Page to SettingPage => set status', async () => {
  // Step 1: Login
  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'molly@books.com');
  await page.type('input[name="password"]', 'mollymember');
  await page.click('[aria-label="login"]');

  await page.waitForSelector('[aria-label="bottom-bar"]');

  await page.waitForSelector('text=Settings');
  await page.click('text=Settings');

  await page.waitForSelector('[placeholder="Update your status"]');
  await page.click('[placeholder="Update your status"]', {clickCount: 3});
  await page.keyboard.press('Backspace');
  await page.type('[placeholder="Update your status"]', 'Busy');

  page.on('dialog', async (dialog) => {
    console.log('Alert message:', dialog.message());
    expect(dialog.message()).toContain('Status updated to: Busy');
    await dialog.dismiss();
  });

  await page.click('text=Update');

  await new Promise((resolve) => setTimeout(resolve, 2000));
}, 30000);

test('9.1) Switch Page to SettingPage => set status Away', async () => {
  // Step 1: Login
  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'molly@books.com');
  await page.type('input[name="password"]', 'mollymember');
  await page.click('[aria-label="login"]');

  await page.waitForSelector('[aria-label="bottom-bar"]');

  await page.waitForSelector('text=Settings');
  await page.click('text=Settings');

  await page.waitForSelector('text=Set yourself as AWAY');
  await page.click('text=Set yourself as AWAY');

  page.on('dialog', async (dialog) => {
    console.log('Alert message:', dialog.message());
    expect(dialog.message()).toContain('Status updated to: Away');
    await dialog.dismiss();
  });

  await page.click('text=Update');

  await new Promise((resolve) => setTimeout(resolve, 2000));
}, 30000);

test('10) Switch Page to Home => Back to Home', async () => {
  // Step 1: Login
  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'molly@books.com');
  await page.type('input[name="password"]', 'mollymember');
  await page.click('[aria-label="login"]');

  await page.waitForSelector('[aria-label="bottom-bar"]');

  await page.waitForSelector('text=Settings');
  await page.click('text=Settings');

  await page.waitForSelector('[placeholder="Update your status"]');

  await page.waitForSelector('text=Home');
  await page.click('text=Home');

  await page.waitForSelector('text=CSE186');
  expect(await page.$('text=CSE186')).not.toBeNull();
}, 30000);

test('11) Remember Path => from messagePage Logout', async () => {
  // Step 1: Login
  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'molly@books.com');
  await page.type('input[name="password"]', 'mollymember');
  await page.click('[aria-label="login"]');

  await page.waitForSelector('[aria-label="bottom-bar"]');

  // goto messagePage and switch to settingPage
  await page.waitForSelector('text=# Assignment1');
  await page.click('text=# Assignment1');
  await page.click('text=Settings');

  await page.waitForSelector('[placeholder="Update your status"]');

  await page.waitForSelector('text=Sign out of CSE186');
  await page.click('text=Sign out of CSE186');

  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'molly@books.com');
  await page.type('input[name="password"]', 'mollymember');
  await page.click('[aria-label="login"]');

  await page.waitForSelector('text=Welcome to channel!');
  expect(await page.$('text=Welcome to channel!')).not.toBeNull();
}, 50000);

test('12) Remember Path => from workspace Logout', async () => {
  // Login
  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'molly@books.com');
  await page.type('input[name="password"]', 'mollymember');
  await page.click('[aria-label="login"]');
  await page.waitForSelector('[aria-label="bottom-bar"]');

  // wait for header and click "Back-To-Home" buttom
  await page.waitForSelector('[aria-label="Back-To-Home"]');
  await page.click('[aria-label="Back-To-Home"]');

  // wait change the workspace and goto setting page
  await page.waitForSelector('[aria-label="workspaces-drop-down"]');
  await page.click('[aria-label="workspaces-drop-down"]');
  await page.waitForSelector('text=CSE180');
  await page.click('text=CSE180');
  await page.waitForSelector('text=Lab1');
  await page.click('text=Settings');

  await page.waitForSelector('[aria-label="logout"]');
  await page.click('[aria-label="logout"]');

  await page.waitForSelector('input[name="email"]');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="email"]', 'molly@books.com');
  await page.type('input[name="password"]', 'mollymember');
  await page.click('[aria-label="login"]');

  await page.waitForSelector('text=CSE180');
  expect(await page.$('text=CSE180')).not.toBeNull();
}, 50000);
