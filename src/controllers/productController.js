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

async function checkProductExists(productId, restaurantId) {
  return await prisma.product.findFirst({
    where: {
      id: Number(productId),
      category: {
        restaurantId: Number(restaurantId),
      },
    },
    include: {
      category: {
        include: {
          restaurant: true,
        },
      },
    },
  });
}

exports.getProductById = (req, res) => {
  const { restaurantId, productId } = req.params;

  handleResponse(res, async () => {
    const product = await prisma.product.findFirst({
      where: {
        id: Number(productId),
        category: {
          restaurantId: Number(restaurantId),
        },
      },
    });

    if (!product) {
      throw new Error('Produto não encontrado neste restaurante!');
    }

    return product;
  });
};

exports.getProductsByRestaurant = (req, res) => {
  const { restaurantId } = req.params;
  const { page = 1, pageSize = 10 } = req.query;

  handleResponse(res, async () => {
    const parsedPage = Number(page);
    const parsedPageSize = Number(pageSize);

    const products = await prisma.product.findMany({
      where: {
        category: {
          restaurantId: Number(restaurantId),
        },
      },
      skip: (parsedPage - 1) * parsedPageSize,
      take: parsedPageSize,
      include: {
        category: true,
      },
    });

    return { products, currentPage: parsedPage, pageSize: parsedPageSize };
  });
};

exports.uploadProductImage = (req, res) => {
  const { productId } = req.params;

  handleResponse(res, async () => {
    if (!req.file) {
      throw new Error('Nenhum arquivo enviado!');
    }

    const imageUrl = path.join('uploads', req.file.filename);

    const updatedProduct = await prisma.product.update({
      where: { id: Number(productId) },
      data: { imageUrl },
    });

    return { message: 'Imagem enviada com sucesso!', product: updatedProduct };
  });
};

exports.createProduct = (req, res) => {
  const { categoryId } = req.params;
  const { name, description, price } = req.body;

  handleResponse(res, async () => {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId: Number(categoryId),
      },
    });

    return { message: 'Produto criado com sucesso!', product };
  });
};

exports.updateProduct = (req, res) => {
  const { productId } = req.params;
  const { name, description, price } = req.body;

  handleResponse(res, async () => {
    const product = await prisma.product.update({
      where: { id: Number(productId) },
      data: { name, description, price },
    });

    return { message: 'Produto atualizado com sucesso!', product };
  });
};

exports.deleteProduct = (req, res) => {
  const { productId, restaurantId } = req.params;
  const userId = req.userId;

  handleResponse(res, async () => {
    const product = await checkProductExists(productId, restaurantId);

    if (!product) {
      throw new Error('Produto não encontrado neste restaurante!');
    }

    if (product.category.restaurant.userId !== userId) {
      throw new Error('Você não tem permissão para deletar este produto!');
    }

    await prisma.product.delete({
      where: { id: Number(productId) },
    });

    return { message: 'Produto deletado com sucesso!' };
  });
};
