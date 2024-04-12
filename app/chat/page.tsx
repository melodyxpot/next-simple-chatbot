"use client";

import Markdown from "@/components/Markdown";
import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  return (
    <main className="flex flex-col h-screen overflow-hidden  py-10 w-full max-w-7xl mx-auto">
      <h1 className="text-center text-[30px] font-extrabold ">
        Simple AI Chatbot with Shiki
      </h1>
      <div className="flex-1 overflow-y-auto px-24">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap mb-3">
            <p className="font-bold mb-1">
              {m.role === "user" ? "User: " : "AI: "}
            </p>
            <Markdown
              content={m.content}
              message={m}
              messages={messages}
              isLatestMessage={m.id === messages[messages.length - 1].id}
              isGenerating={isLoading}
              showCursor
            />
          </div>
        ))}
      </div>
      <div className="px-24">
        <form onSubmit={handleSubmit}>
          <input
            className="p-2 border w-full border-gray-300 rounded shadow-xl outline-none"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </main>
  );
}
