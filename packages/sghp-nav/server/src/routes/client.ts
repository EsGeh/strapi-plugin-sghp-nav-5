export default {
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/navigations/render",
      handler: "navigation.renderAll",
      // config: {
      //   auth: false,
      // },
    },
    /**************************
     * For Debugging/Testing only:
     * (undocumented)
     ******************************/
    {
      method: "GET",
      path: "/",
      handler: "navigation.index",
      //config: {
      //  auth: false,
      //},
    },
    {
      method: "GET",
      path: "/navigations",
      handler: "navigation.find",
      // config: {
      //   auth: false,
      // },
    },
    {
      method: "GET",
      path: "/navigations/items",
      handler: "item.find",
      // config: {
      //   auth: false,
      // },
    },
  ],
};
