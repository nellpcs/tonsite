-- CreateTable
CREATE TABLE "Visite" (
    "id" TEXT NOT NULL,
    "boutiqueId" TEXT NOT NULL,
    "produitId" TEXT,
    "visiteurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visite_boutiqueId_createdAt_idx" ON "Visite"("boutiqueId", "createdAt");

-- CreateIndex
CREATE INDEX "Visite_boutiqueId_visiteurId_createdAt_idx" ON "Visite"("boutiqueId", "visiteurId", "createdAt");

-- CreateIndex
CREATE INDEX "Visite_produitId_createdAt_idx" ON "Visite"("produitId", "createdAt");

-- AddForeignKey
ALTER TABLE "Visite" ADD CONSTRAINT "Visite_boutiqueId_fkey" FOREIGN KEY ("boutiqueId") REFERENCES "Boutique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visite" ADD CONSTRAINT "Visite_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
