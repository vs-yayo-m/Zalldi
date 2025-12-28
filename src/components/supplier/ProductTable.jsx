import React from "react";

export default function ProductTable({ products = [] }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Product Name
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Category
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Price
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Stock
            </th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="px-4 py-4 text-center text-sm text-gray-500"
              >
                No products available
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2 text-sm text-gray-800">
                  {product.name || "—"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {product.category || "—"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {product.price ? `₹${product.price}` : "—"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {product.stock ?? "—"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}