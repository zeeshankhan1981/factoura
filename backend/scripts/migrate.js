import { PrismaClient } from '@prisma/client';
import logger from '../src/utils/logger.js';

const prisma = new PrismaClient();

async function main() {
    try {
        logger.info('Starting database migration...');
        
        // Check database connection
        await prisma.$queryRaw`SELECT 1`;
        logger.info('Database connection successful');
        
        // Apply migrations
        logger.info('Applying migrations...');

        // Add new columns to Article table
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "Article" 
            ADD COLUMN IF NOT EXISTS "sentimentScore" FLOAT,
            ADD COLUMN IF NOT EXISTS "emotionalTone" TEXT,
            ADD COLUMN IF NOT EXISTS "objectivityScore" FLOAT,
            ADD COLUMN IF NOT EXISTS "analysisStatus" TEXT DEFAULT 'pending',
            ADD COLUMN IF NOT EXISTS "analysisUpdatedAt" TIMESTAMP
        `);
        
        // Create Tag table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Tag" (
                "id" SERIAL PRIMARY KEY,
                "name" TEXT UNIQUE NOT NULL,
                "type" TEXT,
                "relevance" FLOAT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create ArticleTag relation table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "_ArticleToTag" (
                "A" INTEGER NOT NULL REFERENCES "Article"("id") ON DELETE CASCADE,
                "B" INTEGER NOT NULL REFERENCES "Tag"("id") ON DELETE CASCADE,
                PRIMARY KEY ("A", "B")
            )
        `);
        
        // Create AnalysisLog table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "AnalysisLog" (
                "id" SERIAL PRIMARY KEY,
                "articleId" INTEGER NOT NULL REFERENCES "Article"("id") ON DELETE CASCADE,
                "service" TEXT NOT NULL,
                "status" TEXT NOT NULL,
                "result" JSONB,
                "error" TEXT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Add columns to User table
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "User" 
            ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'user',
            ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);
        
        logger.info('Migrations applied successfully');
        
        // Create indexes
        logger.info('Creating indexes...');
        
        await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Article_analysisStatus_idx" ON "Article"("analysisStatus")`);
        await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Article_analysisUpdatedAt_idx" ON "Article"("analysisUpdatedAt")`);
        await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Tag_name_idx" ON "Tag"("name")`);
        await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "AnalysisLog_articleId_idx" ON "AnalysisLog"("articleId")`);
        await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "AnalysisLog_service_idx" ON "AnalysisLog"("service")`);
        await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "AnalysisLog_status_idx" ON "AnalysisLog"("status")`);
        
        logger.info('Indexes created successfully');
        
    } catch (error) {
        logger.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .then(() => {
        logger.info('Migration completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        logger.error('Migration failed:', error);
        process.exit(1);
    }); 