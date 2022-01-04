"use strict";

/**
 * wallet router.
 */

// const { createCoreRouter } = require('@strapi/strapi').factories;

// module.exports = createCoreRouter('api::wallet.wallet');
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/wallet/me",
      handler: "wallet.getMyWallet",
    },
    {
      method: "PUT",
      path: "/wallet/me",
      handler: "wallet.putMyWallet",
    },
  ],
};
