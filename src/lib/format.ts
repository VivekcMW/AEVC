const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** Indian digit grouping. Pair with the .tnum class so columns of these align. */
export function formatRupees(amount: number): string {
  return rupees.format(Math.trunc(amount))
}
