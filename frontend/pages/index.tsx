// frontend/pages/index.tsx
// this page renders the main landing page of the SAAS template.
// it is not a complex dashboard or production ready code.

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Activity } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function HomePage() {
  const [message, setMessage] = useState('');

  // fetch a welcome message from Supabase on load
  useEffect(() => {
    async function loadMessage() {
      const { data } = await supabase.from('messages').select('text').limit(1).single();
      setMessage(data?.text || 'Hello World');
    }

    loadMessage();
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>
        <Activity style={{ verticalAlign: 'middle' }} /> AI SAAS Template
      </h1>
      <p>{message}</p>
    </main>
  );
}
