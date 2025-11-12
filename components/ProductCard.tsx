'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { QuantityManager } from './QuantityManager';

interface ProductCardProps {
  product: Product;
  onUpdate: (productId: string, quantity: number) => Promise<void>;
  onDelete: (productId: string) => Promise<void>;
  onPriceUpdate: (productId: string, price: number) => Promise<void>;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onUpdate,
  onDelete,
  onPriceUpdate,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newQuantity, setNewQuantity] = useState(product.quantity);
  const [newPrice, setNewPrice] = useState(
    product.price_modified || product.price_predicted
  );

  const handleUpdateQuantity = async () => {
    setIsLoading(true);
    try {
      await onUpdate(product._id!, newQuantity);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePrice = async () => {
    if (newPrice !== (product.price_modified || product.price_predicted)) {
      setIsLoading(true);
      try {
        await onPriceUpdate(product._id!, newPrice);
      } catch (error) {
        console.error('Failed to update price:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${product.product_name}?`)) {
      setIsLoading(true);
      try {
        await onDelete(product._id!);
      } catch (error) {
        console.error('Failed to delete product:', error);
        setIsLoading(false);
      }
    }
  };

  const displayPrice = product.price_modified || product.price_predicted;

  return (
    <>
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-200">
        {product.image && (
          <div className="h-48 bg-slate-900 overflow-hidden">
            <img
              src={product.image}
              alt={product.product_name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-bold text-white line-clamp-2">
                {product.product_name}
              </h3>
              <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs font-semibold rounded-full whitespace-nowrap border border-blue-800">
                {product.product_type}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-950/50 border border-green-900 rounded-md p-3">
              <p className="text-xs text-slate-400 mb-1">Price</p>
              <p className="text-lg font-bold text-green-400">
                ${displayPrice.toFixed(2)}
                <span className="text-xs font-normal text-slate-400"> /KG</span>
              </p>
              {product.price_modified && (
                <p className="text-xs text-slate-500 line-through">
                  ${product.price_predicted.toFixed(2)}
                </p>
              )}
            </div>
            <div className="bg-purple-950/50 border border-purple-900 rounded-md p-3">
              <p className="text-xs text-slate-400 mb-1">In Stock</p>
              <p className="text-lg font-bold text-purple-400">
                {product.quantity}
                <span className="text-xs font-normal text-slate-400"> units</span>
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Added: {new Date(product.date_added).toLocaleDateString()}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => setIsEditModalOpen(true)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              variant="danger"
              size="sm"
              className="flex-1"
              isLoading={isLoading}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit ${product.product_name}`}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Price ($/KG)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newPrice}
                onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                onBlur={handleUpdatePrice}
                className="w-full pl-8 pr-4 py-2 border-2 border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-700 text-white"
              />
            </div>
            {product.price_predicted !== newPrice && (
              <p className="mt-1 text-sm text-slate-400">
                Original prediction: ${product.price_predicted.toFixed(2)}
              </p>
            )}
          </div>

          <QuantityManager
            initialQuantity={product.quantity}
            onQuantityChange={setNewQuantity}
            showAddButton={false}
          />

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setIsEditModalOpen(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateQuantity}
              className="flex-1"
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

