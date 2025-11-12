'use client';

import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ClassificationResults } from '@/components/ClassificationResults';
import { PriceEditor } from '@/components/PriceEditor';
import { QuantityManager } from '@/components/QuantityManager';
import { InventoryDashboard } from '@/components/InventoryDashboard';
import { ManualClassificationModal } from '@/components/ManualClassificationModal';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  uploadAndClassifyImage,
  checkProductExists,
  predictPrice,
  addProduct,
  updateProductQuantity,
} from '@/lib/api';
import { ClassificationResult, Product } from '@/types/product';

type WorkflowStep = 'upload' | 'classify' | 'check-exists' | 'price' | 'quantity' | 'complete';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'inventory'>('upload');
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  
  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Classification state
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  
  // Product check state
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  const [showExistingProductModal, setShowExistingProductModal] = useState(false);
  
  // Price state
  const [predictedPrice, setPredictedPrice] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  
  // Quantity state
  const [quantity, setQuantity] = useState<number>(1);
  
  // Loading states
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  // Refresh trigger for inventory
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedFile(file);
    setImagePreview(preview);
  };

  const handleClassifyImage = async () => {
    if (!selectedFile) return;

    setIsClassifying(true);
    try {
      const result = await uploadAndClassifyImage(selectedFile);
      setClassificationResult(result.classification);
      setCurrentStep('classify');
      
      // After classification, check if product exists
      setTimeout(() => handleCheckExisting(result.classification), 500);
    } catch (error) {
      console.error('Classification failed:', error);
      alert('Failed to classify image. Please try again or classify manually.');
    } finally {
      setIsClassifying(false);
    }
  };

  const handleCheckExisting = async (classification: ClassificationResult) => {
    try {
      const existing = await checkProductExists(classification.product_name);
      if (existing) {
        setExistingProduct(existing);
        setShowExistingProductModal(true);
      } else {
        // Product doesn't exist, proceed to price prediction
        handlePredictPrice(classification);
      }
    } catch (error) {
      console.error('Failed to check existing product:', error);
      // Continue to price prediction even if check fails
      handlePredictPrice(classification);
    }
  };

  const handleAddToExisting = async () => {
    if (!existingProduct) return;

    setIsAddingProduct(true);
    try {
      await updateProductQuantity(existingProduct._id!, existingProduct.quantity + quantity);
      setShowExistingProductModal(false);
      setCurrentStep('complete');
      setRefreshTrigger((prev) => prev + 1);
      
      // Show success message and reset after delay
      setTimeout(() => {
        resetWorkflow();
      }, 2000);
    } catch (error) {
      console.error('Failed to add quantity:', error);
      alert('Failed to update product quantity. Please try again.');
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleProceedToNew = () => {
    setShowExistingProductModal(false);
    if (classificationResult) {
      handlePredictPrice(classificationResult);
    }
  };

  const handlePredictPrice = async (classification: ClassificationResult) => {
    setCurrentStep('price');
    try {
      const prediction = await predictPrice(
        classification.product_name,
        classification.product_type
      );
      setPredictedPrice(prediction.predicted_price);
      setFinalPrice(prediction.predicted_price);
    } catch (error) {
      console.error('Price prediction failed:', error);
      alert('Failed to predict price. Please enter manually.');
      // Set a default price
      setPredictedPrice(0);
      setFinalPrice(0);
    }
  };

  const handleManualClassification = (result: ClassificationResult) => {
    setClassificationResult(result);
    setCurrentStep('classify');
    handleCheckExisting(result);
  };

  const handleAddToInventory = async () => {
    if (!classificationResult) return;

    setIsAddingProduct(true);
    try {
      await addProduct({
        product_name: classificationResult.product_name,
        product_type: classificationResult.product_type,
        image: imagePreview,
        price_predicted: predictedPrice,
        price_modified: finalPrice !== predictedPrice ? finalPrice : undefined,
        quantity: quantity,
      });

      setCurrentStep('complete');
      setRefreshTrigger((prev) => prev + 1);
      
      // Reset after showing success
      setTimeout(() => {
        resetWorkflow();
      }, 2000);
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product to inventory. Please try again.');
    } finally {
      setIsAddingProduct(false);
    }
  };

  const resetWorkflow = () => {
    setCurrentStep('upload');
    setSelectedFile(null);
    setImagePreview('');
    setClassificationResult(null);
    setExistingProduct(null);
    setPredictedPrice(0);
    setFinalPrice(0);
    setQuantity(1);
  };

  const canClassify = selectedFile !== null && currentStep === 'upload';
  const canAddToInventory = currentStep === 'price' && finalPrice > 0;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b-2 border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Smart Inventory System
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                AI-Powered Product Management
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-700 rounded-md p-1 border border-slate-600">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-5 py-2 rounded font-medium transition-colors text-sm ${
                  activeTab === 'upload'
                    ? 'bg-blue-600 text-white border border-blue-500'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Add Product
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-5 py-2 rounded font-medium transition-colors text-sm ${
                  activeTab === 'inventory'
                    ? 'bg-blue-600 text-white border border-blue-500'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Inventory
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {['Upload', 'Classify', 'Price', 'Add'].map((step, index) => {
                const stepMap: { [key: string]: WorkflowStep } = {
                  Upload: 'upload',
                  Classify: 'classify',
                  Price: 'price',
                  Add: 'quantity',
                };
                const stepKey = stepMap[step];
                const stepOrder = ['upload', 'classify', 'price', 'quantity'];
                const currentIndex = stepOrder.indexOf(currentStep);
                const stepIndex = stepOrder.indexOf(stepKey);
                const isActive = stepIndex <= currentIndex;
                const isCurrent = stepKey === currentStep;

                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-colors border-2 ${
                          isActive
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-slate-800 text-slate-500 border-slate-600'
                        } ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900' : ''}`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`text-xs mt-1.5 font-medium ${
                          isActive ? 'text-slate-200' : 'text-slate-500'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {index < 3 && (
                      <div
                        className={`w-12 h-0.5 mt-[-20px] transition-colors ${
                          stepIndex < currentIndex ? 'bg-blue-600' : 'bg-slate-700'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Upload Section */}
            <Card title="Upload Product Image" className="bg-slate-800">
              <ImageUpload
                onImageSelect={handleImageSelect}
                currentImage={imagePreview}
              />
              {canClassify && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={handleClassifyImage}
                    isLoading={isClassifying}
                    className="flex items-center justify-center gap-2"
                    size="lg"
                  >
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Classify Image
                  </Button>
                  <Button
                    onClick={() => setShowManualModal(true)}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                    size="lg"
                  >
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Manual Entry
                  </Button>
                </div>
              )}
            </Card>

            {/* Classification Results */}
            {classificationResult && currentStep !== 'upload' && (
              <ClassificationResults
                result={classificationResult}
                onRetry={resetWorkflow}
                onManualClassify={() => setShowManualModal(true)}
              />
            )}

            {/* Price Prediction */}
            {currentStep === 'price' && (
              <>
                <PriceEditor
                  predictedPrice={predictedPrice}
                  onPriceChange={setFinalPrice}
                />
                <Card title="Set Quantity">
                  <QuantityManager
                    onQuantityChange={setQuantity}
                    initialQuantity={quantity}
                    showAddButton={true}
                    onAdd={handleAddToInventory}
                    isLoading={isAddingProduct}
                  />
                </Card>
              </>
            )}

            {/* Success Message */}
            {currentStep === 'complete' && (
              <Card className="bg-slate-800 border-green-900">
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-14 w-14 text-green-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Product Added Successfully!
                  </h3>
                  <p className="text-sm text-slate-400">
                    Redirecting to upload page...
                  </p>
                </div>
              </Card>
            )}

            {currentStep !== 'upload' && currentStep !== 'complete' && (
              <div className="flex justify-center">
                <Button onClick={resetWorkflow} variant="outline">
                  Start Over
                </Button>
              </div>
            )}
          </div>
        ) : (
          <InventoryDashboard
            onAddNew={() => setActiveTab('upload')}
            refreshTrigger={refreshTrigger}
          />
        )}
      </main>

      {/* Modals */}
      <ManualClassificationModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onSubmit={handleManualClassification}
      />

      <Modal
        isOpen={showExistingProductModal}
        onClose={() => setShowExistingProductModal(false)}
        title="Product Already Exists"
      >
        {existingProduct && (
          <div className="space-y-5">
            <div className="bg-blue-950/50 border-2 border-blue-900 rounded-md p-4">
              <p className="text-blue-300 font-semibold mb-3 text-sm">
                This product is already in your inventory:
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="font-semibold text-white">{existingProduct.product_name}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Current Stock:</span>
                  <span className="font-semibold text-white">{existingProduct.quantity} units</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Price:</span>
                  <span className="font-semibold text-white">
                    ${(existingProduct.price_modified || existingProduct.price_predicted).toFixed(2)} /KG
                  </span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                How many units would you like to add?
              </label>
              <QuantityManager
                onQuantityChange={setQuantity}
                initialQuantity={quantity}
                showAddButton={false}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleProceedToNew}
                variant="outline"
                className="flex-1"
              >
                Add as New
              </Button>
              <Button
                onClick={handleAddToExisting}
                className="flex-1"
                isLoading={isAddingProduct}
              >
                Add {quantity} units
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
