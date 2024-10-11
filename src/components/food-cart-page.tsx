'use client'

import { useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Payment from '@/components/payment'

interface FoodItem {
  id: number
  name: string
  price: number
  image: string
  type: 'pizza' | 'smoothie'
  details: string
}

interface CartItem extends FoodItem {
  quantity: number
}

const foodItems: FoodItem[] = [
  { id: 1, name: "Margherita Pizza", price: 12.99, image: "/images/pizza.jpg", type: 'pizza', details: "Tomato sauce, mozzarella, basil" },
  { id: 2, name: "Pepperoni Pizza", price: 14.99, image: "/images/pizza.jpg", type: 'pizza', details: "Tomato sauce, mozzarella, pepperoni" },
  { id: 3, name: "Berry Blast Smoothie", price: 6.99, image: "/images/smoothie.jpg", type: 'smoothie', details: "Strawberries, blueberries, banana, yogurt" },
  { id: 4, name: "Green Machine Smoothie", price: 7.99, image: "/images/smoothie.jpg", type: 'smoothie', details: "Spinach, kale, banana, mango, chia seeds" },
]

function MenuCard({ item, onAddToCart }: { item: FoodItem; onAddToCart: (item: FoodItem) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.details}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-md mb-4" />
        <p className="text-lg font-semibold text-green-600">${item.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onAddToCart(item)} className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}

function CartItem({ item, onUpdateQuantity, onRemove }: { item: CartItem; onUpdateQuantity: (id: number, quantity: number) => void; onRemove: (id: number) => void }) {
  return (
    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white p-6 shadow-lg rounded-xl">
      <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-lg" />
      <div className="flex-grow space-y-2">
        <h2 className="text-xl font-semibold">{item.name}</h2>
        <p className="text-gray-600 text-sm">{item.details}</p>
        <p className="text-lg font-medium text-green-600">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center text-lg font-medium">{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <button onClick={() => onRemove(item.id)} className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors">
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}

function CheckoutDialog({ isOpen, onClose, subtotal }: { isOpen: boolean; onClose: () => void; subtotal: number }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Complete your order by providing delivery and payment information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Your order total: <span className="font-semibold">${subtotal.toFixed(2)}</span></p>
          <Payment />
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Complete Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function FoodCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const addToCart = (foodItem: FoodItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === foodItem.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.id === foodItem.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prevItems, { ...foodItem, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      ).filter(item => item.quantity > 0)
    )
  }

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Mon&apos;s restaurant 😀</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {foodItems.map((item) => (
            <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty. Add some delicious items!</p>
      ) : (
        <>
          <div className="space-y-8">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
            ))}
          </div>
          <div className="mt-12 flex flex-col sm:flex-row sm:justify-between items-center bg-gray-100 p-6 rounded-xl">
            <p className="text-2xl font-semibold mb-4 sm:mb-0">
              Subtotal: <span className="text-green-600">${subtotal.toFixed(2)}</span>
            </p>
            <Button className="w-full sm:w-auto text-lg py-6 px-8" onClick={() => setIsCheckoutOpen(true)}>
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}

      <CheckoutDialog isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} subtotal={subtotal} />
    </div>
  )
}
