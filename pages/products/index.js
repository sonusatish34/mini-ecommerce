import { useEffect, useState, useMemo } from 'react'
import ProductCard from '../../components/ProductCard'

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('relevance')
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [priceRange, setPriceRange] = useState(2000)
  const [minRating, setMinRating] = useState(0)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=100')
      .then(res => res.json())
      .then(data => setProducts(data.products))
  }, [])

  // Derived Data for Filters (Get unique categories/brands)
  const categories = ['All', ...new Set(products.map(p => p.category))]
  const brands = ['All', ...new Set(products.map(p => p.brand).filter(Boolean))]

  // --- CORE LOGIC: FILTERING & SORTING ---
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
      const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand
      const matchesPrice = p.price <= priceRange
      const matchesRating = p.rating >= minRating
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating
    })

    // Sorting
    if (sort === 'low') result.sort((a, b) => a.price - b.price)
    if (sort === 'high') result.sort((a, b) => b.price - a.price)
    if (sort === 'newest') result.sort((a, b) => b.id - a.id) // DummyJSON id as proxy for date

    return result
  }, [products, search, selectedCategory, selectedBrand, priceRange, minRating, sort])

  // Pagination Calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. STICKY TOP BAR (Search & Sort) */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {setSearch(e.target.value); setCurrentPage(1)}}
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
             <select 
               className="bg-white border border-slate-200 text-sm rounded-lg p-2 outline-none min-w-[140px]"
               value={sort}
               onChange={(e) => setSort(e.target.value)}
             >
               <option value="relevance">Relevance</option>
               <option value="low">Price: Low to High</option>
               <option value="high">Price: High to Low</option>
               <option value="newest">Newest First</option>
             </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* 2. FILTER SIDEBAR (Hidden on mobile, or toggleable) */}
        <aside className="w-full lg:w-64 space-y-8 flex-shrink-0">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Category</h3>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2">
              {categories.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => {setSelectedCategory(cat); setCurrentPage(1)}}
                  className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap text-left transition ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Price Range (Max: ${priceRange})</h3>
            <input 
              type="range" min="0" max="2000" step="50"
              value={priceRange}
              onChange={(e) => {setPriceRange(e.target.value); setCurrentPage(1)}}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Minimum Rating</h3>
            <div className="flex gap-2">
              {[4, 3, 2, 1].map(num => (
                <button 
                  key={num}
                  onClick={() => {setMinRating(num); setCurrentPage(1)}}
                  className={`flex-1 py-2 rounded-lg border text-xs font-bold transition ${minRating === num ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-400'}`}
                >
                  {num}★ +
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* 3. PRODUCT GRID */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm text-slate-500 font-medium">{filteredProducts.length} items found</p>
          </div>

          {currentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentItems.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">No results found for your filters.</p>
              <button 
                onClick={() => {setSelectedCategory('All'); setSearch(''); setPriceRange(2000); setMinRating(0)}}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* 4. PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-4 py-2 bg-white border rounded-xl disabled:opacity-50"
              >
                Prev
              </button>
              <div className="flex items-center px-4 font-bold text-slate-700">
                Page {currentPage} of {totalPages}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-4 py-2 bg-white border rounded-xl disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}