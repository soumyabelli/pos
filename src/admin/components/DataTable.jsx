import { useState } from "react";

export default function DataTable({ columns, data, rowKey, emptyText = "No records found.", rowsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#eadccf] bg-white flex flex-col">
      <table className="min-w-full border-collapse text-left">
        <thead className="bg-[#faf3eb]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#8B6F47] ${column.headerClassName || ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
              className="px-4 py-10 text-center text-sm font-medium text-[#8B6F47]"
              >
                {emptyText}
              </td>
            </tr>
          )}
          {paginatedData.map((row) => (
            <tr
              key={typeof rowKey === "function" ? rowKey(row) : row[rowKey]}
              className="border-t border-[#f1e4d8] transition hover:bg-[#fff9f2]"
            >
              {columns.map((column) => (
                <td key={column.key} className={`px-4 py-3.5 text-[0.93rem] text-[#3E2723] ${column.cellClassName || ""}`}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination Controls */}
      {data.length > rowsPerPage && (
        <div className="flex items-center justify-between border-t border-[#f1e4d8] px-6 py-4 bg-white rounded-b-2xl">
          <div className="text-sm text-[#8B6F47]">
            Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + rowsPerPage, data.length)}</span> of <span className="font-medium">{data.length}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-[#eadccf] rounded-lg text-sm text-[#3E2723] hover:bg-[#faf3eb] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition ${
                    currentPage === idx + 1 
                      ? "bg-[#D4853D] text-white font-bold" 
                      : "text-[#8B6F47] hover:bg-[#faf3eb]"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-[#eadccf] rounded-lg text-sm text-[#3E2723] hover:bg-[#faf3eb] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
