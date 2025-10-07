-- AlterTable: Rename createdBy to createdById and change type back to UUID
ALTER TABLE "Product" RENAME COLUMN "createdBy" TO "createdById";

ALTER TABLE "Product" 
ALTER COLUMN "createdById" DROP DEFAULT,
ALTER COLUMN "createdById" TYPE UUID USING "createdById"::UUID;

-- AlterTable: Rename updatedBy to updatedById and change type back to UUID
ALTER TABLE "Product" RENAME COLUMN "updatedBy" TO "updatedById";

ALTER TABLE "Product" 
ALTER COLUMN "updatedById" DROP DEFAULT,
ALTER COLUMN "updatedById" TYPE UUID USING "updatedById"::UUID;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Product_createdById_idx" ON "Product" ("createdById");

CREATE INDEX IF NOT EXISTS "Product_updatedById_idx" ON "Product" ("updatedById");

-- AddForeignKey: Add foreign key constraint for createdById
ALTER TABLE "Product"
ADD CONSTRAINT "Product_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: Add foreign key constraint for updatedById
ALTER TABLE "Product"
ADD CONSTRAINT "Product_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;