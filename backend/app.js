const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let products = [
  { id: '1', title: 'iPhone 15 Pro', price: 99999 },
  { id: '2', title: 'Samsung Galaxy S24', price: 89999 },
  { id: '3', title: 'MacBook Air M2', price: 129999 },
  { id: '4', title: 'AirPods Pro 2', price: 24999 },
  { id: '5', title: 'Sony WH-1000XM5', price: 39999 },
  { id: '6', title: 'iPad Pro 12.9"', price: 119999 },
  { id: '7', title: 'Apple Watch Ultra', price: 79999 },
  { id: '8', title: 'Dell XPS 13', price: 109999 },
  { id: '9', title: 'Nintendo Switch OLED', price: 34999 },
  { id: '10', title: 'PS5 Slim', price: 59999 }
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
  const { title, price } = req.body;
  if (!title || !price || price <= 0) {
    return res.status(400).json({ error: 'Название и цена обязательны' });
  }
  const newProduct = { id: nanoid(), title, price: Number(price) };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.patch('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Товар не найден' });
  
  const { title, price } = req.body;
  if (title) products[index].title = title;
  if (price) products[index].price = Number(price);
  
  res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Товар не найден' });
  
  products.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend запущен на http://localhost:${PORT}`);
});
