import prisma from './prismaClient.js';

async function listAllArticles() {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: true
      }
    });
    
    console.log('All articles in the database:');
    if (articles.length === 0) {
      console.log('No articles found.');
    } else {
      articles.forEach(article => {
        console.log(`ID: ${article.id}`);
        console.log(`Title: ${article.title}`);
        console.log(`Author: ${article.author.username} (ID: ${article.authorId})`);
        console.log(`Created: ${article.createdAt}`);
        console.log(`Content length: ${article.content.length} characters`);
        console.log('-----------------------------------');
      });
      console.log(`Total articles: ${articles.length}`);
    }
  } catch (error) {
    console.error('Error listing articles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listAllArticles();
