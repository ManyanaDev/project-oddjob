import Link from 'next/link'

export function CalendarNavLink({ label, href }: { label: string; href: string }) {
  return <Link href={href}>{label}</Link>
}
