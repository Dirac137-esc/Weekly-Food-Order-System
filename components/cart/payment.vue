<template>
  <!-- Нэмэлт тэмдэглэл -->
  <v-col cols="12" class="sticky-payment">
    <v-card class="elevation-8 pa-6" outlined>
      <div class="font-weight-bold mb-4">Төлбөр төлөх</div>
      <div class="d-flex align-center mb-4">
        <v-img
          src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg"
          height="28"
          width="45"
          class="mr-2"
        />
        <v-img
          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
          height="28"
          width="45"
          class="mr-2"
        />
        <v-img
          src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
          height="28"
          width="45"
        />
      </div>
      <v-text-field label="Карт эзэмшигчийн нэр" outlined class="mb-3" />
      <v-text-field label="Картын дугаар" outlined class="mb-3" />
      <v-row>
        <v-col cols="6"><v-text-field label="Дуусах огноо" outlined /></v-col>
        <v-col cols="6"><v-text-field label="CVC" outlined /></v-col>
      </v-row>
      <v-btn
        block
        color="primary"
        class="mt-4"
        :disabled="cartStore.cart.size === 0"
        @click="order"
      >
        Төлбөр төлөх
      </v-btn>
    </v-card>
  </v-col>
</template>

<script setup>

import { useCartStore } from "../../stores/cart";
import { useLocationStore } from "../../stores/location";
let cartStore = useCartStore();
let locationStore = useLocationStore();
const orderNotes = ref("");
async function order() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No authentication token found");
    return;
  }

  try {
    const thisWeek = await useApi("/menus/this-week", "GET", "");

    if (!thisWeek?.weekDates) {
      throw new Error("Invalid week dates data from API");
    }

    const orderPromises = [];
    const weekdays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    for (const [weekday, cartItems] of cartStore.cart.entries()) {
      // Validate weekday
      console.log("weekday : " + weekday);
      const dateStr = thisWeek.weekDates[weekdays[+weekday]];
      console.log(dateStr);
      // Parse and validate date
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) {
        console.error(`Invalid date for ${weekday}: ${dateStr}`);
        continue;
      }

      // Format date to YYYY-MM-DD (backend might expect this format)
      const formattedDate = dateObj.toISOString();

      const dayTotal = cartItems.reduce(
        (sum, { item, quantity }) => sum + item.price * quantity,
        0
      );

      const itemsPayload = cartItems.map(({ item, quantity }) => ({
        food: item.id,
        qty: quantity,
      }));
            console.log("Sending address:", locationStore.details.address);

      const orderPromise = fetch(
        `https://backend-production-25f11.up.railway.app/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: formattedDate,
            items: itemsPayload,
            totalCost: dayTotal,
            location: {
                address : locationStore.details.address}
          }),
        }
      )
        .then(async (res) => {
          if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || "Failed to create order");
          }
          return res.json();
        })
        .then((data) => ({
          weekday,
          success: true,
          data,
        }))
        .catch((error) => {
          console.error(`Order failed for ${weekday}:`, error);
          return {
            weekday,
            success: false,
            error: error.message,
          };
        });

      orderPromises.push(orderPromise);
      cartStore.cart.clear();
    }

    const results = await Promise.all(orderPromises);
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    if (successful.length > 0) {
      cartStore.clearCart();
      console.log("Bolson shv bro");
    }

    if (failed.length > 0) {
      console.error("Some orders failed:", failed);
    }

    return results;
  } catch (error) {
    console.error("Order processing error:", error);
    throw error;
  }
}
</script>
    