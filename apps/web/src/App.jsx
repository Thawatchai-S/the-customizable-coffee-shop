import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState('checking...');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status ?? 'unknown'))
      .catch(() => setStatus('unreachable'));
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center space-y-2">
        <h1 className="text-2xl font-bold text-amber-900">
          The Customizable Coffee Shop
        </h1>
        <p className="text-amber-700">Frontend is running.</p>
        <p className="text-sm text-gray-500">
          API health: <span className="font-mono">{status}</span>
        </p>
      </div>
    </div>
  );
}

export default App;
