export default function DataTable({ columns, data, rowKey, emptyText = "No records found." }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#eadccf] bg-white">
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
          {data.map((row) => (
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
    </div>
  );
}
