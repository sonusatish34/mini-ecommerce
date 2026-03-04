import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleQuickAdd = (e) => {
    e.preventDefault(); // Prevents the Link from triggering
    e.stopPropagation(); // Stops event bubbling
    dispatch(addToCart({ ...product, quantity: 1 }));
    // You could add a small toast notification here!
  };

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="relative overflow-hidden bg-white rounded-2xl transition-all duration-300 hover:shadow-xl border border-slate-100 flex flex-col h-full">
        {/* Image Container */}
        <div className="aspect-square overflow-hidden bg-slate-100 relative">
          <img 
            src={product.thumbnail} 
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Discount Badge (if exists) */}
          {product.discountPercentage > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
            {product.category}
          </span>
          <h2 className="text-slate-800 font-semibold truncate group-hover:text-blue-600 transition-colors">
            {product.title}
          </h2>
          
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div>
              <p className="text-lg font-black text-slate-900">${product.price}</p>
              <p className="text-xs text-slate-400 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </p>
            </div>
            
            <button 
              onClick={handleQuickAdd}
              className="rounded-xl bg-slate-900 p-2.5 text-white transition-all duration-300 hover:bg-blue-600 active:scale-90 shadow-md"
              title="Quick Add to Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}