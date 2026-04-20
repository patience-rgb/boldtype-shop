import { prisma } from '@/lib/prisma'
import { SettingsForm } from '@/components/admin/SettingsForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Settings' }

async function getSettings() {
  const rows = await prisma.storeSetting.findMany()
  const map: Record<string, string> = {}
  for (const r of rows) map[r.key] = r.value
  return map
}

export default async function SettingsPage() {
  const settings = await getSettings()
  return <SettingsForm initialSettings={settings} />
}
