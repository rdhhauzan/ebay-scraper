import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import OpenAI from "openai";

export async function POST(req) {
  try {
    // Parse request body
    const { keyword } = await req.json();

    if (!keyword) {
        return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    if (typeof keyword !== "string") {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_KEY,
    });

    const browser = await puppeteer.launch({ headless: envCode ? "new" : false });
    const page = await browser.newPage();

    let allItemsHTML = "";

    // Scrape up to page 5
    for (let i = 1; i <= 5; i++) {
      const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(keyword)}&_pgn=${i}`;
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const pageHTML = await page.evaluate(() => {
        const results = document.querySelectorAll("ul.srp-results li.s-item");
        const items = Array.from(results).map((item) => {
          const title = item.querySelector(".s-item__title")?.textContent || "";
          let link = item.querySelector(".s-item__link")?.getAttribute("href") || "";
          const price = item.querySelector(".s-item__price")?.textContent || "";

          const match = link.match(/\/itm\/(\d+)/);
          if (match) link = `https://www.ebay.com/itm/${match[1]}`;

          return `<li><a href="${link}"><h3>${title}</h3><p>${price}</p></a></li>`;
        });

        return `<ul>${items.join("")}</ul>`;
      });

      allItemsHTML += pageHTML;
    }

    console.log("Scraping completed up to page 5");

    await browser.close();

    const response = await openai.chat.completions.create({
      model: "o1-mini-2024-09-12",
      messages: [
        {
          role: "user",
          content: `Given the following HTML structure, please extract the product information and return it in the following JSON format:

Example:
[
  {
    "p_name": "Nike Shoes", // string, Product Name
    "p_price": "120000", // number or string, Product Price
    "p_detail": "https://www.ebay.com/itm/235884909028" // string, Product Detail URL
  }
]

Please ensure that:
- "p_name" contains the product name.
- "p_price" contains the price, extracted as a number (if possible) or a string.
- "p_detail" contains the product detail page URL.

Return only the JSON response without any additional text.`
        },
        {
          role: "user",
          content: allItemsHTML
        }
      ]
    });

    const cleanedResponse = response.choices[0].message.content.replaceAll("```", "").replace("json", "");
    return NextResponse.json({ response: JSON.parse(cleanedResponse) }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
