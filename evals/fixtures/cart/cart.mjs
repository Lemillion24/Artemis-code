export function subtotal(items) {
  return items.map((item) => item.price * item.quantity).reduce((sum, amount) => sum + amount)
}
