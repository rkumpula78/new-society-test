// agents/ChatAgent.jsx
// Purpose: Defines the ChatAgent for general conversation using the OpenAI Agents SDK.
// Only the basic agent configuration and a Lucide icon component are included.

import React from "react";
import OpenAI from "openai";
import { Agent } from "openai/agents";
import { MessageCircle } from "lucide-react";

// OpenAI client with API key from environment.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generic chat agent.
export const chatAgent = new Agent({
  client: openai,
  instructions: "You provide friendly and concise responses to user questions.",
  model: "gpt-4-turbo",
  tools: [],
});

// Icon component for the chat agent.
export function ChatAgentIcon() {
  return <MessageCircle />;
}
