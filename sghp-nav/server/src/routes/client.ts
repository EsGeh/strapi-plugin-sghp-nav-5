export default {
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/",
      handler: "clientNavigation.index",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/navigations/render",
      handler: "clientNavigation.renderAll",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/navigations",
      handler: "clientNavigation.find",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/navigations/items",
      handler: "clientItem.find",
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
