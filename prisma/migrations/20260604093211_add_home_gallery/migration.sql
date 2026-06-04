-- CreateTable
CREATE TABLE "HomeImage" (
    "id" SERIAL NOT NULL,
    "position" INTEGER NOT NULL,
    "src" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomeImage_position_key" ON "HomeImage"("position");
