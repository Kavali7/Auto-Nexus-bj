import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { Prisma } from "@prisma/client";
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

  const store = await cookies();
  let token = store.get(VISITOR_COOKIE_NAME)?.value;
  let visitor = token ? await getVisitorByToken(token) : null;
  let createdSession = false;
  let payload: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined;

  if (body.payload === undefined) {
    payload = undefined;
  } else if (body.payload === null) {
    payload = Prisma.JsonNull;
  } else {
    payload = body.payload as Prisma.InputJsonValue;
  }

  if (!visitor) {
    const session = await createVisitorSession();
    visitor = session.visitor;
    token = session.token;
    createdSession = true;
  }

  await prisma.analyticsEvent.create({
    data: {
      event: body.event,
      ...(payload !== undefined ? { payload } : {}),
      visitorId: visitor?.id,
    },
  });

  const response = NextResponse.json({ ok: true });
  if (createdSession && token) {
    attachVisitorCookie(response.cookies, token);
  }
  return response;
}
