// agents/ResearchAgent.jsx
// Purpose: Defines the ResearchAgent with the OpenAI Agents SDK. Includes a React icon using Lucide.
// This file does not implement a full UI. It only configures the agent and exports an icon.

import React from "react";
import OpenAI from "openai";
import { Agent } from "openai/agents";
import { Search } from "lucide-react";

// Create OpenAI client. The API key must be provided through env variables.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure an agent specialized in answering research questions.
export const researchAgent = new Agent({
  client: openai,
  instructions: "You help users gather information and summarize findings.",
  model: "gpt-4-turbo",
  tools: [],
});

// Minimal icon component for the agent.
export function ResearchAgentIcon() {
  return <Search />;
}
