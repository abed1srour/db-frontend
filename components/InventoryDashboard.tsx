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

// Mock data for design preview
const MOCK_PRODUCTS: Product[] = [
  {
    _id: '1',
    product_id: 'prod-001',
    product_name: 'Red Apple',
    product_type: 'Fruits',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGNjM0NyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+🍎</3RleHQ+PC9zdmc+',
    price_predicted: 3.50,
    price_modified: 3.99,
    quantity: 45,
    date_added: new Date().toISOString(),
  },
  {
    _id: '2',
    product_id: 'prod-002',
    product_name: 'Banana',
    product_type: 'Fruits',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGRDcwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+🍌</3RleHQ+PC9zdmc+',
    price_predicted: 2.20,
    quantity: 60,
    date_added: new Date().toISOString(),
  },
  {
    _id: '3',
    product_id: 'prod-003',
    product_name: 'Orange',
    product_type: 'Fruits',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGOTUwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+🍊</3RleHQ+PC9zdmc+',
    price_predicted: 3.20,
    price_modified: 3.50,
    quantity: 38,
    date_added: new Date().toISOString(),
  },
  {
    _id: '4',
    product_id: 'prod-004',
    product_name: 'Tomato',
    product_type: 'Vegetables',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0VGNDQzNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+🍅</3RleHQ+PC9zdmc+',
    price_predicted: 2.80,
    quantity: 52,
    date_added: new Date().toISOString(),
  },
  {
    _id: '5',
    product_id: 'prod-005',
    product_name: 'Carrot',
    product_type: 'Vegetables',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGOTgwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+🥕</3RleHQ+PC9zdmc+',
    price_predicted: 1.90,
    price_modified: 2.10,
    quantity: 70,
    date_added: new Date().toISOString(),
  },
  {
    _id: '6',
    product_id: 'prod-006',
    product_name: 'Broccoli',
    product_type: 'Vegetables',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzRDQUY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+🥦</3RleHQ+PC9zdmc+',
    price_predicted: 3.80,
    quantity: 25,
    date_added: new Date().toISOString(),
  },
  {
    _id: '7',
    product_id: 'prod-007',
    product_name: 'Strawberry',
    product_type: 'Fruits',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGMTc0NCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+🍓</3RleHQ+PC9zdmc+',
    price_predicted: 5.50,
    price_modified: 5.99,
    quantity: 30,
    date_added: new Date().toISOString(),
  },
  {
    _id: '8',
    product_id: 'prod-008',
    product_name: 'Grapes',
    product_type: 'Fruits',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzlDMjdCMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+🍇</3RleHQ+PC9zdmc+',
    price_predicted: 4.20,
    quantity: 42,
    date_added: new Date().toISOString(),
  },
];

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
  const [useMockData, setUseMockData] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data);
      setUseMockData(false);
    } catch (err) {
      console.error('Failed to fetch products, using mock data:', err);
      // Use mock data as fallback
      setProducts(MOCK_PRODUCTS);
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (useMockData) {
      // Update mock data locally
      setProducts(products.map(p => 
        p._id === productId ? { ...p, quantity } : p
      ));
    } else {
      await updateProductQuantity(productId, quantity);
      await fetchProducts();
    }
  };

  const handleUpdatePrice = async (productId: string, price: number) => {
    if (useMockData) {
      // Update mock data locally
      setProducts(products.map(p => 
        p._id === productId ? { ...p, price_modified: price } : p
      ));
    } else {
      await updateProductPrice(productId, price);
      await fetchProducts();
    }
  };

  const handleDelete = async (productId: string) => {
    if (useMockData) {
      // Delete from mock data locally
      setProducts(products.filter(p => p._id !== productId));
    } else {
      await deleteProduct(productId);
      await fetchProducts();
    }
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading inventory...</p>
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
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={fetchProducts}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mock Data Banner */}
      {useMockData && (
        <div className="bg-amber-950/50 border-2 border-amber-900 text-amber-300 rounded-lg p-4 flex items-center gap-3 animate-fadeIn">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="font-semibold text-sm">Demo Mode - Using Mock Data</p>
            <p className="text-xs text-amber-400">Backend is not connected. Displaying sample products.</p>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 border-2 border-blue-900 rounded-lg p-5">
          <p className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Total Products</p>
          <p className="text-3xl font-bold text-blue-400">{totalProducts}</p>
        </div>
        <div className="bg-slate-800 border-2 border-green-900 rounded-lg p-5">
          <p className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Total Value</p>
          <p className="text-3xl font-bold text-green-400">${totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-5">
          <p className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Total Stock</p>
          <p className="text-3xl font-bold text-slate-300">{totalQuantity} units</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
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
            className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-slate-800 text-white placeholder-slate-400"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 border-2 border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-800 text-white text-sm"
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
        <div className="text-center py-16 bg-slate-800 rounded-lg border border-slate-700">
          <svg
            className="mx-auto h-16 w-16 text-slate-500 mb-4"
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
          <h3 className="text-xl font-semibold text-white mb-2">
            No products found
          </h3>
          <p className="text-slate-400 mb-6">
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

