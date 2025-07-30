// frontend/pages/index.tsx
// Phone Anxiety Practice App - Main Interface

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Activity, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:8000/hello')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => {
        console.error('Error:', error);
        setMessage('Could not connect to backend');
      });
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>
        <Activity style={{ verticalAlign: 'middle' }} /> AI SAAS Template
      </h1>
      <p>{message}</p>
      
      <div style={{ marginTop: '3rem' }}>
        <h2>Available Apps</h2>
        <Link href="/phone-anxiety">
          <a style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 2rem',
            background: '#667eea',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            marginTop: '1rem'
          }}>
            <Phone size={20} />
            Phone Anxiety Support App
          </a>
        </Link>
      </div>
    </main>
  );
}
