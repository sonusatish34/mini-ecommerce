import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice'
import { useState } from 'react'
import Link from 'next/link'

export default function Cart() {
  const items = useSelector(state => state.cart.items)
  const dispatch = useDispatch()
  
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', address: '', city: '' })

  // Calculations
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const finalTotal = subtotal + (subtotal * 0.05) // Adding 5% tax

  const handleCheckoutSubmit = (e) => {
    e.preventDefault()
    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true)
      dispatch(clearCart())
    }, 1500)
  }

  if (items.length === 0 && !isSuccess) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
      <Link href="/products" className="bg-black text-white px-6 py-2 rounded-lg">Go Shopping</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-10">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-2xl flex gap-4 items-center shadow-sm">
                <img src={item.thumbnail} className="w-20 h-20 object-contain bg-slate-50 rounded-lg" alt="" />
                <div className="flex-1">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-blue-600 font-bold">${item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                   <button onClick={() => dispatch(updateQuantity({id: item.id, quantity: Math.max(1, item.quantity - 1)}))} className="w-8 h-8 bg-slate-100 rounded-full">-</button>
                   <span className="font-bold">{item.quantity}</span>
                   <button onClick={() => dispatch(updateQuantity({id: item.id, quantity: item.quantity + 1}))} className="w-8 h-8 bg-slate-100 rounded-full">+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sticky Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm h-fit sticky top-24">
            <h3 className="text-xl font-bold mb-4">Summary</h3>
            <div className="flex justify-between mb-2 text-slate-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between mb-6 font-bold text-lg border-t pt-4"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* --- CHECKOUT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {!isSuccess ? (
              <form onSubmit={handleCheckoutSubmit} className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black">Checkout</h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400">✕</button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Full Name</label>
                    <input required className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500" type="text" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Email Address</label>
                    <input required className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500" type="email" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Shipping Address</label>
                    <textarea required className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500" rows="3" placeholder="123 Street Name, City"></textarea>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex justify-between mb-4">
                    <span className="font-bold">Total to Pay</span>
                    <span className="font-black text-blue-600">${finalTotal.toFixed(2)}</span>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                    Place Order
                  </button>
                </div>
              </form>
            ) : (
              /* Success Message */
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-black mb-2">Order Success!</h2>
                <p className="text-slate-500 mb-8">Your items are on the way. Thank you for shopping with us!</p>
                <button 
                  onClick={() => {setIsModalOpen(false); setIsSuccess(false)}}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold"
                >
                  <Link href="/">Back to Home</Link>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}