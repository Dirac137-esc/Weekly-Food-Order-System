import { defineStore } from "pinia";
export const useCartStore = defineStore("cart", () => {
  const cart = ref(new Map());

  function removeItem(item: any) {
    cart.value.delete(item);
  }
  function plus(item: any) {
    if (!cart.value.has(item)) {
      cart.value.set(item, 0);
    }
    cart.value.set(item, cart.value.get(item) + 1);
  }
  function minus(item: any) {
    if (cart.value.get(item)) {
      cart.value.set(item, cart.value.get(item) - 1);
    }
    if (cart.value.get(item) === 0) {
      cart.value.delete(item);
    }
  }
  const total = computed(() =>
    Array.from(cart.value).reduce(
      (sum, [item, qty]) => sum + item.price * qty,
      0
    )
  );

  return { cart , plus, minus,removeItem,  total };
});
