import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import Link from 'next/link'
import { useRouter } from 'next/router'
// Premium Unsplash Images for the Hero Carousel
const HERO_SLIDES = [
  {
    id: 1,
    title: "Summer Collection 2026",
    sub: "Limited Edition",
    highlight: "Up to 50% Off",
    // Premium image of people at a beach with summer clothing
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop",
    color: "from-blue-900/80 to-slate-900/80" // Overlay gradient
  },
  {
    id: 2,
    title: "Tech Essentials",
    sub: "Curated Gear",
    highlight: "New Arrivals",
    // Minimalist image of high-end tech/gadgets
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2000&auto=format&fit=crop",
    color: "from-slate-900/90 to-black/80" // Darker overlay for contrast
  }
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=8')
      .then(res => res.json())
      .then(data => setProducts(data.products))

    // Auto-play carousel
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1))
    }, 6000) // Slightly longer 6-second timer
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 1. PREMIUM HERO CAROUSEL */}
      <section className="relative h-[400px] md:h-[600px] w-full overflow-hidden bg-slate-900">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient Overlay for Text Legibility */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} `} />

            {/* Hero Content */}
            <div className="relative z-10 flex items-center justify-center h-full text-center px-4 max-w-7xl mx-auto">
              <div>
                <span className="inline-block text-xs uppercase tracking-[0.3em] mb-3 text-blue-200 font-bold">
                  {slide.sub}
                </span>
                <h1 className="text-4xl md:text-7xl font-black mb-6 text-white tracking-tighter leading-none">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl font-light text-slate-200 mb-10 max-w-2xl mx-auto">
                  Find your perfect match with our <span className="text-white font-bold">{slide.highlight}</span>. Shop the look before it’s gone.
                </p>
                <div className="flex gap-4 justify-center">
                  <button className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-slate-900/20">
                    Shop Now
                  </button>
                  <button className="bg-white/10 text-white backdrop-blur-sm px-10 py-4 rounded-full font-bold hover:bg-white/20 transition-all">
                    Discover More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Simple Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2.5 rounded-full transition-all ${currentSlide === i ? 'bg-white w-10' : 'bg-white/50 w-2.5'}`}
            />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. ENHANCED FEATURED CATEGORIES */}
        <section className="py-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-sm font-bold tracking-widest text-blue-600 uppercase">Categories</span>
              <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tighter">Curated Collections</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'groceries', img: 'https://images.unsplash.com/photo-1652262968340-b735524f9ae4?q=80&w=1060&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
              { name: 'furniture', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
              { name: "fragrances", img: 'https://images.unsplash.com/photo-1672848700906-2b8ca62639e4?q=80&w=1203&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
              { name: "smartphones", img: 'https://images.unsplash.com/photo-1721686602598-005825cce7c8?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
            ].map((cat) => (
              <div
                key={cat.name}
                onClick={() =>
                  router.push(`/category/${encodeURIComponent(cat.name)}`)
                }
                className="group relative h-48 md:h-56 flex items-center justify-center rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition"
                />

                <div className="absolute inset-0 bg-black/40" />

                <p className="relative text-white font-bold text-xl uppercase">
                  {cat.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. REFINED TRENDING PRODUCTS */}
        <section className="pb-16">
          <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-8">
            <div>
              <span className="text-sm font-bold tracking-widest text-blue-600 uppercase">Explore</span>
              <h2 className="text-4xl font-black text-slate-900 mt-1 tracking-tighter">Trending Now</h2>
            </div>
            <Link href="/products" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group flex items-center gap-2">
              View All
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </div>
  )
}