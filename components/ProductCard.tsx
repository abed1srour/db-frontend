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
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {product.image && (
          <div className="h-48 bg-gray-100 overflow-hidden">
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
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                {product.product_name}
              </h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full whitespace-nowrap">
                {product.product_type}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Price</p>
              <p className="text-lg font-bold text-green-700">
                ${displayPrice.toFixed(2)}
                <span className="text-xs font-normal text-gray-600"> /KG</span>
              </p>
              {product.price_modified && (
                <p className="text-xs text-gray-500 line-through">
                  ${product.price_predicted.toFixed(2)}
                </p>
              )}
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">In Stock</p>
              <p className="text-lg font-bold text-purple-700">
                {product.quantity}
                <span className="text-xs font-normal text-gray-600"> units</span>
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-500">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($/KG)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newPrice}
                onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                onBlur={handleUpdatePrice}
                className="w-full pl-8 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {product.price_predicted !== newPrice && (
              <p className="mt-1 text-sm text-gray-500">
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

