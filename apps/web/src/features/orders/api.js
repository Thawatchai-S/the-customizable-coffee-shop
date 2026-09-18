export async function placeOrder(drinks) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ drinks }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.error?.message ?? 'Failed to place order');
    error.issues = data.error?.issues ?? [];
    throw error;
  }

  return data;
}
