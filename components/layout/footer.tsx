import Image from "next/image"

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] px-4 py-8 text-sm text-[var(--muted-ink)] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="棲地無界" width={28} height={28} className="opacity-60" />
          <p>棲地無界 Borderless Habitat 以台灣視角整理打工度假資訊，讓經驗被保存、被接住，也被傳下去。</p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/workdayholiday.ntu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted-ink)] transition hover:text-[var(--ink)]"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <p className="text-xs text-[var(--muted-ink)]/70">© 棲地無界 Borderless Habitat</p>
        </div>
      </div>
    </footer>
  )
}
