'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Button } from './ui/Button';
import {
  getAllProducts,
  updateProductQuantity,
  deleteProduct,
  updateProductPrice,
} from '@/lib/api';

interface InventoryDashboardProps {
  onAddNew: () => void;
  refreshTrigger?: number;
}

export const InventoryDashboard: React.FC<InventoryDashboardProps> = ({
  onAddNew,
  refreshTrigger,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    await updateProductQuantity(productId, quantity);
    await fetchProducts();
  };

  const handleUpdatePrice = async (productId: string, price: number) => {
    await updateProductPrice(productId, price);
    await fetchProducts();
  };

  const handleDelete = async (productId: string) => {
    await deleteProduct(productId);
    await fetchProducts();
  };

  const productTypes = ['all', ...new Set(products.map((p) => p.product_type))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === 'all' || product.product_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, p) => sum + (p.price_modified || p.price_predicted) * p.quantity,
    0
  );
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchProducts}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-blue-100 text-sm font-medium mb-1">Total Products</p>
          <p className="text-3xl font-bold">{totalProducts}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-green-100 text-sm font-medium mb-1">Total Value</p>
          <p className="text-3xl font-bold">${totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-purple-100 text-sm font-medium mb-1">Total Stock</p>
          <p className="text-3xl font-bold">{totalQuantity} units</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {productTypes.map((type) => (
            <option key={type} value={type}>
              {type === 'all' ? 'All Types' : type}
            </option>
          ))}
        </select>
        <Button onClick={onAddNew} size="lg">
          + Add Product
        </Button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterType !== 'all'
              ? 'Try adjusting your search or filter'
              : 'Start by adding your first product'}
          </p>
          <Button onClick={onAddNew}>Add Your First Product</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onUpdate={handleUpdateQuantity}
              onDelete={handleDelete}
              onPriceUpdate={handleUpdatePrice}
            />
          ))}
        </div>
      )}
    </div>
  );
};

