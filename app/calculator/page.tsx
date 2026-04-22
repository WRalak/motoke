'use client';

import { useState, useEffect } from 'react';
import { Lender, mockLenders } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CalculatorData {
  vehiclePrice: number;
  downPayment: number;
  loanTerm: number;
  interestRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export default function CalculatorPage() {
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    vehiclePrice: 2500000,
    downPayment: 500000,
    loanTerm: 48,
    interestRate: 15,
    monthlyPayment: 0,
    totalInterest: 0,
    totalPayment: 0
  });

  const [lenders, setLenders] = useState<Lender[]>([]);
  const [selectedCreditScore, setSelectedCreditScore] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLenders(mockLenders);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    calculateMonthlyPayment();
  }, [calculatorData.vehiclePrice, calculatorData.downPayment, calculatorData.loanTerm, calculatorData.interestRate]);

  const calculateMonthlyPayment = () => {
    const principal = calculatorData.vehiclePrice - calculatorData.downPayment;
    const monthlyRate = calculatorData.interestRate / 100 / 12;
    const numPayments = calculatorData.loanTerm;

    if (principal <= 0 || monthlyRate <= 0) {
      setCalculatorData(prev => ({
        ...prev,
        monthlyPayment: 0,
        totalInterest: 0,
        totalPayment: 0
      }));
      return;
    }

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;

    setCalculatorData(prev => ({
      ...prev,
      monthlyPayment,
      totalInterest,
      totalPayment
    }));
  };

  const handleInputChange = (field: keyof CalculatorData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCalculatorData(prev => ({ ...prev, [field]: numValue }));
  };

  const getInterestRateForCreditScore = (lender: Lender) => {
    switch (selectedCreditScore) {
      case 'excellent':
        return lender.interestRates.excellent;
      case 'good':
        return lender.interestRates.good;
      case 'fair':
        return lender.interestRates.fair;
      case 'poor':
        return lender.interestRates.poor;
      default:
        return lender.interestRates.good;
    }
  };

  const creditScoreRanges = {
    excellent: { min: 750, label: 'Excellent (750+)', color: 'text-green-600' },
    good: { min: 700, max: 749, label: 'Good (700-749)', color: 'text-blue-600' },
    fair: { min: 650, max: 699, label: 'Fair (650-699)', color: 'text-yellow-600' },
    poor: { max: 649, label: 'Poor (Below 650)', color: 'text-red-600' }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hire Purchase Calculator</h1>
          <p className="text-gray-600">Calculate your monthly payments and compare financing options</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Price (KES)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={calculatorData.vehiclePrice}
                      onChange={(e) => handleInputChange('vehiclePrice', e.target.value)}
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Down Payment (KES)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={calculatorData.downPayment}
                      onChange={(e) => handleInputChange('downPayment', e.target.value)}
                      min="0"
                      max={calculatorData.vehiclePrice}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {((calculatorData.downPayment / calculatorData.vehiclePrice) * 100).toFixed(1)}% of vehicle price
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Term (Months)
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={calculatorData.loanTerm}
                      onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                    >
                      <option value={12}>12 months</option>
                      <option value={24}>24 months</option>
                      <option value={36}>36 months</option>
                      <option value={48}>48 months</option>
                      <option value={60}>60 months</option>
                      <option value={72}>72 months</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={calculatorData.interestRate}
                      onChange={(e) => handleInputChange('interestRate', e.target.value)}
                      min="0"
                      max="50"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Results */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Monthly Payment Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Payment:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        KES {calculatorData.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount Paid:</span>
                      <span className="font-semibold">
                        KES {calculatorData.totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Interest:</span>
                      <span className="font-semibold">
                        KES {calculatorData.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Amount:</span>
                      <span className="font-semibold">
                        KES {(calculatorData.vehiclePrice - calculatorData.downPayment).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Credit Score Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Your Credit Score
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(creditScoreRanges).map(([key, range]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedCreditScore(key as any)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedCreditScore === key
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`font-medium ${range.color}`}>
                          {range.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lender Comparison */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Lenders</CardTitle>
                <p className="text-sm text-gray-600">Compare interest rates from different lenders</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {lenders.map((lender) => (
                  <div key={lender.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{lender.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{lender.type.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {getInterestRateForCreditScore(lender).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Interest rate</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min Credit Score:</span>
                        <span>{lender.minCreditScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Loan:</span>
                        <span>KES {lender.maxLoanAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Terms:</span>
                        <span>{lender.loanTerms.join(', ')} months</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {lender.preApprovalAvailable ? 'Pre-approval available' : 'No pre-approval'}
                        </span>
                        <Button size="sm" variant="outline">
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle>Financing Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                    <p className="text-gray-600">
                      A larger down payment reduces your monthly payments and total interest
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                    <p className="text-gray-600">
                      Shorter loan terms mean higher monthly payments but less total interest
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                    <p className="text-gray-600">
                      Check your credit score before applying to improve your chances of better rates
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                    <p className="text-gray-600">
                      Compare offers from multiple lenders to find the best deal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
