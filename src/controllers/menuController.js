const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

exports.createMenu = async (req, res) => {
  const { restaurantId } = req.params;
  const { categories } = req.body;

  try {
    const categoryPromises = categories.map(category =>
      prisma.category.create({
        data: {
          name: category.name,
          restaurantId: Number(restaurantId),
          products: {
            create: category.products.map(product => ({
              name: product.name,
              description: product.description,
              price: product.price,
            })),
          },
        },
      })
    );

    await Promise.all(categoryPromises);

    res.status(201).json({ message: 'Menu criado com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: 'Falha na criação do menu!', details: error.message });
  }
};

exports.getMenu = async (req, res) => {
  const { restaurantId } = req.params;
  const { page = 1, pageSize = 10 } = req.query;

  try {
    const parsedPage = Number(page);
    const parsedPageSize = Number(pageSize);

    const categories = await prisma.category.findMany({
      where: { restaurantId: Number(restaurantId) },
      include: { products: true },
      skip: (parsedPage - 1) * parsedPageSize,
      take: parsedPageSize,
    });

    res.status(200).json({ categories, currentPage: parsedPage, pageSize: parsedPageSize });
  } catch (error) {
    res.status(400).json({ error: 'Falha ao buscar o menu!', details: error.message });
  }
};

exports.uploadProductImage = async (req, res) => {
  const { productId } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado!' });
    }

    const imageUrl = path.join('uploads', req.file.filename);

    const updatedProduct = await prisma.product.update({
      where: { id: Number(productId) },
      data: { imageUrl }
    });

    res.status(200).json({ message: 'Imagem enviada com sucesso!', product: updatedProduct });
  } catch (error) {
    res.status(400).json({ error: 'Falha ao enviar a imagem!', details: error.message });
  }
};
