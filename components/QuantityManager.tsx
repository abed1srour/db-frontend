'use client';

import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface QuantityManagerProps {
  onQuantityChange: (quantity: number) => void;
  initialQuantity?: number;
  showAddButton?: boolean;
  onAdd?: () => void;
  isLoading?: boolean;
}

export const QuantityManager: React.FC<QuantityManagerProps> = ({
  onQuantityChange,
  initialQuantity = 1,
  showAddButton = true,
  onAdd,
  isLoading = false,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
      onQuantityChange(value);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300">
        Quantity
      </label>
      <div className="flex items-center gap-3">
        <div className="flex items-center border-2 border-slate-600 rounded-md overflow-hidden">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-r-2 border-slate-600 text-slate-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleInputChange}
            className="w-16 text-center py-2 text-base font-semibold border-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-white"
          />
          <button
            onClick={handleIncrement}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 transition-colors border-l-2 border-slate-600 text-slate-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <span className="text-slate-400 text-sm font-medium">units</span>
      </div>
      {showAddButton && onAdd && (
        <Button
          onClick={onAdd}
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
          Add to Inventory
        </Button>
      )}
    </div>
  );
};

