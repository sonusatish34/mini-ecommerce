import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const cart = useSelector(state => state.cart.items)
  const [mounted, setMounted] = useState(false)

  // This only runs on the client after the first render
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 text-slate-900 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-black tracking-tighter">
          MINI<span className="text-blue-600">STORE</span>
        </Link>
        
        <div className="flex gap-8 items-center font-medium">
          <Link href="/products" className="hover:text-blue-600 transition">Products</Link>
          
          <Link href="/cart" className="relative group">
            <span className="hover:text-blue-600 transition">Cart</span>
            {/* Only show the count if mounted is true. 
              This prevents the Server vs Client mismatch error.
            */}
            {mounted && cart.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm animate-in fade-in zoom-in">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}