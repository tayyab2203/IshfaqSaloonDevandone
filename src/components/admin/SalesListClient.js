'use client';

import { useState } from 'react';
import { formatDate, formatCurrency } from '../../lib/utils.js';
import Receipt from './Receipt.js';

export default function SalesListClient({ sales }) {
  const [receiptSaleId, setReceiptSaleId] = useState(null);

  return (
    <>
      <div className="bg-white border border-medium-grey rounded-lg overflow-hidden">
        {sales.length === 0 ? (
          <div className="p-8 text-center text-slate-blue">
            <p>No sales found for this date.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-medium-grey">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                      Date & Time
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                      Customer
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                      Employee
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                      Amount
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                      Payment
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-center text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr
                      key={sale._id.toString()}
                      className="border-b border-medium-grey hover:bg-light-grey"
                    >
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                        <div>
                          <div className="font-semibold">
                            {formatDate(sale.saleDate, 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-slate-blue">
                            {new Date(sale.saleDate).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                        <div>
                          <div className="font-semibold">
                            {sale.customerId?.name || 'Walk-in Customer'}
                          </div>
                          <div className="text-xs text-slate-blue">
                            {sale.customerId?.phone || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                        {sale.employeeId?.name || 'N/A'}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-bold text-dark-charcoal">
                        {formatCurrency(sale.finalAmount || sale.amount || 0)}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                        <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                          sale.paymentMethod === 'cash' 
                            ? 'bg-amber bg-opacity-20 text-amber' 
                            : 'bg-blue bg-opacity-20 text-blue'
                        }`}>
                          {sale.paymentMethod || 'cash'}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-center">
                        <button
                          onClick={() => setReceiptSaleId(sale._id.toString())}
                          className="px-3 py-1.5 bg-dark-charcoal text-white text-xs font-semibold rounded hover:bg-[#2d3139] transition-colors"
                        >
                          Print Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 p-4">
              {sales.map((sale) => (
                <div
                  key={sale._id.toString()}
                  className="p-4 border border-medium-grey rounded-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-dark-charcoal text-sm">
                        {sale.customerId?.name || 'Walk-in Customer'}
                      </p>
                      <p className="text-xs text-slate-blue">
                        {formatDate(sale.saleDate, 'MMM dd, yyyy')} at{' '}
                        {new Date(sale.saleDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-dark-charcoal">
                      {formatCurrency(sale.finalAmount || sale.amount || 0)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xs text-slate-blue">
                      <p>Employee: {sale.employeeId?.name || 'N/A'}</p>
                      <p className="mt-1">
                        Payment: <span className="capitalize">{sale.paymentMethod || 'cash'}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setReceiptSaleId(sale._id.toString())}
                    className="w-full px-4 py-2 bg-dark-charcoal text-white text-sm font-semibold rounded hover:bg-[#2d3139] transition-colors"
                  >
                    Print Receipt
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {receiptSaleId && (
        <Receipt
          saleId={receiptSaleId}
          onClose={() => setReceiptSaleId(null)}
        />
      )}
    </>
  );
}
