import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import {
  attachVisitorCookie,
  createVisitorSession,
  getVisitorByToken,
  VISITOR_COOKIE_NAME,
} from "@/server/visitors";
import { getFavoriteSummariesByToken } from "@/server/favorites";

export async function GET(): Promise<NextResponse> {
  const store = await cookies();
  const token = store.get(VISITOR_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ favorites: [] });
  }

  const favorites = await getFavoriteSummariesByToken(token);
  return NextResponse.json({ favorites });
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as { vehicleId?: string };
  if (!body.vehicleId) {
    return NextResponse.json(
      { error: "vehicleId is required" },
      { status: 400 },
    );
  }

  const store = await cookies();
  let token = store.get(VISITOR_COOKIE_NAME)?.value;
  let visitor = token ? await getVisitorByToken(token) : null;
  let createdSession = false;

  if (!visitor) {
    const session = await createVisitorSession();
    visitor = session.visitor;
    token = session.token;
    createdSession = true;
  }

  await prisma.favorite.upsert({
    where: {
      visitorId_vehicleId: {
        vehicleId: body.vehicleId,
        visitorId: visitor.id,
      },
    },
    update: {},
    create: {
      visitorId: visitor.id,
      vehicleId: body.vehicleId,
    },
  });

  const favorites = await getFavoriteSummariesByToken(token!);
  const response = NextResponse.json({ favorites });

  if (createdSession && token) {
    attachVisitorCookie(response.cookies, token);
  }

  return response;
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as { vehicleId?: string };
  if (!body.vehicleId) {
    return NextResponse.json(
      { error: "vehicleId is required" },
      { status: 400 },
    );
  }

  const store = await cookies();
  const token = store.get(VISITOR_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ favorites: [] });
  }

  const visitor = await getVisitorByToken(token);
  if (!visitor) {
    return NextResponse.json({ favorites: [] });
  }

  try {
    await prisma.favorite.delete({
      where: {
        visitorId_vehicleId: {
          visitorId: visitor.id,
          vehicleId: body.vehicleId,
        },
      },
    });
  } catch (error) {
    console.warn("Favorite delete failed", error);
  }

  const favorites = await getFavoriteSummariesByToken(token);
  return NextResponse.json({ favorites });
}
