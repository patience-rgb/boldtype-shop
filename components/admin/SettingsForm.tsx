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
} from 'lucide-react'

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

  const [savingStripe, setSavingStripe] = useState(false)
  const [savingShipping, setSavingShipping] = useState(false)
  const [showStripeSetup, setShowStripeSetup] = useState(false)
  const [showShippingSetup, setShowShippingSetup] = useState(false)

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
        <p className="text-gray-500 text-sm mt-1">Configure payment and shipping integrations</p>
      </div>

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
