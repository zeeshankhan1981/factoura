import prisma from '../prismaClient.js';

export const createArticle = async (req, res) => {
  const { title, content } = req.body;
  const authorId = req.user.userId;

  console.log('Creating article with title:', title);
  console.log('Creating article with content:', content);
  console.log('Creating article with authorId:', authorId);

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  try {
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        authorId,
      },
    });
    console.log('Article created successfully:', newArticle);
    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: "Could not create article." });
  }
};