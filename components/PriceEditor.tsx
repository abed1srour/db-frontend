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
    <Card className="bg-slate-800 border-green-900">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-white">Price Prediction</h3>
          </div>
          {isEdited && (
            <button
              onClick={handleReset}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Reset
            </button>
          )}
        </div>

        <div className="bg-slate-700/50 rounded-md p-4 border border-slate-600">
          <p className="text-xs font-medium text-slate-400 mb-1">Predicted Price</p>
          <p className="text-xl font-bold text-white">
            {currency}{predictedPrice.toFixed(2)} / KG
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Adjust Price {isEdited && <span className="text-blue-400">(Modified)</span>}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
              {currency}
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={handlePriceChange}
              className="w-full pl-9 pr-14 py-2.5 border-2 border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-semibold bg-slate-700 text-white"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
              / KG
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

