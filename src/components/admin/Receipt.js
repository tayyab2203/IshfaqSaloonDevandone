'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '../../lib/utils.js';

export default function Receipt({ saleId, onClose }) {
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (saleId) {
      fetchReceiptData();
    }
  }, [saleId]);

  const fetchReceiptData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/receipt/${saleId}`);
      const data = await res.json();
      
      if (data.success) {
        setReceiptData(data.data);
      } else {
        setError(data.error || 'Failed to load receipt');
      }
    } catch (error) {
      console.error('Error fetching receipt:', error);
      setError('Failed to load receipt data');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const receiptElement = document.querySelector('.receipt-print-wrapper');
    if (!receiptElement) {
      window.print();
      return;
    }

    // Get the HTML content
    const receiptHTML = receiptElement.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${receiptData.receiptNumber}</title>
          <meta charset="utf-8">
          <style>
            @page {
              size: 80mm auto;
              margin: 0.2cm;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Nunito', 'Arial', sans-serif;
              font-size: 10px;
              line-height: 1.4;
              color: #1a1a1a;
              background: white;
              padding: 10px;
              max-width: 80mm;
              margin: 0 auto;
            }
            .receipt-container {
              border: 3px solid #10B981;
              border-radius: 6px;
              padding: 12px;
              background: white;
            }
            .receipt-header {
              text-align: center;
              padding-bottom: 10px;
              margin-bottom: 10px;
              border-bottom: 2px solid #10B981;
            }
            .receipt-header img {
              height: 40px;
              width: auto;
              margin-bottom: 6px;
              display: block;
              margin-left: auto;
              margin-right: auto;
              filter: brightness(0);
              -webkit-filter: brightness(0);
            }
            .receipt-header h1 {
              font-family: 'Comfortaa', 'Arial', sans-serif;
              font-size: 16px;
              font-weight: 700;
              color: #1a1a1a;
              margin-bottom: 4px;
              letter-spacing: 0.3px;
            }
            .receipt-header .address {
              font-size: 8px;
              color: #666;
              margin: 2px 0;
              line-height: 1.3;
            }
            .receipt-header .phone {
              font-size: 8px;
              color: #666;
              margin-top: 2px;
            }
            .receipt-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 6px;
              font-size: 9px;
              margin-bottom: 10px;
              padding: 8px;
              background: #f9fafb;
              border-radius: 4px;
            }
            .receipt-info-item {
              display: flex;
              justify-content: space-between;
            }
            .receipt-info-label {
              color: #666;
              font-weight: 500;
            }
            .receipt-info-value {
              color: #1a1a1a;
              font-weight: 600;
            }
            .receipt-divider {
              border-top: 1px dashed #cbd5e1;
              margin: 8px 0;
            }
            .receipt-section {
              margin-bottom: 10px;
            }
            .receipt-section-title {
              font-size: 9px;
              font-weight: 700;
              color: #1a1a1a;
              margin-bottom: 6px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              padding-bottom: 4px;
              border-bottom: 1px solid #e5e7eb;
            }
            .receipt-detail-row {
              display: flex;
              justify-content: space-between;
              font-size: 9px;
              margin-bottom: 4px;
              padding: 2px 0;
            }
            .receipt-detail-label {
              color: #666;
            }
            .receipt-detail-value {
              color: #1a1a1a;
              font-weight: 600;
            }
            .receipt-table {
              width: 100%;
              border-collapse: collapse;
              margin: 8px 0;
            }
            .receipt-table thead {
              background: #f3f4f6;
            }
            .receipt-table th {
              text-align: left;
              padding: 6px 4px;
              font-size: 8px;
              font-weight: 700;
              color: #1a1a1a;
              text-transform: uppercase;
              letter-spacing: 0.3px;
              border-bottom: 2px solid #10B981;
            }
            .receipt-table th:last-child {
              text-align: right;
            }
            .receipt-table td {
              padding: 5px 4px;
              font-size: 9px;
              color: #1a1a1a;
              border-bottom: 1px solid #e5e7eb;
            }
            .receipt-table td:last-child {
              text-align: right;
              font-weight: 600;
            }
            .receipt-summary {
              margin-top: 10px;
              padding-top: 8px;
              border-top: 2px solid #10B981;
            }
            .receipt-summary-row {
              display: flex;
              justify-content: space-between;
              font-size: 9px;
              margin-bottom: 4px;
              padding: 2px 0;
            }
            .receipt-summary-row.total {
              border-top: 2px solid #1a1a1a;
              padding-top: 6px;
              margin-top: 6px;
              font-size: 12px;
              font-weight: 700;
            }
            .receipt-summary-label {
              color: #666;
            }
            .receipt-summary-value {
              color: #1a1a1a;
              font-weight: 600;
            }
            .receipt-summary-value.total {
              font-size: 12px;
              font-weight: 700;
            }
            .receipt-footer {
              text-align: center;
              margin-top: 12px;
              padding-top: 10px;
              border-top: 2px solid #10B981;
            }
            .receipt-footer .thank-you {
              font-size: 9px;
              font-weight: 700;
              color: #1a1a1a;
              margin-bottom: 6px;
            }
            .receipt-footer .salon-name {
              font-size: 8px;
              font-weight: 600;
              color: #1a1a1a;
              margin-bottom: 3px;
            }
            .receipt-footer .salon-info {
              font-size: 7px;
              color: #666;
              line-height: 1.4;
              margin: 2px 0;
            }
            .receipt-footer .closing {
              font-size: 8px;
              font-weight: 600;
              color: #1a1a1a;
              margin-top: 6px;
            }
            .receipt-footer .company-info {
              margin-top: 8px;
              padding-top: 8px;
              border-top: 1px solid #e5e7eb;
            }
            .receipt-footer .company-info p {
              font-size: 7px;
              color: #666;
              line-height: 1.3;
              margin: 1px 0;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              .receipt-container {
                border: 3px solid #10B981;
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${receiptHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-dark-charcoal"></div>
            <p className="text-dark-charcoal font-semibold">Loading receipt...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
          <div className="mb-4 p-4 bg-error-bg border border-red-300 rounded text-error-text">
            {error}
          </div>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-dark-charcoal text-white rounded-lg hover:bg-[#2d3139] transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!receiptData) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-print-wrapper,
          .receipt-print-wrapper * {
            visibility: visible;
          }
          .receipt-print-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 80mm;
            margin: 0 auto;
            background: white;
            padding: 0.2cm;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: 80mm auto;
            margin: 0.2cm;
          }
        }
      `}</style>

      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 print:hidden no-print">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 no-print">
              <h2 className="text-xl sm:text-2xl font-bold text-dark-charcoal">Receipt Preview</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={handlePrint}
                  className="px-6 py-2.5 bg-dark-charcoal text-white rounded-lg hover:bg-[#2d3139] transition-colors font-semibold text-sm sm:text-base shadow-md"
                >
                  🖨️ Print Receipt
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-medium-grey text-dark-charcoal rounded-lg hover:bg-slate-blue hover:text-white transition-colors font-semibold text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="receipt-print-wrapper bg-white border-[3px] border-green rounded-lg p-3 sm:p-4">
              {/* Header */}
              <div className="receipt-header text-center pb-2.5 mb-2.5 border-b-2 border-green">
                {receiptData.salon?.logo && (
                  <img
                    src={receiptData.salon.logo}
                    alt={receiptData.salon.name}
                    className="h-10 sm:h-12 w-auto mx-auto mb-1.5"
                    style={{
                      filter: 'brightness(0)',
                      WebkitFilter: 'brightness(0)',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <h1 className="text-base sm:text-lg font-heading font-bold text-dark-charcoal mb-1 tracking-wide">
                  {receiptData.salon?.name || 'Salon'}
                </h1>
                {receiptData.salon?.address && (
                  <p className="text-[10px] sm:text-xs text-slate-blue mb-0.5 leading-tight">
                    {receiptData.salon.address}
                  </p>
                )}
                <p className="text-[10px] sm:text-xs text-slate-blue">
                  Phone: {receiptData.salon?.phone || 'N/A'}
                </p>
              </div>

              {/* Receipt Info */}
              <div className="receipt-info grid grid-cols-2 gap-1.5 text-[10px] sm:text-xs mb-2.5 p-2 bg-light-grey rounded">
                <div className="receipt-info-item flex justify-between">
                  <span className="receipt-info-label text-slate-blue font-medium">Receipt #:</span>
                  <span className="receipt-info-value text-dark-charcoal font-semibold">{receiptData.receiptNumber || 'N/A'}</span>
                </div>
                <div className="receipt-info-item flex justify-between">
                  <span className="receipt-info-label text-slate-blue font-medium">Date:</span>
                  <span className="receipt-info-value text-dark-charcoal font-semibold">
                    {receiptData.saleDate ? format(new Date(receiptData.saleDate), 'MMM dd, yyyy') : 'N/A'}
                  </span>
                </div>
                <div className="receipt-info-item flex justify-between col-span-2">
                  <span className="receipt-info-label text-slate-blue font-medium">Time:</span>
                  <span className="receipt-info-value text-dark-charcoal font-semibold">
                    {receiptData.saleDate ? format(new Date(receiptData.saleDate), 'hh:mm a') : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="receipt-divider border-t border-dashed border-medium-grey my-2"></div>

              {/* Customer Info */}
              <div className="receipt-section mb-2.5">
                <div className="receipt-section-title text-[10px] sm:text-xs font-bold text-dark-charcoal mb-1.5 uppercase tracking-wide border-b border-medium-grey pb-1">
                  Customer Information
                </div>
                <div className="receipt-detail-row flex justify-between text-[10px] sm:text-xs mb-1">
                  <span className="receipt-detail-label text-slate-blue">Name:</span>
                  <span className="receipt-detail-value text-dark-charcoal font-semibold">{receiptData.customer?.name || 'Walk-in Customer'}</span>
                </div>
                <div className="receipt-detail-row flex justify-between text-[10px] sm:text-xs mb-1">
                  <span className="receipt-detail-label text-slate-blue">Phone:</span>
                  <span className="receipt-detail-value text-dark-charcoal font-semibold">{receiptData.customer?.phone || 'N/A'}</span>
                </div>
                {receiptData.customer?.email && (
                  <div className="receipt-detail-row flex justify-between text-[10px] sm:text-xs">
                    <span className="receipt-detail-label text-slate-blue">Email:</span>
                    <span className="receipt-detail-value text-dark-charcoal font-semibold">{receiptData.customer.email}</span>
                  </div>
                )}
              </div>

              {/* Employee Info */}
              {receiptData.employee && (
                <>
                  <div className="receipt-divider border-t border-dashed border-medium-grey my-2"></div>
                  <div className="receipt-section mb-2.5">
                    <div className="receipt-section-title text-[10px] sm:text-xs font-bold text-dark-charcoal mb-1.5 uppercase tracking-wide border-b border-medium-grey pb-1">
                      Service Provider
                    </div>
                    <div className="receipt-detail-row flex justify-between text-[10px] sm:text-xs mb-1">
                      <span className="receipt-detail-label text-slate-blue">Name:</span>
                      <span className="receipt-detail-value text-dark-charcoal font-semibold">{receiptData.employee.name || 'N/A'}</span>
                    </div>
                    <div className="receipt-detail-row flex justify-between text-[10px] sm:text-xs">
                      <span className="receipt-detail-label text-slate-blue">Role:</span>
                      <span className="receipt-detail-value text-dark-charcoal font-semibold">{receiptData.employee.role || 'N/A'}</span>
                    </div>
                  </div>
                </>
              )}

              <div className="receipt-divider border-t border-dashed border-medium-grey my-2"></div>

              {/* Services */}
              <div className="receipt-section mb-2.5">
                <div className="receipt-section-title text-[10px] sm:text-xs font-bold text-dark-charcoal mb-1.5 uppercase tracking-wide border-b border-medium-grey pb-1">
                  Services
                </div>
                {receiptData.services && receiptData.services.length > 0 ? (
                  <table className="receipt-table w-full text-[10px] sm:text-xs">
                    <thead>
                      <tr className="bg-light-grey">
                        <th className="text-left py-1.5 px-1 font-bold text-dark-charcoal uppercase tracking-wide border-b-2 border-green">
                          Service
                        </th>
                        <th className="text-right py-1.5 px-1 font-bold text-dark-charcoal uppercase tracking-wide border-b-2 border-green">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {receiptData.services.map((service, index) => (
                        <tr key={index} className="border-b border-medium-grey">
                          <td className="py-1.5 px-1 text-dark-charcoal">
                            {service.name || 'Service'}
                            {service.duration && (
                              <span className="text-slate-blue ml-1">({service.duration} min)</span>
                            )}
                          </td>
                          <td className="py-1.5 px-1 text-right text-dark-charcoal font-semibold">
                            {formatCurrency(service.price || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-[10px] sm:text-xs text-slate-blue italic py-1">No services listed</p>
                )}
              </div>

              {/* Payment Summary */}
              <div className="receipt-summary mt-2.5 pt-2 border-t-2 border-green">
                <div className="receipt-summary-row flex justify-between text-[10px] sm:text-xs mb-1">
                  <span className="receipt-summary-label text-slate-blue">Subtotal:</span>
                  <span className="receipt-summary-value text-dark-charcoal font-semibold">{formatCurrency(receiptData.payment?.subtotal || 0)}</span>
                </div>
                {(receiptData.payment?.discount || 0) > 0 && (
                  <div className="receipt-summary-row flex justify-between text-[10px] sm:text-xs mb-1">
                    <span className="receipt-summary-label text-slate-blue">Discount:</span>
                    <span className="receipt-summary-value text-red font-semibold">
                      -{formatCurrency(receiptData.payment.discount || 0)}
                    </span>
                  </div>
                )}
                <div className="receipt-summary-row total flex justify-between text-xs sm:text-sm font-bold border-t-2 border-dark-charcoal pt-1.5 mt-1.5">
                  <span className="receipt-summary-label text-dark-charcoal">Total:</span>
                  <span className="receipt-summary-value total text-dark-charcoal">{formatCurrency(receiptData.payment?.total || 0)}</span>
                </div>
                <div className="receipt-summary-row flex justify-between text-[10px] sm:text-xs mt-1.5 pt-1.5 border-t border-medium-grey">
                  <span className="receipt-summary-label text-slate-blue">Payment Method:</span>
                  <span className="receipt-summary-value text-dark-charcoal font-semibold capitalize">{receiptData.payment?.method || 'cash'}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="receipt-footer text-center mt-3 pt-2.5 border-t-2 border-green">
                <p className="thank-you text-[10px] sm:text-xs font-bold text-dark-charcoal mb-1.5">
                  Thank you for your business!
                </p>
                <p className="salon-name text-[10px] sm:text-xs font-semibold text-dark-charcoal mb-0.5">
                  {receiptData.salon?.name || 'Salon'}
                </p>
                {receiptData.salon?.address && (
                  <p className="salon-info text-[9px] sm:text-[10px] text-slate-blue leading-tight mb-0.5">
                    {receiptData.salon.address}
                  </p>
                )}
                <p className="salon-info text-[9px] sm:text-[10px] text-slate-blue mb-1">
                  Phone: {receiptData.salon?.phone || 'N/A'}
                </p>
                <p className="closing text-[10px] sm:text-xs font-semibold text-dark-charcoal mb-2">
                  Visit us again soon!
                </p>
                <div className="mt-2 pt-2 border-t border-medium-grey">
                  <p className="salon-info text-[8px] sm:text-[9px] text-slate-blue leading-tight">
                    Developed by DevAndDone
                  </p>
                  <p className="salon-info text-[8px] sm:text-[9px] text-slate-blue leading-tight">
                    www.devanddone.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
