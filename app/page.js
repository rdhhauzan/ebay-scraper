"use client";

import { useState } from "react";
import { Input, Button, message } from "antd";
import "@/app/globals.css";
import axios from "axios";
import { CopyOutlined } from "@ant-design/icons";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  async function clickSubmit() {
    if (!keyword) {
      messageApi.open({
        type: "error",
        content: "Keyword is required",
      });

      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/generate", { keyword });

      const formattedResponse = JSON.stringify(response.data.response, null, 2);
      setResponseData(formattedResponse);
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: "error",
        content: "Failed to fetch data",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function copyToClipboard() {
    if (responseData) {
      navigator.clipboard.writeText(responseData);
      messageApi.open({
        type: "success",
        content: "Copied to clipboard!",
      });
    }
  }

  return (
    <div className="flex flex-col items-center mt-5 min-h-screen bg-black p-8 gap-8">
      {contextHolder}
      <h1 className="text-2xl text-white font-bold text-center">
        Scrape eBay Products in an Easy Way
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
          onClick={clickSubmit}
          loading={isLoading}
        >
          Submit
        </Button>
      </div>

      {responseData && (
        <div className="flex flex-col w-full max-w-md gap-2">
          <Input.TextArea
            className="custom-input text-sm p-3 h-40 text-white outline-none"
            value={responseData}
            disabled
            autoSize={{ minRows: 4, maxRows: 10 }}
          />
          <Button
            className="custom-button w-full flex items-center justify-center gap-2"
            onClick={copyToClipboard}
          >
            <CopyOutlined />
            Copy Response
          </Button>
        </div>
      )}
    </div>
  );
}
