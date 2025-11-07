export interface Product {
  _id?: string;
  product_id: string;
  product_name: string;
  product_type: string;
  image_gridfs_id?: string;
  image?: string; // Base64 or URL
  price_predicted: number;
  price_modified?: number;
  quantity: number;
  date_added: string;
}

export interface ClassificationResult {
  product_type: string;
  product_name: string;
  confidence?: number;
}

export interface PricePrediction {
  predicted_price: number;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  classification?: ClassificationResult;
  price_prediction?: PricePrediction;
  existing_product?: Product;
}

