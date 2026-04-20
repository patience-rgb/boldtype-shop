import { Ruler } from 'lucide-react'

export const metadata = { title: 'Size Guide' }

export default function SizeGuidePage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-script text-5xl text-brand-pink mb-4 flex items-center gap-3">size guide. <Ruler size={40} /></h1>
        <p className="text-gray-600 mb-8">All measurements in inches. When in doubt, size up for a relaxed fit.</p>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-bold text-gray-400 uppercase tracking-wider text-xs">Size</th>
                <th className="px-5 py-3 text-left font-bold text-gray-400 uppercase tracking-wider text-xs">Chest</th>
                <th className="px-5 py-3 text-left font-bold text-gray-400 uppercase tracking-wider text-xs">Length</th>
                <th className="px-5 py-3 text-left font-bold text-gray-400 uppercase tracking-wider text-xs">Sleeve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { size: 'XS', chest: '32–34', length: '26', sleeve: '32' },
                { size: 'S', chest: '35–37', length: '27', sleeve: '33' },
                { size: 'M', chest: '38–40', length: '28', sleeve: '34' },
                { size: 'L', chest: '41–43', length: '29', sleeve: '35' },
                { size: 'XL', chest: '44–46', length: '30', sleeve: '36' },
                { size: 'XXL', chest: '47–49', length: '31', sleeve: '37' },
              ].map((row) => (
                <tr key={row.size} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-bold">{row.size}</td>
                  <td className="px-5 py-3 text-gray-600">{row.chest}"</td>
                  <td className="px-5 py-3 text-gray-600">{row.length}"</td>
                  <td className="px-5 py-3 text-gray-600">{row.sleeve}"</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
