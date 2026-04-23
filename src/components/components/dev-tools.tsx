"use client";

import { Agentation } from "agentation";

function DevTools() {
  if (process.env.NODE_ENV !== "development") return null;
  return <Agentation />;
}

export { DevTools };
