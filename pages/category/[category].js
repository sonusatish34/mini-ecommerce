import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import ProductCard from "../../components/ProductCard";

export default function CategoryProducts() {
  const router = useRouter();
  const { category } = router.query;

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevance");

  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState(2000);
  const [minRating, setMinRating] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (!category) return;

    fetch(`https://dummyjson.com/products/category/${category}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, [category]);

  const brands = ["All", ...new Set(products.map((p) => p.brand).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesBrand = selectedBrand === "All" || p.brand === selectedBrand;
      const matchesPrice = p.price <= priceRange;
      const matchesRating = p.rating >= minRating;

      return matchesSearch && matchesBrand && matchesPrice && matchesRating;
    });

    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    if (sort === "newest") result.sort((a, b) => b.id - a.id);

    return result;
  }, [products, search, selectedBrand, priceRange, minRating, sort]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* TOP BAR */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">

          <h1 className="text-xl font-bold capitalize">
            {category?.replace("-", " ")}
          </h1>

          <div className="relative w-full md:w-96">
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full outline-none"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            className="border p-2 rounded-lg"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="low">Price Low → High</option>
            <option value="high">Price High → Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">

        {/* FILTER SIDEBAR */}
        <aside className="w-full lg:w-64 space-y-8">

          <div>
            <h3 className="font-bold mb-4">Brand</h3>

            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    selectedBrand === brand
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">
              Price Range (Max ${priceRange})
            </h3>

            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceRange}
              onChange={(e) => {
                setPriceRange(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full"
            />
          </div>

          <div>
            <h3 className="font-bold mb-4">Minimum Rating</h3>

            <div className="flex gap-2">
              {[4, 3, 2, 1].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setMinRating(num);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 border rounded ${
                    minRating === num ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  {num}★+
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* PRODUCT GRID */}
        <div className="flex-1">

          <p className="text-sm mb-4">
            {filteredProducts.length} items found
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentItems.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* PAGINATION */}

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-3">

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 border rounded"
              >
                Prev
              </button>

              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 border rounded"
              >
                Next
              </button>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}