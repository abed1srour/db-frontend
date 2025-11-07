import { Product, ClassificationResult, PricePrediction } from '@/types/product';

// Update this with your actual backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Upload and classify image
export async function uploadAndClassifyImage(file: File): Promise<{
  classification: ClassificationResult;
  image_data: string;
}> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/classify`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to classify image');
  }

  return response.json();
}

// Check if product exists
export async function checkProductExists(productName: string): Promise<Product | null> {
  const response = await fetch(
    `${API_BASE_URL}/products/check?name=${encodeURIComponent(productName)}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to check product');
  }

  const data = await response.json();
  return data.exists ? data.product : null;
}

// Predict price for a product
export async function predictPrice(productName: string, productType: string): Promise<PricePrediction> {
  const response = await fetch(`${API_BASE_URL}/predict-price`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_name: productName,
      product_type: productType,
    }),
  });

  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to predict price');
  }

  return response.json();
}

// Add new product to inventory
export async function addProduct(productData: Omit<Product, '_id' | 'product_id' | 'date_added'>): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to add product');
  }

  return response.json();
}

// Update product quantity
export async function updateProductQuantity(productId: string, quantity: number): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/quantity`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to update quantity');
  }

  return response.json();
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to fetch products');
  }

  return response.json();
}

// Delete a product
export async function deleteProduct(productId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to delete product');
  }
}

// Update product price
export async function updateProductPrice(productId: string, price: number): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/price`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ price_modified: price }),
  });

  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to update price');
  }

  return response.json();
}

