import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/cartSlice'
import { toggleWishlist } from '../../store/wishlistSlice'
import ProductCard from '../../components/ProductCard'

export default function PDP() {
  const { query } = useRouter()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState('Default')

  useEffect(() => {
    if (query.id) {
      // Fetch Main Product
      fetch(`https://dummyjson.com/products/${query.id}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data)
          // Fetch Similar Products based on category
          fetch(`https://dummyjson.com/products/category/${data.category}?limit=4`)
            .then(res => res.json())
            .then(simData => setSimilarProducts(simData.products.filter(p => p.id !== data.id)))
        })
    }
  }, [query.id])

  if (!product) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )

  // Use product images or fallback to thumbnail if array is small
  const images = product.images?.length >= 3 ? product.images : [product.thumbnail, product.thumbnail, product.thumbnail]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        
        {/* --- MAIN PRODUCT SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          
          {/* 1. IMAGE CAROUSEL (Left) */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
              {images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${activeImg === i ? 'border-blue-600' : 'border-transparent bg-slate-50'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="preview" />
                </button>
              ))}
            </div>
            {/* Main Display */}
            <div className="flex-1 aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100">
              <img src={images[activeImg]} className="w-full h-full object-contain p-6 mix-blend-multiply" alt={product.title} />
            </div>
          </div>

          {/* 2. PRODUCT INFO (Right) */}
          <div className="flex flex-col justify-center">
            <nav className="text-sm text-slate-400 mb-4 capitalize">
              Home / {product.category} / {product.brand}
            </nav>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-slate-900">${product.price}</span>
              {product.discountPercentage && (
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  Save {Math.round(product.discountPercentage)}%
                </span>
              )}
            </div>

            <p className="text-slate-600 leading-relaxed mb-8 border-b border-slate-100 pb-8">
              {product.description}
            </p>

            {/* --- VARIANT SELECTORS --- */}
            <div className="space-y-6 mb-10">
              {/* Color Selector */}
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3 block">Color: {selectedColor}</span>
                <div className="flex gap-3">
                  {['Default', 'Space Gray', 'Silver'].map(color => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${selectedColor === color ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3 block">Select Size</span>
                <div className="flex gap-3">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 text-sm font-bold transition ${selectedSize === size ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* --- QUANTITY & ACTIONS --- */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center bg-slate-100 rounded-2xl p-1 h-14">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-full text-xl font-bold hover:text-blue-600 transition">-</button>
                <span className="w-12 text-center font-bold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-12 h-full text-xl font-bold hover:text-blue-600 transition">+</button>
              </div>

              <button
                className="flex-1 bg-slate-900 text-white font-bold rounded-2xl h-14 hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                onClick={() => dispatch(addToCart({...product, quantity: qty, size: selectedSize, color: selectedColor}))}
              >
                Add to Cart
              </button>

              <button
                className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-slate-100 hover:bg-slate-50 transition"
                onClick={() => dispatch(toggleWishlist(product))}
              >
                <svg className="w-6 h-6 text-slate-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* --- SIMILAR PRODUCTS SECTION --- */}
        {similarProducts.length > 0 && (
          <section className="border-t border-slate-100 pt-16">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-3xl font-black tracking-tight">You Might Also Like</h2>
              <div className="hidden md:flex gap-2">
                 <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
                 <div className="w-2 h-1 bg-slate-200 rounded-full"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}