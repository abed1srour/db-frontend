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
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Quantity
      </label>
      <div className="flex items-center gap-4">
        <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleInputChange}
            className="w-20 text-center py-3 text-lg font-bold border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleIncrement}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <span className="text-gray-600 font-medium">units</span>
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

