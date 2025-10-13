import { NextResponse } from "next/server";

type AnalyticsPayload = {
  event?: string;
  payload?: unknown;
};

const DEMO_MESSAGE =
  "Demo mode: analytics events are simulated. Persistence will be enabled once Supabase is connected.";

export async function POST(request: Request): Promise<NextResponse> {
  let body: AnalyticsPayload = {};

  try {
    body = (await request.json()) as AnalyticsPayload;
  } catch {
    body = {};
  }

  if (!body.event) {
    return NextResponse.json(
      { error: "event is required" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      demo: true,
      message: DEMO_MESSAGE,
    },
    { status: 202, headers: { "Cache-Control": "no-store" } },
  );
}
