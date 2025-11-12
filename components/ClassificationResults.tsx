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
    <Card className="bg-slate-800 border-blue-900">
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-white">Classification Complete</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700/50 rounded-md p-4 border border-slate-600">
            <p className="text-xs font-medium text-slate-400 mb-1">Product Type</p>
            <p className="text-base font-semibold text-white">{result.product_type}</p>
          </div>
          <div className="bg-slate-700/50 rounded-md p-4 border border-slate-600">
            <p className="text-xs font-medium text-slate-400 mb-1">Product Name</p>
            <p className="text-base font-semibold text-white">{result.product_name}</p>
          </div>
        </div>

        {result.confidence !== undefined && (
          <div className="bg-slate-700/50 rounded-md p-4 border border-slate-600">
            <p className="text-xs font-medium text-slate-400 mb-2">Confidence</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-600 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-white">
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onRetry}
            className="flex-1 px-4 py-2 border-2 border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 transition-colors font-medium text-sm"
          >
            Retry
          </button>
          <button
            onClick={onManualClassify}
            className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-400 rounded-md hover:bg-blue-950 transition-colors font-medium text-sm"
          >
            Manual Entry
          </button>
        </div>
      </div>
    </Card>
  );
};

