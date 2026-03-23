-- CreateTable: VariantEvent — A/B copy-test telemetry (Summer 2026)
CREATE TABLE "VariantEvent" (
    "id"         TEXT NOT NULL,
    "sessionId"  TEXT NOT NULL,
    "productId"  TEXT NOT NULL,
    "variantKey" TEXT NOT NULL,
    "event"      TEXT NOT NULL,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VariantEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VariantEvent_productId_variantKey_event_idx" ON "VariantEvent"("productId", "variantKey", "event");
CREATE INDEX "VariantEvent_createdAt_idx" ON "VariantEvent"("createdAt");
