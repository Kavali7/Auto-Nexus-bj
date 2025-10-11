BEGIN;

-- Add enum for vehicle media classification.
CREATE TYPE "VehicleMediaKind" AS ENUM (
  'STANDARD',
  'EXTERIOR',
  'INTERIOR',
  'DETAIL',
  'PANORAMA',
  'WALKAROUND'
);

-- Extend Vehicle with virtual tour URL metadata.
ALTER TABLE "Vehicle"
  ADD COLUMN "virtualTourUrl" TEXT;

-- Store the media kind for each vehicle photo.
ALTER TABLE "VehiclePhoto"
  ADD COLUMN "kind" "VehicleMediaKind" NOT NULL DEFAULT 'STANDARD';

-- Visitor session tracking support.
CREATE TABLE "Visitor" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- Favoriting vehicles by visitors.
CREATE TABLE "Favorite" (
  "id" TEXT NOT NULL,
  "visitorId" TEXT NOT NULL,
  "vehicleId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- Event analytics logging.
CREATE TABLE "AnalyticsEvent" (
  "id" TEXT NOT NULL,
  "visitorId" TEXT,
  "event" TEXT NOT NULL,
  "payload" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- Enforce unique visitor session tokens.
CREATE UNIQUE INDEX "Visitor_sessionToken_key"
  ON "Visitor" ("sessionToken");

-- Ensure a visitor can favorite a vehicle once.
CREATE UNIQUE INDEX "Favorite_visitorId_vehicleId_key"
  ON "Favorite" ("visitorId", "vehicleId");

-- Foreign-key relationships.
ALTER TABLE "Favorite"
  ADD CONSTRAINT "Favorite_visitorId_fkey"
  FOREIGN KEY ("visitorId") REFERENCES "Visitor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Favorite"
  ADD CONSTRAINT "Favorite_vehicleId_fkey"
  FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AnalyticsEvent"
  ADD CONSTRAINT "AnalyticsEvent_visitorId_fkey"
  FOREIGN KEY ("visitorId") REFERENCES "Visitor" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
