export default {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/navigations",
      handler: "adminNavigation.renderAll",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/navigations",
      handler: "adminNavigation.create",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/navigations/:documentId",
      handler: "adminNavigation.del",
      config: {
        auth: false,
        policies: [],
      },
    },
    // update: navigation
    {
      method: "PUT",
      path: "/navigations/:documentId",
      handler: "adminNavigation.update",
      config: {
        auth: false,
        policies: [],
      },
    },
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
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/config",
      handler: "adminConfig.find",
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
