import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

class DatabaseService {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async connect() {
        try {
            await this.prisma.$connect();
            logger.info('Database connected successfully');
        } catch (error) {
            logger.error('Database connection error:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await this.prisma.$disconnect();
            logger.info('Database disconnected successfully');
        } catch (error) {
            logger.error('Database disconnection error:', error);
            throw error;
        }
    }

    // Article operations
    async createArticle(articleData) {
        try {
            const article = await this.prisma.article.create({
                data: {
                    ...articleData,
                    tags: {
                        connect: articleData.tags?.map(tag => ({ name: tag }))
                    }
                },
                include: {
                    tags: true
                }
            });
            return article;
        } catch (error) {
            logger.error('Error creating article:', error);
            throw error;
        }
    }

    async updateArticleAnalysis(articleId, analysisData) {
        try {
            const article = await this.prisma.article.update({
                where: { id: articleId },
                data: {
                    sentimentScore: analysisData.sentimentScore,
                    emotionalTone: analysisData.emotionalTone,
                    objectivityScore: analysisData.objectivityScore,
                    analysisStatus: 'completed',
                    analysisUpdatedAt: new Date(),
                    tags: {
                        connect: analysisData.tags?.map(tag => ({ name: tag }))
                    }
                },
                include: {
                    tags: true
                }
            });
            return article;
        } catch (error) {
            logger.error('Error updating article analysis:', error);
            throw error;
        }
    }

    async logAnalysis(articleId, service, status, result, error = null) {
        try {
            const log = await this.prisma.analysisLog.create({
                data: {
                    articleId,
                    service,
                    status,
                    result,
                    error
                }
            });
            return log;
        } catch (error) {
            logger.error('Error logging analysis:', error);
            throw error;
        }
    }

    // Tag operations
    async getOrCreateTags(tagNames) {
        try {
            const tags = await Promise.all(
                tagNames.map(async (name) => {
                    return this.prisma.tag.upsert({
                        where: { name },
                        update: {},
                        create: { name }
                    });
                })
            );
            return tags;
        } catch (error) {
            logger.error('Error getting/creating tags:', error);
            throw error;
        }
    }

    // Health check
    async checkHealth() {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return { status: 'healthy' };
        } catch (error) {
            logger.error('Database health check failed:', error);
            return { status: 'unhealthy', error: error.message };
        }
    }
}

const databaseService = new DatabaseService();
export default databaseService; 