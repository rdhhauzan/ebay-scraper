"use client";

import { useState } from "react";
import { Input, Button } from "antd";
import "@/app/globals.css";

export default function Home() {
  const [keyword, setKeyword] = useState("");

  return (
    <div className="flex flex-col items-center mt-5 min-h-screen bg-black p-8 gap-8">
      <h1 className="text-2xl text-white font-bold text-center">
        Scrape eBay Products in Easy Way
      </h1>
      <div className="flex w-full max-w-md items-center gap-2">
        <Input
          className="custom-input flex-1 p-3 text-white outline-none"
          placeholder="Enter keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button
          className="custom-button px-5 py-2 text-white"
          onClick={() => alert(`Searching for: ${keyword}`)}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
