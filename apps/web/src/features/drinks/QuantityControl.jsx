function QuantityControl({ label, count, onIncrement, onDecrement }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-white px-3 py-2">
      <span className="text-sm text-amber-900">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrement}
          disabled={count === 0}
          className="h-6 w-6 rounded-full bg-amber-100 text-amber-800 disabled:opacity-30 hover:bg-amber-200"
        >
          −
        </button>
        <span className="w-4 text-center text-sm font-medium text-amber-900">{count}</span>
        <button
          type="button"
          onClick={onIncrement}
          className="h-6 w-6 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default QuantityControl;
