import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";

export const useCartStore = defineStore("cart", () => {
  const cart = ref(new Map<string, { item: any; quantity: number }>());

  function removeItem(id: string) {
    cart.value.delete(id);
  }

  function addItem(id: string, item: any) {
    console.log(id);
    const entry = cart.value.get(id);
    if (entry) {
      entry.quantity += 1;
    } else {
      cart.value.set(id, { item, quantity: 1 });
    }
  }

  function decreaseItem(id: string) {
    const entry = cart.value.get(id);
    if (!entry) return;

    if (entry.quantity > 1) {
      entry.quantity--;
    } else {
      cart.value.delete(id);
    }
  }

  const total = computed(() => {
    return Array.from(cart.value.values()).reduce(
      (sum, { item, quantity }) => sum + item.price * quantity,
      0
    );
  });

  const itemCount = computed(() => {
    return Array.from(cart.value.values()).reduce(
      (total, { quantity }) => total + quantity,
      0
    );
  });

  function clearCart() {
    cart.value.clear();
  }

  return {
    cart: computed(() => cart.value),
    addItem,
    decreaseItem,
    removeItem,
    total,
    itemCount,
    clearCart,
  };
});
