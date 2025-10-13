export const isStaticDemoMode =
  process.env.STATIC_DEMO_MODE === "true" ||
  process.env.NEXT_PUBLIC_STATIC_DEMO_MODE === "true";

export type DemoAction = "analytics" | "favorites" | "uploads";
