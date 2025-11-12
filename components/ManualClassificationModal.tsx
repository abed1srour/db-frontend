'use client';

import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { ClassificationResult } from '@/types/product';

interface ManualClassificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (result: ClassificationResult) => void;
}

export const ManualClassificationModal: React.FC<ManualClassificationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('');

  const handleSubmit = () => {
    if (productName.trim() && productType.trim()) {
      onSubmit({
        product_name: productName.trim(),
        product_type: productType.trim(),
      });
      setProductName('');
      setProductType('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manual Product Classification">
      <div className="space-y-4">
        <p className="text-slate-400">
          Enter the product details manually if the automatic classification was not accurate.
        </p>
        <Input
          label="Product Name"
          placeholder="e.g., Red Apple"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <Input
          label="Product Type"
          placeholder="e.g., Fruits"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
        />
        <div className="flex gap-3 pt-4">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={!productName.trim() || !productType.trim()}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

