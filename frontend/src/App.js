import { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    "accept": "application/json"
  }
});

export default function App() {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      alert("Ошибка запроса");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const parsedPrice = parseFloat(price);

    if (!trimmedTitle || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      alert("Название и цена (>0) обязательны");
      return;
    }

    try {
      if (editingId) {
        await apiClient.patch(`/products/${editingId}`, { title: trimmedTitle, price: parsedPrice });
      } else {
        await apiClient.post("/products", { title: trimmedTitle, price: parsedPrice });
      }
      setTitle("");
      setPrice("");
      setEditingId(null);
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Ошибка запроса");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setPrice(String(product.price));
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить товар?')) return;
    try {
      await apiClient.delete(`/products/${id}`);
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Ошибка запроса");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setPrice("");
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="app">
      <header className="header">
        <h1>Кобылянский</h1>
      </header>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Название товара"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          required
        />
        <input
          type="number"
          placeholder="Цена"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          step="0.01"
          className="input"
          required
        />
        <button type="submit" className="btn primary">
          {editingId ? "Обновить" : "Создать"}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancel} className="btn secondary">
            Отмена
          </button>
        )}
      </form>

      <div className="products">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-info">
              <h3>{product.title}</h3>
              <div className="price">{product.price.toLocaleString()} ₽</div>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(product)} className="btn edit">Редактировать</button>
              <button onClick={() => handleDelete(product.id)} className="btn delete">Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
