'use client';

import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

interface PriceEditorProps {
  predictedPrice: number;
  onPriceChange: (price: number) => void;
  currency?: string;
}

export const PriceEditor: React.FC<PriceEditorProps> = ({
  predictedPrice,
  onPriceChange,
  currency = '$',
}) => {
  const [price, setPrice] = useState(predictedPrice.toString());
  const [isEdited, setIsEdited] = useState(false);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrice(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onPriceChange(numValue);
      setIsEdited(Math.abs(numValue - predictedPrice) > 0.01);
    }
  };

  const handleReset = () => {
    setPrice(predictedPrice.toString());
    onPriceChange(predictedPrice);
    setIsEdited(false);
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900">Price Prediction</h3>
          </div>
          {isEdited && (
            <button
              onClick={handleReset}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset to Predicted
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600 mb-2">Predicted Price</p>
          <p className="text-2xl font-bold text-gray-900">
            {currency}{predictedPrice.toFixed(2)} / KG
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adjust Price {isEdited && <span className="text-blue-600">(Modified)</span>}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
              {currency}
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={handlePriceChange}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
              / KG
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

