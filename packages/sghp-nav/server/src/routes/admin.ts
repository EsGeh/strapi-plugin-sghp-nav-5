export default {
  type: "admin",
  routes: [
    // navigation api:
    {
      method: "GET",
      path: "/navigations",
      handler: "adminNavigation.renderAll",
    },
    {
      method: "POST",
      path: "/navigations",
      handler: "adminNavigation.create",
    },
    {
      method: "DELETE",
      path: "/navigations/:documentId",
      handler: "adminNavigation.del",
    },
    {
      method: "PUT",
      path: "/navigations/:documentId",
      handler: "adminNavigation.update",
    },
    // item api:
    {
      method: "PUT",
      path: "/navigations/items/:documentId",
      handler: "adminItem.update",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/navigations/items",
      handler: "adminItem.create",
    },
    // config api:
    {
      method: "GET",
      path: "/config",
      handler: "adminConfig.find",
    },
  ],
};
