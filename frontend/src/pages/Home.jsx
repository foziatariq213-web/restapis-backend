import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { apiError } from '../api/client';

export default function Home() {
  const [ping, setPing] = useState({ state: 'loading' });

  // GET /api/ping — backend zinda hai ya nahi
  useEffect(() => {
    api
      .get('/ping')
      .then((res) => setPing({ state: 'ok', data: res.data }))
      .catch((err) => setPing({ state: 'error', message: apiError(err) }));
  }, []);

  return (
    <div className="page">
      <section className="hero card">
        <h1>REST API Practice Playground 🎯</h1>
        <p className="muted">
          Yeh React frontend aap ki Laravel API practice ke liye bana hai. Har page ek endpoint ko
          call karta hai — jo endpoints abhi nahi bane, woh <strong>aap ki practice tasks</strong>{' '}
          hain. Poori list <code>PRACTICE-GUIDE.md</code> mein hai.
        </p>

        <div className={`api-status ${ping.state}`}>
          {ping.state === 'loading' && 'Checking API...'}
          {ping.state === 'ok' && (
            <>
              🟢 API connected — <code>GET /api/ping</code> → "{ping.data.message}" ({ping.data.time})
            </>
          )}
          {ping.state === 'error' && <>🔴 {ping.message}</>}
        </div>
      </section>

      <section className="grid">
        <div className="card">
          <h3>1. REST API (CRUD)</h3>
          <p className="muted">
            <Link to="/products">Products page</Link> full CRUD karta hai:{' '}
            <code>GET/POST/PUT/DELETE /api/products</code>. Yeh endpoints banana aap ka pehla task
            hai.
          </p>
        </div>
        <div className="card">
          <h3>2. Sanctum Auth</h3>
          <p className="muted">
            <Link to="/register">Register</Link> aur <Link to="/login">Login</Link> pages{' '}
            <code>POST /api/register</code> aur <code>POST /api/login</code> call karte hain aur
            token expect karte hain — <code>{'{ token, user }'}</code> shape mein.
          </p>
        </div>
        <div className="card">
          <h3>3. OAuth (Socialite)</h3>
          <p className="muted">
            Login page par "Continue with Google/GitHub" buttons hain. Callback ke baad Laravel ko
            user <code>/oauth/callback?token=...</code> par redirect karna hai.
          </p>
        </div>
      </section>
    </div>
  );
}
