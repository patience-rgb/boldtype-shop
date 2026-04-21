'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Layout,
  Megaphone,
  Upload,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'

type Props = {
  initialSettings: Record<string, string>
}

function maskKey(val: string) {
  if (!val) return ''
  return '••••••••' + val.slice(-4)
}

function SettingInput({
  label,
  id,
  value,
  onChange,
  placeholder,
  secret,
  hint,
}: {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  secret?: boolean
  hint?: string
}) {
  const [show, setShow] = useState(false)
  const masked = secret && value.startsWith('••••')

  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={secret && !show ? 'password' : 'text'}
          className="input pr-10"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => { if (masked) onChange('') }}
          autoComplete="off"
        />
        {secret && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

function StatusBadge({ configured }: { configured: boolean }) {
  return configured ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
      <CheckCircle2 size={12} /> Connected
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
      <AlertCircle size={12} /> Not configured
    </span>
  )
}

export function SettingsForm({ initialSettings }: Props) {
  const mask = (key: string) => {
    const v = initialSettings[key] || ''
    if (!v) return ''
    if (key.includes('secret') || key.includes('api_key')) return maskKey(v)
    return v
  }

  const [stripeMode, setStripeMode] = useState(initialSettings.stripe_mode || 'test')
  const [stripeLive, setStripeLive] = useState({
    publishable: mask('stripe_publishable_key_live'),
    secret: mask('stripe_secret_key_live'),
    webhook: mask('stripe_webhook_secret_live'),
  })
  const [stripeTest, setStripeTest] = useState({
    publishable: mask('stripe_publishable_key_test'),
    secret: mask('stripe_secret_key_test'),
    webhook: mask('stripe_webhook_secret_test'),
  })

  const [shippingProvider, setShippingProvider] = useState(initialSettings.shipping_provider || 'shipengine')
  const [shipEngineKey, setShipEngineKey] = useState(mask('shipengine_api_key'))
  const [easyshipKey, setEasyshipKey] = useState(mask('easyship_api_key'))
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(initialSettings.free_shipping_threshold || '75')
  const [defaultShippingRate, setDefaultShippingRate] = useState(initialSettings.default_shipping_rate || '9.99')

  // Branding
  const [logoUrl, setLogoUrl] = useState(initialSettings.logo_url || '')
  const [faviconUrl, setFaviconUrl] = useState(initialSettings.favicon_url || '')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)
  const [savingBranding, setSavingBranding] = useState(false)
  const logoRef = useRef<HTMLInputElement>(null)
  const faviconRef = useRef<HTMLInputElement>(null)

  // Announcement bar
  const [annVisible, setAnnVisible] = useState(initialSettings.announcement_visible !== 'false')
  const [annText, setAnnText] = useState(initialSettings.announcement_text || '')
  const [annBg, setAnnBg] = useState(initialSettings.announcement_bg || '#FF3E8E')
  const [savingAnn, setSavingAnn] = useState(false)

  // Hero content
  const [heroH1, setHeroH1] = useState(initialSettings.hero_heading_1 || '')
  const [heroH2, setHeroH2] = useState(initialSettings.hero_heading_2 || '')
  const [heroH3, setHeroH3] = useState(initialSettings.hero_heading_3 || '')
  const [heroSubtitle, setHeroSubtitle] = useState(initialSettings.hero_subtitle || '')
  const [heroBadge, setHeroBadge] = useState(initialSettings.hero_badge || '')
  const [heroBg, setHeroBg] = useState(initialSettings.hero_bg_color || '#0A0A0A')
  const [savingHero, setSavingHero] = useState(false)

  const [savingStripe, setSavingStripe] = useState(false)
  const [savingShipping, setSavingShipping] = useState(false)
  const [showStripeSetup, setShowStripeSetup] = useState(false)
  const [showShippingSetup, setShowShippingSetup] = useState(false)

  const uploadAsset = async (file: File, onUrl: (url: string) => void, setUploading: (v: boolean) => void) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      onUrl(url)
      toast.success('Uploaded!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const saveBranding = async () => {
    setSavingBranding(true)
    try {
      const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ logo_url: logoUrl, favicon_url: faviconUrl }) })
      if (!res.ok) throw new Error()
      toast.success('Branding saved!')
    } catch { toast.error('Failed to save') } finally { setSavingBranding(false) }
  }

  const saveAnnouncement = async () => {
    setSavingAnn(true)
    try {
      const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ announcement_visible: String(annVisible), announcement_text: annText, announcement_bg: annBg }) })
      if (!res.ok) throw new Error()
      toast.success('Announcement saved!')
    } catch { toast.error('Failed to save') } finally { setSavingAnn(false) }
  }

  const saveHero = async () => {
    setSavingHero(true)
    try {
      const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hero_heading_1: heroH1, hero_heading_2: heroH2, hero_heading_3: heroH3, hero_subtitle: heroSubtitle, hero_badge: heroBadge, hero_bg_color: heroBg }) })
      if (!res.ok) throw new Error()
      toast.success('Hero content saved!')
    } catch { toast.error('Failed to save') } finally { setSavingHero(false) }
  }

  const stripeIsConfigured = stripeMode === 'live'
    ? !!(initialSettings.stripe_publishable_key_live && initialSettings.stripe_secret_key_live)
    : !!(initialSettings.stripe_publishable_key_test && initialSettings.stripe_secret_key_test)

  const shippingIsConfigured = shippingProvider === 'shipengine'
    ? !!initialSettings.shipengine_api_key
    : !!initialSettings.easyship_api_key

  const saveStripe = async () => {
    setSavingStripe(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripe_mode: stripeMode,
          stripe_publishable_key_live: stripeLive.publishable,
          stripe_secret_key_live: stripeLive.secret,
          stripe_webhook_secret_live: stripeLive.webhook,
          stripe_publishable_key_test: stripeTest.publishable,
          stripe_secret_key_test: stripeTest.secret,
          stripe_webhook_secret_test: stripeTest.webhook,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Stripe settings saved!')
    } catch {
      toast.error('Failed to save Stripe settings')
    } finally {
      setSavingStripe(false)
    }
  }

  const saveShipping = async () => {
    setSavingShipping(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping_provider: shippingProvider,
          shipengine_api_key: shipEngineKey,
          easyship_api_key: easyshipKey,
          free_shipping_threshold: freeShippingThreshold,
          default_shipping_rate: defaultShippingRate,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Shipping settings saved!')
    } catch {
      toast.error('Failed to save shipping settings')
    } finally {
      setSavingShipping(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="mb-8">
        <h1 className="font-script text-4xl">settings.</h1>
        <p className="text-gray-500 text-sm mt-1">Manage branding, content, payment and shipping</p>
      </div>

      {/* Branding */}
      <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-brand-pink/10 text-brand-pink rounded-xl p-2.5"><ImageIcon size={20} /></div>
            <div>
              <h2 className="font-bold text-base">Site Branding</h2>
              <p className="text-xs text-gray-400">Logo and favicon shown across the site</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {/* Logo */}
          <div>
            <label className="label">Logo</label>
            <p className="text-xs text-gray-400 mb-3">Upload a PNG/SVG. If empty, the text "boldtype." is used.</p>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadAsset(e.target.files[0], setLogoUrl, setUploadingLogo)} />
            {logoUrl ? (
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-40 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                  <Image src={logoUrl} alt="Logo" fill className="object-contain p-1" sizes="160px" />
                </div>
                <button type="button" onClick={() => setLogoUrl('')} className="text-gray-400 hover:text-red-500 transition-colors"><X size={16} /></button>
                <button type="button" onClick={() => logoRef.current?.click()} className="text-xs text-brand-purple font-semibold hover:underline">Change</button>
              </div>
            ) : (
              <button type="button" onClick={() => logoRef.current?.click()} className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-5 py-3 text-sm text-gray-400 hover:border-brand-pink transition-colors">
                <Upload size={16} /> {uploadingLogo ? 'Uploading...' : 'Upload logo image'}
              </button>
            )}
          </div>

          {/* Favicon */}
          <div>
            <label className="label">Favicon</label>
            <p className="text-xs text-gray-400 mb-3">Square image (32×32 or 64×64 recommended). Shown in browser tabs.</p>
            <input ref={faviconRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadAsset(e.target.files[0], setFaviconUrl, setUploadingFavicon)} />
            {faviconUrl ? (
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                  <Image src={faviconUrl} alt="Favicon" fill className="object-contain p-1" sizes="48px" />
                </div>
                <button type="button" onClick={() => setFaviconUrl('')} className="text-gray-400 hover:text-red-500 transition-colors"><X size={16} /></button>
                <button type="button" onClick={() => faviconRef.current?.click()} className="text-xs text-brand-purple font-semibold hover:underline">Change</button>
              </div>
            ) : (
              <button type="button" onClick={() => faviconRef.current?.click()} className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-5 py-3 text-sm text-gray-400 hover:border-brand-pink transition-colors">
                <Upload size={16} /> {uploadingFavicon ? 'Uploading...' : 'Upload favicon image'}
              </button>
            )}
          </div>

          <button type="button" onClick={saveBranding} disabled={savingBranding} className="btn-primary text-sm py-2.5 px-6 disabled:opacity-50">
            <Save size={15} /> {savingBranding ? 'Saving...' : 'Save Branding'}
          </button>
        </div>
      </section>

      {/* Announcement Bar */}
      <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-brand-yellow/20 text-yellow-600 rounded-xl p-2.5"><Megaphone size={20} /></div>
            <div>
              <h2 className="font-bold text-base">Announcement Bar</h2>
              <p className="text-xs text-gray-400">The pink ribbon at the top of every page</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-brand-pink" checked={annVisible} onChange={(e) => setAnnVisible(e.target.checked)} />
            <div>
              <p className="font-semibold text-sm">Show announcement bar</p>
              <p className="text-xs text-gray-400">Uncheck to hide it sitewide</p>
            </div>
          </label>

          <div className={annVisible ? '' : 'opacity-40 pointer-events-none'}>
            <label className="label">Message Text</label>
            <input className="input" value={annText} onChange={(e) => setAnnText(e.target.value)} placeholder="Free shipping on orders over $75 CAD | Find your power color →" />
            <p className="text-xs text-gray-400 mt-1">Use → at the end to auto-link to the color quiz</p>
          </div>

          <div className={annVisible ? '' : 'opacity-40 pointer-events-none'}>
            <label className="label">Background Color</label>
            <div className="flex items-center gap-3">
              <input type="color" className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1" value={annBg} onChange={(e) => setAnnBg(e.target.value)} />
              <input className="input flex-1" value={annBg} onChange={(e) => setAnnBg(e.target.value)} placeholder="#FF3E8E" />
            </div>
          </div>

          {/* Live preview */}
          {annVisible && (
            <div className="rounded-xl overflow-hidden">
              <div className="text-white text-center text-xs font-semibold py-2 px-4" style={{ backgroundColor: annBg || '#FF3E8E' }}>
                {annText || 'Free shipping on orders over $75 CAD | Find your power color →'} <span className="underline">Take the quiz</span>
              </div>
            </div>
          )}

          <button type="button" onClick={saveAnnouncement} disabled={savingAnn} className="btn-primary text-sm py-2.5 px-6 disabled:opacity-50">
            <Save size={15} /> {savingAnn ? 'Saving...' : 'Save Announcement'}
          </button>
        </div>
      </section>

      {/* Hero Content */}
      <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-brand-purple/10 text-brand-purple rounded-xl p-2.5"><Layout size={20} /></div>
            <div>
              <h2 className="font-bold text-base">Hero Section</h2>
              <p className="text-xs text-gray-400">Homepage hero heading and background. Product cards auto-update from featured products.</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="label">Heading Line 1</label>
              <input className="input" value={heroH1} onChange={(e) => setHeroH1(e.target.value)} placeholder="wear your" />
            </div>
            <div>
              <label className="label">Heading Line 2 (pink)</label>
              <input className="input" value={heroH2} onChange={(e) => setHeroH2(e.target.value)} placeholder="boldest" />
            </div>
            <div>
              <label className="label">Heading Line 3 (yellow)</label>
              <input className="input" value={heroH3} onChange={(e) => setHeroH3(e.target.value)} placeholder="colors." />
            </div>
          </div>
          <div>
            <label className="label">Subtitle</label>
            <textarea className="input resize-none h-16" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} placeholder="High-saturation hoodies, tees & sweatshirts..." />
          </div>
          <div>
            <label className="label">Badge Text</label>
            <input className="input" value={heroBadge} onChange={(e) => setHeroBadge(e.target.value)} placeholder="New Collection is Here" />
          </div>
          <div>
            <label className="label">Background Color</label>
            <div className="flex items-center gap-3">
              <input type="color" className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1" value={heroBg} onChange={(e) => setHeroBg(e.target.value)} />
              <input className="input flex-1" value={heroBg} onChange={(e) => setHeroBg(e.target.value)} placeholder="#0A0A0A" />
            </div>
            <p className="text-xs text-gray-400 mt-1">Dark colors work best — text is always white</p>
          </div>
          <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
            <strong>Product cards:</strong> The 3 product cards in the hero automatically show your top featured products. Mark products as "featured" in the product editor to control which ones appear.
          </p>
          <button type="button" onClick={saveHero} disabled={savingHero} className="btn-primary text-sm py-2.5 px-6 disabled:opacity-50">
            <Save size={15} /> {savingHero ? 'Saving...' : 'Save Hero Content'}
          </button>
        </div>
      </section>

      {/* Stripe */}
      <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-brand-purple/10 text-brand-purple rounded-xl p-2.5">
                <CreditCard size={20} />
              </div>
              <div>
                <h2 className="font-bold text-base">Stripe Payments</h2>
                <p className="text-xs text-gray-400">Accept credit cards, Apple Pay, Google Pay</p>
              </div>
            </div>
            <StatusBadge configured={stripeIsConfigured} />
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Mode toggle */}
          <div>
            <label className="label">Mode</label>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => setStripeMode('test')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  stripeMode === 'test'
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                Test Mode
              </button>
              <button
                type="button"
                onClick={() => setStripeMode('live')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  stripeMode === 'live'
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                Live Mode
              </button>
            </div>
            {stripeMode === 'test' && (
              <p className="text-xs text-amber-600 mt-2 font-medium">Test mode — no real charges. Use Stripe test cards.</p>
            )}
            {stripeMode === 'live' && (
              <p className="text-xs text-green-600 mt-2 font-medium">Live mode — real charges will be processed.</p>
            )}
          </div>

          {stripeMode === 'test' ? (
            <>
              <SettingInput label="Publishable Key (Test)" id="stripe_pk_test" value={stripeTest.publishable} onChange={(v) => setStripeTest((s) => ({ ...s, publishable: v }))} placeholder="pk_test_..." hint="Starts with pk_test_" />
              <SettingInput label="Secret Key (Test)" id="stripe_sk_test" value={stripeTest.secret} onChange={(v) => setStripeTest((s) => ({ ...s, secret: v }))} placeholder="sk_test_..." secret hint="Starts with sk_test_ — never share this" />
              <SettingInput label="Webhook Secret (Test)" id="stripe_wh_test" value={stripeTest.webhook} onChange={(v) => setStripeTest((s) => ({ ...s, webhook: v }))} placeholder="whsec_..." secret hint="From Stripe Dashboard → Webhooks" />
            </>
          ) : (
            <>
              <SettingInput label="Publishable Key (Live)" id="stripe_pk_live" value={stripeLive.publishable} onChange={(v) => setStripeLive((s) => ({ ...s, publishable: v }))} placeholder="pk_live_..." hint="Starts with pk_live_" />
              <SettingInput label="Secret Key (Live)" id="stripe_sk_live" value={stripeLive.secret} onChange={(v) => setStripeLive((s) => ({ ...s, secret: v }))} placeholder="sk_live_..." secret hint="Starts with sk_live_ — never share this" />
              <SettingInput label="Webhook Secret (Live)" id="stripe_wh_live" value={stripeLive.webhook} onChange={(v) => setStripeLive((s) => ({ ...s, webhook: v }))} placeholder="whsec_..." secret hint="From Stripe Dashboard → Webhooks" />
            </>
          )}

          {/* Setup guide toggle */}
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-brand-purple font-semibold hover:underline"
            onClick={() => setShowStripeSetup(!showStripeSetup)}
          >
            {showStripeSetup ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            How to get your Stripe keys
          </button>

          {showStripeSetup && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-1.5">
                <li>Go to <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-brand-purple underline inline-flex items-center gap-0.5">Stripe Dashboard → API Keys <ExternalLink size={11} /></a></li>
                <li>Copy your <strong>Publishable key</strong> and <strong>Secret key</strong></li>
                <li>For webhooks: Stripe Dashboard → Webhooks → Add endpoint</li>
                <li>Endpoint URL: <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">https://yourdomain.com/api/webhooks/stripe</code></li>
                <li>Select events: <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">checkout.session.completed</code>, <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">payment_intent.succeeded</code></li>
                <li>Copy the <strong>Signing secret</strong> shown after creation</li>
              </ol>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={saveStripe}
              disabled={savingStripe}
              className="btn-primary text-sm py-2.5 px-6 disabled:opacity-50"
            >
              <Save size={15} /> {savingStripe ? 'Saving...' : 'Save Stripe Settings'}
            </button>
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-brand-blue/10 text-brand-blue rounded-xl p-2.5">
                <Truck size={20} />
              </div>
              <div>
                <h2 className="font-bold text-base">Shipping API</h2>
                <p className="text-xs text-gray-400">Get live rates and print labels</p>
              </div>
            </div>
            <StatusBadge configured={shippingIsConfigured} />
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Provider selector */}
          <div>
            <label className="label">Shipping Provider</label>
            <div className="flex gap-2 mt-1">
              {[
                { id: 'shipengine', label: 'ShipEngine', desc: 'Multi-carrier (UPS, FedEx, USPS, Canada Post)' },
                { id: 'easyship', label: 'Easyship', desc: 'Global rates with duties calculator' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setShippingProvider(p.id)}
                  className={`flex-1 p-3 rounded-xl text-left text-sm border transition-all ${
                    shippingProvider === p.id
                      ? 'bg-brand-blue/5 border-brand-blue text-brand-blue'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">{p.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {shippingProvider === 'shipengine' ? (
            <SettingInput
              label="ShipEngine API Key"
              id="shipengine_api_key"
              value={shipEngineKey}
              onChange={setShipEngineKey}
              placeholder="TEST_abcdefgh..."
              secret
              hint="From app.shipengine.com → API Management"
            />
          ) : (
            <SettingInput
              label="Easyship API Key"
              id="easyship_api_key"
              value={easyshipKey}
              onChange={setEasyshipKey}
              placeholder="prod_abcdefgh..."
              secret
              hint="From app.easyship.com → API Credentials"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Free Shipping Threshold (CAD $)</label>
              <input
                type="number"
                className="input"
                value={freeShippingThreshold}
                min="0"
                step="0.01"
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">Orders above this amount ship free</p>
            </div>
            <div>
              <label className="label">Flat Shipping Rate (CAD $)</label>
              <input
                type="number"
                className="input"
                value={defaultShippingRate}
                min="0"
                step="0.01"
                onChange={(e) => setDefaultShippingRate(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">Used when API is not configured</p>
            </div>
          </div>

          {/* Setup guide toggle */}
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-brand-blue font-semibold hover:underline"
            onClick={() => setShowShippingSetup(!showShippingSetup)}
          >
            {showShippingSetup ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            How to get your {shippingProvider === 'shipengine' ? 'ShipEngine' : 'Easyship'} key
          </button>

          {showShippingSetup && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 text-gray-600">
              {shippingProvider === 'shipengine' ? (
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Sign up at <a href="https://app.shipengine.com" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline inline-flex items-center gap-0.5">app.shipengine.com <ExternalLink size={11} /></a></li>
                  <li>Go to <strong>API Management</strong> in the sidebar</li>
                  <li>Click <strong>Create API Key</strong> and give it a name</li>
                  <li>Copy the generated key and paste it above</li>
                  <li>Connect your Canada Post, UPS, or FedEx account under <strong>Carriers</strong></li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Sign up at <a href="https://app.easyship.com" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline inline-flex items-center gap-0.5">app.easyship.com <ExternalLink size={11} /></a></li>
                  <li>Go to <strong>Settings → API Credentials</strong></li>
                  <li>Generate a <strong>Production API Key</strong></li>
                  <li>Copy the key and paste it above</li>
                </ol>
              )}
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={saveShipping}
              disabled={savingShipping}
              className="btn-primary text-sm py-2.5 px-6 disabled:opacity-50"
            >
              <Save size={15} /> {savingShipping ? 'Saving...' : 'Save Shipping Settings'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
