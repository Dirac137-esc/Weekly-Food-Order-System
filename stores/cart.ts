import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface CartItem {
  item: {
    id: string | number;
    name: string;
    price: number;
    imageUrl?: string;
    ingredients?: string[];
  };
  quantity: number;
  sliderDay: number;
}

export const useCartStore = defineStore("cart", () => {
  const cart = ref(new Map<string, CartItem[]>());

  // Load from localStorage
  if (import.meta.client) {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validated = parsed.filter(
            ([key, value]: [string, any]) =>
              typeof key === "string" &&
              Array.isArray(value) &&
              value.every(
                (item: any) =>
                  item &&
                  typeof item === "object" &&
                  "item" in item &&
                  "quantity" in item &&
                  "sliderDay" in item
              )
          );
          cart.value = new Map(validated);
        }
      } catch (e) {
        console.error("Failed to parse cart", e);
        localStorage.removeItem("cart");
      }
    }
  }

  function syncToStorage() {
    if (import.meta.client) {
      localStorage.setItem(
        "cart",
        JSON.stringify(Array.from(cart.value.entries()))
      );
    }
  }
  function addItem(day: string, item: CartItem["item"], sliderDay: number) {
    const key = sliderDay.toString();
    const dayItems = cart.value.get(key) ?? [];
    const existingIndex = dayItems.findIndex(
      (entry) => entry.item.id === item.id
    );

    if (existingIndex !== -1) {
      dayItems[existingIndex].quantity++;
    } else {
      dayItems.push({ item, quantity: 1, sliderDay });
    }

    cart.value.set(key, dayItems);
    syncToStorage();
  }
  function removeItem(dayKey: string, itemId: string | number) {
    const dayItems = cart.value.get(dayKey);
    if (!dayItems) return;

    cart.value.set(
      dayKey,
      dayItems.filter((entry) => entry.item.id !== itemId)
    );
    syncToStorage();
  }

  function decreaseItem(dayKey: string, itemId: string | number) {
    const dayItems = cart.value.get(dayKey);
    if (!dayItems) return;

    const index = dayItems.findIndex((entry) => entry.item.id === itemId);
    if (index === -1) return;

    if (dayItems[index].quantity > 1) {
      dayItems[index].quantity--;
      cart.value.set(dayKey, dayItems);
    } else {
      removeItem(dayKey, itemId);
    }
    if (cart.value.size === 0) {
      cart.value.clear();
    }
    syncToStorage();
  }

  function clearCart() {
    cart.value.clear();
    syncToStorage();
  }

  const total = computed(() => {
    let sum = 0;
    for (const dayItems of cart.value.values()) {
      sum += dayItems.reduce(
        (daySum, { item, quantity }) => daySum + item.price * quantity,
        0
      );
    }
    return sum;
  });

  const itemCount = computed(() => {
    let count = 0;
    for (const dayItems of cart.value.values()) {
      count += dayItems.reduce(
        (dayCount, { quantity }) => dayCount + quantity,
        0
      );
    }
    return count;
  });

  const cartItems = computed(() => {
    const result: {
      day: string;
      item: CartItem["item"];
      quantity: number;
      sliderDay: number;
    }[] = [];

    for (const [day, dayItems] of cart.value.entries()) {
      if (Array.isArray(dayItems)) {
        for (const entry of dayItems) {
          if (
            entry &&
            typeof entry === "object" &&
            "item" in entry &&
            "quantity" in entry &&
            "sliderDay" in entry
          ) {
            result.push({ day, ...entry });
          }
        }
      }
    }

    return result;
  });

  return {
    cart: computed(() => cart.value),
    cartItems,
    addItem,
    removeItem,
    decreaseItem,
    clearCart,
    total,
    itemCount,
  };
});
