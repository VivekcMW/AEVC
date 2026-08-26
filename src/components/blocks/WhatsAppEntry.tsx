import { getTranslations } from 'next-intl/server'

// PLACEHOLDER — replace once a real support WhatsApp line is confirmed (Section 6).
const SUPPORT_WHATSAPP_NUMBER = '910000000000'

/**
 * A wa.me deep link, not the WhatsApp Business API — Section 6 lists the Business API
 * as a later integration; this needs no API and no backend. WhatsApp is the dominant
 * support channel in India, ahead of email or a chat widget.
 */
export async function WhatsAppEntry({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'common' })
  const href = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whatsappPrefill'))}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp')}
      title={t('whatsapp')}
      className="whatsapp-entry fixed right-5 bottom-20 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-10px_rgb(0_0_0_/_0.5)] transition-transform hover:scale-105 md:right-6 md:bottom-6"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-7" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.9 4.43-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.9-4.43 9.9-9.9 0-2.64-1.03-5.12-2.9-6.99A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.19 0 4.25.85 5.8 2.4a8.2 8.2 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.14.82.84-3.06-.2-.32a8.18 8.18 0 0 1-1.26-4.35c0-4.54 3.7-8.23 8.28-8.23Zm-4.5 4.6c-.16 0-.42.06-.64.31-.22.25-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.6 4.14 3.63.58.25 1.03.4 1.38.5.58.19 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.47-.28-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.1.24-.27.36-.4.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.4h-.4Z" />
      </svg>
    </a>
  )
}
