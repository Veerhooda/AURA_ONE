-- CreateTable
CREATE TABLE "MapNode" (
    "id" SERIAL NOT NULL,
    "label" TEXT,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "floor" INTEGER NOT NULL DEFAULT 1,
    "isAccessible" BOOLEAN NOT NULL DEFAULT true,
    "type" TEXT NOT NULL DEFAULT 'corridor',

    CONSTRAINT "MapNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapEdge" (
    "id" SERIAL NOT NULL,
    "fromNodeId" INTEGER NOT NULL,
    "toNodeId" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "isAccessible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MapEdge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MapEdge" ADD CONSTRAINT "MapEdge_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "MapNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapEdge" ADD CONSTRAINT "MapEdge_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "MapNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
