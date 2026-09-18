import assert from "node:assert/strict"
import { test } from "node:test"
import { subtotal } from "./cart.mjs"

test("empty cart has a zero subtotal", () => {
  assert.equal(subtotal([]), 0)
})

test("subtotal includes all quantities", () => {
  assert.equal(subtotal([{ price: 12, quantity: 2 }, { price: 3, quantity: 4 }]), 36)
})

test("zero quantities and prices are supported", () => {
  assert.equal(subtotal([{ price: 0, quantity: 5 }, { price: 8, quantity: 0 }]), 0)
})
