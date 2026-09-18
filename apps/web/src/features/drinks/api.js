export async function fetchMasterData() {
  const res = await fetch('/api/master-data');
  if (!res.ok) {
    throw new Error('Failed to load master data');
  }
  return res.json();
}

export async function buildDrink(payload) {
  const res = await fetch('/api/drinks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.error?.message ?? 'Failed to build drink');
    error.issues = data.error?.issues ?? [];
    throw error;
  }

  return data;
}
