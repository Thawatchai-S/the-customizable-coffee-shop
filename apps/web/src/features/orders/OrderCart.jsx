import { useState } from 'react';
import { placeOrder } from './api.js';

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function OrderCart({ items, onRemove, onOrderPlaced }) {
  const [submitting, setSubmitting] = useState(false);
  const [issues, setIssues] = useState(null);
  const [receipt, setReceipt] = useState(null);

  async function handlePlaceOrder() {
    setSubmitting(true);
    setIssues(null);

    try {
      const drinks = items.map(({ base, size, customizations }) => ({ base, size, customizations }));
      const result = await placeOrder(drinks);
      setReceipt(result);
      onOrderPlaced();
    } catch (err) {
      setIssues(err.issues?.length ? err.issues : [err.message]);
    } finally {
      setSubmitting(false);
    }
  }

  if (receipt) {
    return (
      <div className="w-full max-w-xl rounded-lg border border-amber-300 bg-amber-50 p-4 space-y-3">
        <p className="font-semibold text-amber-900">Receipt</p>
        <ul className="space-y-2 text-sm text-amber-800">
          {receipt.items.map((item, index) => (
            <li key={index} className="flex justify-between gap-4">
              <span>{item.description}</span>
              <span className="whitespace-nowrap">{formatPrice(item.price)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-amber-300 pt-2 font-semibold text-amber-900">
          <span>Grand Total</span>
          <span>{formatPrice(receipt.grandTotal)}</span>
        </div>
        <button
          type="button"
          onClick={() => setReceipt(null)}
          className="text-sm text-amber-700 underline hover:text-amber-900"
        >
          Start a new order
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl space-y-3">
      <p className="text-sm font-semibold text-amber-900">
        Order ({items.length} {items.length === 1 ? 'drink' : 'drinks'})
      </p>

      {items.length === 0 ? (
        <p className="text-sm text-amber-700">No drinks added yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-amber-900"
            >
              <span>{item.description}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-amber-500 hover:text-red-600"
                aria-label={`Remove ${item.description}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {issues && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="font-semibold text-red-800">Could not place this order:</p>
          <ul className="mt-1 list-disc list-inside text-sm text-red-700">
            {issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={items.length === 0 || submitting}
        className="w-full rounded-lg bg-amber-900 px-4 py-2.5 font-semibold text-white hover:bg-amber-950 disabled:opacity-50"
      >
        {submitting ? 'Placing order...' : 'Place Order'}
      </button>
    </div>
  );
}

export default OrderCart;
