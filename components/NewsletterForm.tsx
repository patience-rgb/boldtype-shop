'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export function NewsletterForm() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    toast.success("You're in! Bold inspo incoming")
    setEmail('')
  }

  return (
    <form className="flex gap-2 max-w-md mx-auto" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 rounded-full text-brand-black text-sm font-medium focus:outline-none"
      />
      <button
        type="submit"
        className="bg-brand-black text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors whitespace-nowrap"
      >
        Count Me In!
      </button>
    </form>
  )
}
