"use strict";

/**
 *  wallet controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const {
  parseBody,
} = require("@strapi/strapi/lib/core-api/controller/transform");

module.exports = createCoreController("api::wallet.wallet", ({ strapi }) => ({
  async getMyWallet(ctx) {
    const user = ctx.state.user;
    if (!user) {
      ctx.badRequest(null, { message: "No Authorized" });
    }

    const entity = await strapi.db.query("api::wallet.wallet").findOne({
      where: {
        user: user.id,
      },
      populate: {
        portfolio: {
          populate: {
            coin: true,
          },
        },
      },
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },
  async putMyWallet(ctx) {
    const user = ctx.state.user;
    if (!user) {
      ctx.badRequest(null, { message: "No Authorized" });
    }

    const wallet = await strapi.db.query("api::wallet.wallet").findOne({
      where: {
        user: user.id,
      },
    });

    if (!wallet) {
      ctx.badRequest(null, { message: "No Authorized" });
    }

    const { data } = parseBody(ctx);

    console.log("data", data);
    console.log("wallet", wallet);

    let entity = await strapi.entityService.update(
      "api::wallet.wallet",
      wallet.id,
      { data }
    );

    entity = await strapi.db.query("api::wallet.wallet").findOne({
      where: {
        user: user.id,
      },
      populate: {
        portfolio: {
          populate: {
            coin: true,
          },
        },
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },
}));
