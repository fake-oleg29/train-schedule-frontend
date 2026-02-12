import React from 'react';

interface TableColumn<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  className?: string;
}

export const Table = <T,>({ columns, data, keyExtractor, className = '' }: TableProps<T>) => {
  if (data.length === 0) {
    return null;
  }

  return (
    <div className={`border border-gray-300 ${className}`}>
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-100">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-4 py-2 text-left text-sm font-medium ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="border-b border-gray-200">
              {columns.map((column, index) => (
                <td key={index} className={`px-4 py-3 ${column.className || ''}`}>
                  {typeof column.accessor(row) === 'string' || typeof column.accessor(row) === 'number' ? (
                    <div>{column.accessor(row)}</div>
                  ) : (
                    column.accessor(row)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

