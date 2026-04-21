import Link from 'next/link'
import { Flame } from 'lucide-react'

type Props = {
  visible: boolean
  text: string
  bg: string
}

const DEFAULT_TEXT = 'Free shipping on orders over $75 CAD | Find your power color →'

export function AnnouncementBar({ visible, text, bg }: Props) {
  if (!visible) return null

  const displayText = text || DEFAULT_TEXT
  const bgColor = bg || '#FF3E8E'

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 text-white text-center text-xs font-semibold py-2 px-4"
      style={{ backgroundColor: bgColor }}
    >
      <Flame size={13} className="inline mr-1.5 -mt-0.5" />
      {displayText.includes('→') ? (
        <>
          {displayText.split('→')[0]}→{' '}
          <Link href="/color-finder" className="underline hover:no-underline">
            Take the quiz
          </Link>
        </>
      ) : (
        displayText
      )}
    </div>
  )
}
