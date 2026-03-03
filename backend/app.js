const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let products = [
  {
    id: nanoid(),
    title: 'iPhone 15 Pro',
    category: 'Смартфоны',
    description: 'Флагманский смартфон с OLED-дисплеем и камерой Pro.',
    price: 99999,
    stock: 5
  },
  {
    id: nanoid(),
    title: 'Samsung Galaxy S24',
    category: 'Смартфоны',
    description: 'Мощный Android-смартфон с отличной камерой.',
    price: 89999,
    stock: 8
  },
  {
    id: nanoid(),
    title: 'MacBook Air M2',
    category: 'Ноутбуки',
    description: 'Лёгкий ноутбук на чипе M2 для работы и учёбы.',
    price: 129999,
    stock: 3
  },
  {
    id: nanoid(),
    title: 'AirPods Pro 2',
    category: 'Аксессуары',
    description: 'Беспроводные наушники с активным шумоподавлением.',
    price: 24999,
    stock: 15
  },
  {
    id: nanoid(),
    title: 'Sony WH-1000XM5',
    category: 'Наушники',
    description: 'Полноразмерные наушники с лучшим ANC.',
    price: 39999,
    stock: 7
  },
  {
    id: nanoid(),
    title: 'iPad Pro 12.9"',
    category: 'Планшеты',
    description: 'Планшет с большим дисплеем для творчества и работы.',
    price: 119999,
    stock: 4
  },
  {
    id: nanoid(),
    title: 'Apple Watch Ultra',
    category: 'Часы',
    description: 'Наручные смарт-часы для спорта и путешествий.',
    price: 79999,
    stock: 6
  },
  {
    id: nanoid(),
    title: 'Dell XPS 13',
    category: 'Ноутбуки',
    description: 'Компактный ультрабук с тонкими рамками.',
    price: 109999,
    stock: 2
  },
  {
    id: nanoid(),
    title: 'Nintendo Switch OLED',
    category: 'Приставки',
    description: 'Игровая консоль с ярким OLED-экраном.',
    price: 34999,
    stock: 10
  },
  {
    id: nanoid(),
    title: 'PlayStation 5 Slim',
    category: 'Приставки',
    description: 'Новая версия игровой приставки от Sony.',
    price: 59999,
    stock: 1
  }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Товар не найден' });
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const { title, category, description, price, stock } = req.body;

  if (!title || !category || !description ||
      typeof price !== 'number' || price <= 0 ||
      !Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({ error: 'Неверные данные товара' });
  }

  const newProduct = {
    id: nanoid(),
    title,
    category,
    description,
    price,
    stock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.patch('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Товар не найден' });

  const { title, category, description, price, stock } = req.body;

  if (title !== undefined) product.title = title;
  if (category !== undefined) product.category = category;
  if (description !== undefined) product.description = description;
  if (price !== undefined) {
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Некорректная цена' });
    }
    product.price = price;
  }
  if (stock !== undefined) {
    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({ error: 'Некорректный остаток' });
    }
    product.stock = stock;
  }

  res.json(product);
});

// DELETE /api/products/:id
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Товар не найден' });

  products.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend запущен на http://localhost:${PORT}`);
});
