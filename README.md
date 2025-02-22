# Scrape eBay Products with OpenAI

## Stack Used
- JavaScript
- Next.js
- Ant Design (Antd)
- OpenAI

## Default Model Used
- `o1-mini-2024-09-12`

## Installation
1. Rename `.env.example` to `.env`
2. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_KEY=your-api-key-here
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser to access the frontend.

## API Documentation
- **Route:** `POST /api/generate`
- **Request Body (Raw JSON):**
  ```json
  {
    "keyword": "your keyword, e.g K-ON"
  }
  ```
- **Response:** JSON formatted scraped data.

## Frontend Page
- Only one page (`/`) where users enter a keyword, submit the request, and copy the JSON result.

## Notes
- The results are **limited to 20** due to ChatGPT's slow response for large datasets. Change `OUTPUT_SIZE` in `.env` if you want more than 20 results.
- The scraper **fetches a maximum of 5 pages** for performance reasons. Change `PAGE_LIMIT` in `.env` if you want to scrape more than 5 pages.
  - **1 page = 60 results**
- To change the OpenAI model, modify **line 79** in `app/api/generate/route.js`.

