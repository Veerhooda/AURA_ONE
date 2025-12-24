-- CreateTable
CREATE TABLE "conflict_resolution_logs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "userRole" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "expectedVersion" INTEGER NOT NULL,
    "currentVersion" INTEGER NOT NULL,
    "conflictFields" JSONB NOT NULL,
    "yourData" JSONB NOT NULL,
    "serverData" JSONB NOT NULL,
    "resolvedData" JSONB NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,

    CONSTRAINT "conflict_resolution_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "conflict_resolution_logs_userId_detectedAt_idx" ON "conflict_resolution_logs"("userId", "detectedAt");

-- CreateIndex
CREATE INDEX "conflict_resolution_logs_entityType_entityId_idx" ON "conflict_resolution_logs"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "conflict_resolution_logs" ADD CONSTRAINT "conflict_resolution_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
