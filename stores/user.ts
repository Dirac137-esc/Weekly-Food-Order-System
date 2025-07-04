import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref<any | null>(null);

    function saveUser(userData : any)
    {
        localStorage.setItem("user", JSON.stringify(userData));
        user.value = userData;
    }

  function loadUser() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        user.value = JSON.parse(userData);
      } catch (e) {
        console.error("error during loading user data ", e);
        user.value = null;
      }
    }
  }

  function logOut()
  {
    localStorage.removeItem("user");
    user.value = null;
  }

  return { user, loadUser , logOut , saveUser};
});
