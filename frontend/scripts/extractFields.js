/* eslint-disable */
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const parentDir = path.dirname(process.cwd());
const routesFile = path.join(parentDir, "backend/src/data/routes.json");

let existingRoutes = [];
if (fs.existsSync(routesFile)) {
  existingRoutes = JSON.parse(fs.readFileSync(routesFile, "utf8"));
}

const routeMap = new Map(existingRoutes.map((r) => [r.path, r]));
const routes = [];

async function extractFields() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const links = ["/"];
  const visitedPages = new Set();

  while (links.length > 0) {
    const link = links.shift();

    if (visitedPages.has(link)) {
      continue;
    }

    visitedPages.add(link);

    await page.goto(`http://localhost:3000${link}`);

    const fields = await page.evaluate(() =>
      Array.from(document.querySelectorAll("input, select, textarea")).map(
        (el) => ({ type: el.tagName, name: el.getAttribute("name") })
      )
    );

    if (routeMap.has(link)) {
      const existing = routeMap.get(link);
      routes.push({
        path: link,
        description: existing.description,
        quickActions: existing.quickActions,
        fields,
      });
    } else {
      routes.push({
        path: link,
        description: "no commit",
        quickActions: [],
        fields,
      });
    }

    const nextLinks = links.concat(
      await page.evaluate(() =>
        Array.from(document.querySelectorAll("a"))
          .map((el) => el.getAttribute("href"))
          .filter((href) => href?.startsWith("/"))
      )
    );

    for (const link of nextLinks) {
      if (!visitedPages.has(link)) {
        links.push(link);
      }
    }
  }

  await browser.close();
}

extractFields().then(() => {
  fs.writeFileSync(routesFile, JSON.stringify(routes, null, 2));
  console.log(
    `✅ Updated ${routesFile} with ${routes.length} routes and fields`
  );
});
