'use client';

export default function ResponsiveTable({ children, headers, data, renderRow, emptyMessage = 'No data found' }) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-medium-grey rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-medium-grey">
              <tr>
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{children || (data && data.map(renderRow))}</tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data && data.length === 0 ? (
          <div className="bg-white border border-medium-grey rounded-lg p-6 text-center text-slate-blue">
            {emptyMessage}
          </div>
        ) : (
          data && data.map((item, idx) => (
            <div key={idx} className="bg-white border border-medium-grey rounded-lg p-4">
              {renderRow(item, true)}
            </div>
          ))
        )}
      </div>
    </>
  );
}
