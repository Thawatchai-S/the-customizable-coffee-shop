import { useState } from 'react';
import DrinkBuilder from './features/drinks/DrinkBuilder.jsx';
import OrderCart from './features/orders/OrderCart.jsx';

function App() {
  const [orderItems, setOrderItems] = useState([]);

  function addToOrder(item) {
    setOrderItems((prev) => [...prev, item]);
  }

  function removeFromOrder(index) {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="min-h-screen bg-amber-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-2xl font-bold text-amber-900 text-center">
          The Customizable Coffee Shop
        </h1>
        <div className="bg-white shadow-lg rounded-2xl p-6 flex justify-center">
          <DrinkBuilder onAddToOrder={addToOrder} />
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 flex justify-center">
          <OrderCart
            items={orderItems}
            onRemove={removeFromOrder}
            onOrderPlaced={() => setOrderItems([])}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
