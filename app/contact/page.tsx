import { Leaf } from 'lucide-react'

export const metadata = { title: 'Contact Us' }

export default function ContactPage() {
  return (
    <div className="pt-[104px] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-script text-5xl text-brand-pink mb-6">say hi.</h1>
        <p className="text-gray-600 mb-10">We'd love to hear from you. Questions, feedback, collab ideas — hit us up.</p>
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-4">
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
            <a href="mailto:hello@boldtypefit.ca" className="text-brand-pink font-semibold hover:underline">hello@boldtypefit.ca</a>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Response Time</p>
            <p className="text-gray-700">We typically reply within 1–2 business days.</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
            <p className="text-gray-700 flex items-center gap-1.5">Canada <Leaf size={16} className="text-red-500" /></p>
          </div>
        </div>
      </div>
    </div>
  )
}
