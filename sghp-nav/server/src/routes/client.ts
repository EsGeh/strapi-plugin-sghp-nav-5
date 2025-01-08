export default {
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/",
      handler: "clientController.index",
      config: {
        policies: [],
      },
    },
    // TODO:
    {
      method: "GET",
      path: "/navigation/render",
      handler: "clientController.renderAll",
      config: {
        policies: [],
      },
    }
  ],
};
