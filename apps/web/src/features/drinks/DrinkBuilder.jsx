import { useEffect, useMemo, useState } from 'react';
import { fetchMasterData, buildDrink } from './api.js';
import QuantityControl from './QuantityControl.jsx';

function RadioGroup({ legend, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-amber-900 mb-2">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.id}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors ${
              value === option.name
                ? 'border-amber-600 bg-amber-600 text-white'
                : 'border-amber-200 bg-white text-amber-900 hover:border-amber-400'
            }`}
          >
            <input
              type="radio"
              name={legend}
              value={option.name}
              checked={value === option.name}
              onChange={() => onChange(option.name)}
              className="sr-only"
            />
            {option.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function CustomizationGroup({ legend, options, counts, onIncrement, onDecrement }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-amber-900 mb-2">{legend}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((option) => (
          <QuantityControl
            key={option.id}
            label={option.name}
            count={counts[option.name] ?? 0}
            onIncrement={() => onIncrement(option.name)}
            onDecrement={() => onDecrement(option.name)}
          />
        ))}
      </div>
    </fieldset>
  );
}

function toCustomizationPayload(options, counts) {
  return options
    .filter((option) => (counts[option.name] ?? 0) > 0)
    .map((option) => ({ name: option.name, count: counts[option.name] }));
}

function DrinkBuilder({ onAddToOrder }) {
  const [masterData, setMasterData] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const [base, setBase] = useState('');
  const [size, setSize] = useState('');
  const [syrupCounts, setSyrupCounts] = useState({});
  const [toppingCounts, setToppingCounts] = useState({});

  const [submitting, setSubmitting] = useState(false);
  const [builtDrink, setBuiltDrink] = useState(null);
  const [submitIssues, setSubmitIssues] = useState(null);

  useEffect(() => {
    fetchMasterData()
      .then((data) => {
        setMasterData(data);
        setBase(data.baseDrinks[0]?.name ?? '');
        setSize(data.sizes[0]?.name ?? '');
      })
      .catch((err) => setLoadError(err.message));
  }, []);

  const adjustCount = (setCounts) => (name, delta) => {
    setCounts((prev) => {
      const next = Math.max(0, (prev[name] ?? 0) + delta);
      return { ...prev, [name]: next };
    });
  };

  const incrementSyrup = (name) => adjustCount(setSyrupCounts)(name, 1);
  const decrementSyrup = (name) => adjustCount(setSyrupCounts)(name, -1);
  const incrementTopping = (name) => adjustCount(setToppingCounts)(name, 1);
  const decrementTopping = (name) => adjustCount(setToppingCounts)(name, -1);

  const customizationPayload = useMemo(() => {
    if (!masterData) return [];
    return [
      ...toCustomizationPayload(masterData.syrups, syrupCounts),
      ...toCustomizationPayload(masterData.toppings, toppingCounts),
    ];
  }, [masterData, syrupCounts, toppingCounts]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitIssues(null);
    setBuiltDrink(null);

    try {
      const drink = await buildDrink({ base, size, customizations: customizationPayload });
      setBuiltDrink(drink);
    } catch (err) {
      setSubmitIssues(err.issues?.length ? err.issues : [err.message]);
    } finally {
      setSubmitting(false);
    }
  }

  function handleAddToOrder() {
    onAddToOrder({ base, size, customizations: customizationPayload, description: builtDrink.description });
    setBuiltDrink(null);
    setSyrupCounts({});
    setToppingCounts({});
  }

  if (loadError) {
    return <p className="text-red-600">Could not load master data: {loadError}</p>;
  }

  if (!masterData) {
    return <p className="text-amber-700">Loading menu...</p>;
  }

  return (
    <div className="w-full max-w-xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <RadioGroup legend="Base" options={masterData.baseDrinks} value={base} onChange={setBase} />
        <RadioGroup legend="Size" options={masterData.sizes} value={size} onChange={setSize} />
        <CustomizationGroup
          legend="Syrups"
          options={masterData.syrups}
          counts={syrupCounts}
          onIncrement={incrementSyrup}
          onDecrement={decrementSyrup}
        />
        <CustomizationGroup
          legend="Toppings"
          options={masterData.toppings}
          counts={toppingCounts}
          onIncrement={incrementTopping}
          onDecrement={decrementTopping}
        />

        <button
          type="submit"
          disabled={!base || !size || submitting}
          className="w-full rounded-lg bg-amber-700 px-4 py-2.5 font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
        >
          {submitting ? 'Building...' : 'Build Drink'}
        </button>
      </form>

      {submitIssues && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="font-semibold text-red-800">Could not build this drink:</p>
          <ul className="mt-1 list-disc list-inside text-sm text-red-700">
            {submitIssues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {builtDrink && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 space-y-2">
          <div>
            <p className="font-semibold text-amber-900">
              {builtDrink.size.name} {builtDrink.base.name}
            </p>
            {builtDrink.customizations.length > 0 && (
              <ul className="mt-1 text-sm text-amber-800">
                {builtDrink.customizations.map(({ ingredient, count }) => (
                  <li key={ingredient.id}>
                    {ingredient.name}
                    {count > 0 ? ` x${count}` : ''}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="text-sm italic text-amber-700 border-t border-amber-200 pt-2">
            {builtDrink.description}
          </p>
          <button
            type="button"
            onClick={handleAddToOrder}
            className="w-full rounded-lg bg-amber-900 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-950"
          >
            Add to Order
          </button>
        </div>
      )}
    </div>
  );
}

export default DrinkBuilder;
