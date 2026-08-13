import React, { useMemo } from "react";
import { useSearchParams } from "react-router";

export default function Category() {
  return (
    <div>
      <h1>Category</h1>
    </div>
  );
}

// const mockProducts = [
//   { id: 1, name: "iPhone 15", category: "electronics" },
//   { id: 2, name: "Running Shoes", category: "shoes" },
//   { id: 3, name: "MacBook Pro", category: "electronics" },
// ];

// export default function ProductList() {
//   // 1. Hook reads and updates URL query parameters (e.g., ?category=electronics)
//   const [searchParams, setSearchParams] = useSearchParams();

//   // 2. Extract current filter value from URL (default to empty string)
//   const currentCategory = searchParams.get("category") || "";

//   // 3. Filter data on each change; useMemo optimizes computation performance
//   const filteredProducts = useMemo(() => {
//     if (!currentCategory) return mockProducts;
//     return mockProducts.filter((p) => p.category === currentCategory);
//   }, [currentCategory]);

//   // 4. Update URL parameter when user interacts with UI
//   const handleFilterChange = (category) => {
//     if (category) {
//       setSearchParams({ category });
//     } else {
//       setSearchParams({}); // Clear filter
//     }
//   };

//   return (
//     <div>
//       {/* Filter Buttons */}
//       <button onClick={() => handleFilterChange("")}>All</button>
//       <button onClick={() => handleFilterChange("electronics")}>
//         Electronics
//       </button>
//       <button onClick={() => handleFilterChange("shoes")}>Shoes</button>

//       {/* Render Filtered Data */}
//       <ul>
//         {filteredProducts.map((product) => (
//           <li key={product.id}>
//             {product.name} ({product.category})
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

///////////////////////////////////////////////////////
// import { useSearchParams } from "react-router-dom";

// export function FilteredProducts() {
//   const [searchParams, setSearchParams] = useSearchParams();

//   // 1. Read all active params (provide default fallback values)
//   const category = searchParams.get("category") || "all";
//   const color = searchParams.get("color") || "all";
//   const size = searchParams.get("size") || "all";

//   // 2. Update multiple filters at the same time
//   const applyFilters = (newCategory, newColor) => {
//     setSearchParams({
//       ...Object.fromEntries(searchParams), // Step A: Keep existing params (like size)
//       category: newCategory, // Step B: Update or add category
//       color: newColor, // Step C: Update or add color
//     });
//   };

//   // 3. Clear all filters at once
//   const resetAllFilters = () => {
//     setSearchParams({}); // Empties the query string completely
//   };

//   return (
//     <div>
//       {/* Example Button: Updates Category and Color, Preserves Size */}
//       <button onClick={() => applyFilters("shoes", "red")}>
//         Filter: Red Shoes
//       </button>

//       <button onClick={resetAllFilters}>Reset All</button>

//       <div>
//         <h3>Active Filters:</h3>
//         <ul>
//           <li>Category: {category}</li>
//           <li>Color: {color}</li>
//           <li>Size: {size}</li>
//         </ul>
//       </div>
//     </div>
//   );
// }
