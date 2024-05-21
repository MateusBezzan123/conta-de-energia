-- CreateTable
CREATE TABLE "Bill" (
    "id" SERIAL NOT NULL,
    "energyElectricQuantity" INTEGER,
    "energyElectricValue" DOUBLE PRECISION,
    "energySCEEEQuantity" INTEGER,
    "energySCEEEValue" DOUBLE PRECISION,
    "energyCompensatedQuantity" INTEGER,
    "energyCompensatedValue" DOUBLE PRECISION,
    "publicLightingContribution" DOUBLE PRECISION,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);
