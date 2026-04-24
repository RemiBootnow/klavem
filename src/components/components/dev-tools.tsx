"use client";

import { Agentation } from "agentation";

function DevTools() {
  if (process.env.NODE_ENV !== "development") return null;
  return <Agentation endpoint="http://localhost:4747" />;
}

export { DevTools };
