import { randomBytes } from "node:crypto";

import type { Visitor } from "@prisma/client";
import type { ResponseCookies } from "next/dist/server/web/spec-extension/cookies";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export const VISITOR_COOKIE_NAME = "auto-nexus-visitor";
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const logFallback = (context: string, error: unknown) => {
  console.warn(`[prisma:fallback] ${context}`, error);
};

const buildMockVisitor = (token: string): Visitor => {
  const now = new Date();
  return {
    id: `mock-${token}`,
    sessionToken: token,
    createdAt: now,
    updatedAt: now,
  } as unknown as Visitor;
};

export async function readVisitorTokenFromCookies(): Promise<string | undefined> {
  const store = await cookies();
  const cookie = store.get(VISITOR_COOKIE_NAME);
  return cookie?.value;
}

export async function getVisitorByToken(token: string): Promise<Visitor | null> {
  if (!token) {
    return null;
  }

  try {
    return await prisma.visitor.findUnique({
      where: {
        sessionToken: token,
      },
    });
  } catch (error) {
    logFallback("fetch visitor by token", error);
    return null;
  }
}

export async function createVisitorSession(): Promise<{
  visitor: Visitor;
  token: string;
}> {
  const token = randomBytes(24).toString("hex");

  try {
    const visitor = await prisma.visitor.create({
      data: {
        sessionToken: token,
      },
    });

    return { visitor, token };
  } catch (error) {
    logFallback("create visitor session", error);
    return { visitor: buildMockVisitor(token), token };
  }
}

export function attachVisitorCookie(cookieStore: ResponseCookies, token: string): void {
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
