'use strict';

/**
 *  order controller
 */
 const stripe = require('stripe')(process.env.STRIPE_SECRET);


const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order',({strapi})=>({

    async create(ctx){
        
        const {amount,shippingAddress,city,state,pin,token,items} = ctx.request.body
  
        await stripe.paymentIntents.create({
            amount: amount * 100,
            currency:"INR",
            automatic_payment_methods: {enabled: true},
            description:`order by user ${ctx.state.user.email}`
        })

        const order = await strapi.db.query('api::order.order').create({
            data:{
                shippingAddress,
                city,
                state,
                pin,
                amount,
                items,
                user:ctx.state.user.email
            }
        })
        return order

    }


}));