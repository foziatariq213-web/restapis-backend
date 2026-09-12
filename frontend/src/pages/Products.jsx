import { useEffect, useState } from 'react';
import api, { apiError, validationErrors } from '../api/client';

const emptyForm = { name: '', price: '', description: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState([]);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // PRACTICE TASK: GET /api/products — plain array ya { data: [...] } dono chalenge
  const load = async () => {
    setErrors([]);
    try {
      const res = await api.get('/products');
      setProducts(res.data.data ?? res.data);
    } catch (err) {
      setErrors([apiError(err)]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setNotice('');
    setBusy(true);
    try {
      if (editingId) {
        // PRACTICE TASK: PUT /api/products/{id}
        await api.put(`/products/${editingId}`, form);
        setNotice(`Product #${editingId} update ho gaya ✔`);
      } else {
        // PRACTICE TASK: POST /api/products
        await api.post('/products', form);
        setNotice('Product create ho gaya ✔');
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      const list = validationErrors(err);
      setErrors(list.length ? list : [apiError(err)]);
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name ?? '', price: p.price ?? '', description: p.description ?? '' });
    setNotice('');
  };

  const remove = async (id) => {
    if (!confirm(`Product #${id} delete karna hai?`)) return;
    setErrors([]);
    try {
      // PRACTICE TASK: DELETE /api/products/{id}
      await api.delete(`/products/${id}`);
      setNotice(`Product #${id} delete ho gaya ✔`);
      await load();
    } catch (err) {
      setErrors([apiError(err)]);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Products — REST CRUD Practice 📦</h2>
        <p className="muted">
          Yeh page <code>apiResource</code> ke charon operations use karta hai:{' '}
          <code>GET / POST / PUT / DELETE /api/products</code>. Jab tak aap yeh endpoints nahi
          banatin, neeche 404 wala message dikhega — wohi aap ka task hai!
        </p>

        {errors.length > 0 && (
          <div className="alert">
            {errors.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
        )}
        {notice && <div className="alert success">{notice}</div>}

        <form onSubmit={submit} className="row-form">
          <input name="name" placeholder="Product name" value={form.name} onChange={update} required />
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Price"
            value={form.price}
            onChange={update}
            required
          />
          <input
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={update}
          />
          <button className="btn btn-primary" disabled={busy}>
            {editingId ? `Update #${editingId}` : 'Add Product'}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>List ({products.length})</h3>
          <button className="btn btn-outline" onClick={load}>
            ↻ Refresh
          </button>
        </div>

        {products.length === 0 ? (
          <p className="muted">Koi product nahi — endpoint ban gaya ho to upar se add karo.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td className="muted">{p.description}</td>
                  <td className="actions">
                    <button className="btn btn-outline sm" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button className="btn btn-danger sm" onClick={() => remove(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
