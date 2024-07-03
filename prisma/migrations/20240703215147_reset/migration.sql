-- CreateTable
CREATE TABLE "Bumper" (
    "id" SERIAL NOT NULL,
    "args" INTEGER[],
    "position" INTEGER[],
    "color" TEXT NOT NULL,

    CONSTRAINT "Bumper_pkey" PRIMARY KEY ("id")
);
