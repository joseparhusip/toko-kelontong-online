const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export const formatRupiah = (n) => rupiah.format(n || 0)

export const originalPrice = (price, discount) =>
  discount ? Math.round(price / (1 - discount / 100) / 100) * 100 : price

export const formatSold = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace('.', ',')} rb` : String(n))

export const formatDate = (iso, withWeekday = false) =>
  new Intl.DateTimeFormat('id-ID', {
    ...(withWeekday ? { weekday: 'long' } : {}),
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))

export const ORDER_STATUS = {
  pending: { label: 'Menunggu pembayaran', badge: 'badge-warn' },
  success: { label: 'Lunas', badge: 'badge-ok' },
  failed: { label: 'Gagal', badge: 'badge-danger' },
}
