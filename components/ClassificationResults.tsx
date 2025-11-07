'use client';

import React from 'react';
import { ClassificationResult } from '@/types/product';
import { Card } from './ui/Card';

interface ClassificationResultsProps {
  result: ClassificationResult;
  onRetry: () => void;
  onManualClassify: () => void;
}

export const ClassificationResults: React.FC<ClassificationResultsProps> = ({
  result,
  onRetry,
  onManualClassify,
}) => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900">Classification Complete</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">Product Type</p>
            <p className="text-lg font-bold text-gray-900">{result.product_type}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">Product Name</p>
            <p className="text-lg font-bold text-gray-900">{result.product_name}</p>
          </div>
        </div>

        {result.confidence !== undefined && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-2">Confidence</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-900">
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onRetry}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Retry Classification
          </button>
          <button
            onClick={onManualClassify}
            className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Manual Classification
          </button>
        </div>
      </div>
    </Card>
  );
};

