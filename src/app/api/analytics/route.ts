import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import {
  attachVisitorCookie,
  createVisitorSession,
  getVisitorByToken,
  VISITOR_COOKIE_NAME,
} from "@/server/visitors";

type AnalyticsPayload = {
  event?: string;
  payload?: unknown;
};

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as AnalyticsPayload;
  if (!body.event) {
    return NextResponse.json({ error: "event is required" }, { status: 400 });
  }

  const store = cookies();
  let token = store.get(VISITOR_COOKIE_NAME)?.value;
  let visitor = token ? await getVisitorByToken(token) : null;
  let createdSession = false;

  if (!visitor) {
    const session = await createVisitorSession();
    visitor = session.visitor;
    token = session.token;
    createdSession = true;
  }

  await prisma.analyticsEvent.create({
    data: {
      event: body.event,
      payload: body.payload ?? null,
      visitorId: visitor?.id,
    },
  });

  const response = NextResponse.json({ ok: true });
  if (createdSession && token) {
    attachVisitorCookie(response.cookies, token);
  }
  return response;
}
