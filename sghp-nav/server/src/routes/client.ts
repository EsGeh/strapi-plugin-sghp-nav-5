export default {
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/",
      handler: "clientController.index",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/navigations/render",
      handler: "clientController.renderAll",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/navigations",
      handler: "clientController.find",
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
