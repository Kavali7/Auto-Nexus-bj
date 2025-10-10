import { randomBytes } from "node:crypto";

import type { Visitor } from "@prisma/client";
import type { ResponseCookies } from "next/dist/server/web/spec-extension/cookies";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export const VISITOR_COOKIE_NAME = "auto-nexus-visitor";
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function readVisitorTokenFromCookies(): string | undefined {
  const store = cookies();
  const cookie = store.get(VISITOR_COOKIE_NAME);
  return cookie?.value;
}

export async function getVisitorByToken(token: string): Promise<Visitor | null> {
  if (!token) {
    return null;
  }

  return prisma.visitor.findUnique({
    where: {
      sessionToken: token,
    },
  });
}

export async function createVisitorSession(): Promise<{
  visitor: Visitor;
  token: string;
}> {
  const token = randomBytes(24).toString("hex");
  const visitor = await prisma.visitor.create({
    data: {
      sessionToken: token,
    },
  });

  return { visitor, token };
}

export function attachVisitorCookie(
  cookieStore: ResponseCookies,
  token: string,
): void {
  cookieStore.set({
    name: VISITOR_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: VISITOR_COOKIE_MAX_AGE,
    path: "/",
  });
}
