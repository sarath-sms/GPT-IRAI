export const OrderService = {
  getOrders: () => JSON.parse(localStorage.getItem("iraitchi_orders") || "[]"),

  addOrder: (order: any) => {
    const existing = OrderService.getOrders();
    existing.push(order);
    localStorage.setItem("iraitchi_orders", JSON.stringify(existing));
  },

  clearCart: () => {
    sessionStorage.setItem("iraitchi_cart", "[]");
  },

  getCart: () => JSON.parse(sessionStorage.getItem("iraitchi_cart") || "[]"),

  getUser: () => JSON.parse(localStorage.getItem("iraitchi_user") || "{}"),

  setUser: (user: any) => {
    localStorage.setItem("iraitchi_user", JSON.stringify(user));
  }
};