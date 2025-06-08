// agents/DataAgent.jsx
// Purpose: Defines the DataAgent using the OpenAI Agents SDK with a Lucide React icon.
// It provides data analysis assistance only; it does not include a full interface.

import React from "react";
import OpenAI from "openai";
import { Agent } from "openai/agents";
import { BarChart2 } from "lucide-react";

// OpenAI client configured with API key from environment.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure the data-focused agent.
export const dataAgent = new Agent({
  client: openai,
  instructions: "You assist with simple data analysis tasks and explanations.",
  model: "gpt-4-turbo",
  tools: [],
});

// Icon component representing the agent.
export function DataAgentIcon() {
  return <BarChart2 />;
}
