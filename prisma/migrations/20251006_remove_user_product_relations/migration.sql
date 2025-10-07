-- DropForeignKey
ALTER TABLE "Product"
DROP CONSTRAINT IF EXISTS "Product_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Product"
DROP CONSTRAINT IF EXISTS "Product_updatedBy_fkey";

-- AlterTable: Change createdBy from UUID to VARCHAR(255)
ALTER TABLE "Product"
ALTER COLUMN "createdBy" TYPE VARCHAR(255) USING "createdBy"::VARCHAR(255);

-- AlterTable: Change updatedBy from UUID to VARCHAR(255)
ALTER TABLE "Product"
ALTER COLUMN "updatedBy" TYPE VARCHAR(255) USING "updatedBy"::VARCHAR(255);