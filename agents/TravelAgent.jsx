// agents/TravelAgent.jsx
// Purpose: Defines the TravelAgent with the OpenAI Agents SDK and a Lucide icon.
// This code only sets up the agent and an icon component; no full UI is provided.

import React from "react";
import OpenAI from "openai";
import { Agent } from "openai/agents";
import { Plane } from "lucide-react";

// OpenAI client using API key from environment.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Agent specialized in travel recommendations.
export const travelAgent = new Agent({
  client: openai,
  instructions: "You plan trips and give concise travel advice.",
  model: "gpt-4-turbo",
  tools: [],
});

// Icon component for the travel agent.
export function TravelAgentIcon() {
  return <Plane />;
}
