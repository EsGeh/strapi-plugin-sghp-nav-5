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
