const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

async function handleResponse(res, callback) {
  try {
    const result = await callback();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: 'Ocorreu um erro!', details: error.message });
  }
}

async function checkCategoryExists(restaurantId, categoryId) {
  return await prisma.category.findFirst({
    where: {
      id: Number(categoryId),
      restaurantId: Number(restaurantId),
    },
  });
}

exports.createCategory = (req, res) => {
  const { restaurantId } = req.params;
  const { name } = req.body;

  handleResponse(res, async () => {
    const category = await prisma.category.create({
      data: {
        name,
        restaurantId: Number(restaurantId),
      },
    });
    return { message: 'Categoria criada com sucesso!', category };
  });
};

exports.getCategoriesByRestaurant = (req, res) => {
  const { restaurantId } = req.params;

  handleResponse(res, async () => {
    const categories = await prisma.category.findMany({
      where: {
        restaurantId: Number(restaurantId),
      },
      include: {
        products: true,
      },
    });

    if (!categories || categories.length === 0) {
      throw new Error('Nenhuma categoria encontrada para este restaurante!');
    }

    return categories;
  });
};

exports.updateCategory = (req, res) => {
  const { restaurantId, categoryId } = req.params;
  const { name } = req.body;

  handleResponse(res, async () => {
    const category = await prisma.category.update({
      where: {
        id: Number(categoryId),
        restaurantId: Number(restaurantId),
      },
      data: { name },
    });
    return { message: 'Categoria atualizada com sucesso!', category };
  });
};

exports.deleteCategory = (req, res) => {
  const { restaurantId, categoryId } = req.params;

  handleResponse(res, async () => {
    const category = await checkCategoryExists(restaurantId, categoryId);

    if (!category) {
      throw new Error('Categoria não encontrada para este restaurante!');
    }

    await prisma.category.delete({
      where: {
        id: Number(categoryId),
      },
    });

    return { message: 'Categoria excluída com sucesso!' };
  });
};

exports.getCategoryById = (req, res) => {
  const { restaurantId, categoryId } = req.params;

  handleResponse(res, async () => {
    const category = await checkCategoryExists(restaurantId, categoryId);

    if (!category) {
      throw new Error('Categoria não encontrada para este restaurante!');
    }

    return category;
  });
};
