import { defineStore } from "pinia";
import { ref } from "vue";

export const useLocationStore = defineStore("location", () => {
  let lat = ref(47.9185);
  let lng = ref(106.917);
  let name = ref("");
  let details = ref({address : ""});
  let loading = ref(false);

  return { lat, lng, name, details, loading };
});
