const { MercadoPagoConfig, Preference } = require('mercadopago');

exports.handler = async (event) => {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const preference = new Preference(client);

    try {
        const body = JSON.parse(event.body);
        const result = await preference.create({
            body: {
                items: [{ title: body.title, quantity: 1, unit_price: Number(body.price), currency_id: 'ARS' }],
                back_urls: {
                    success: "https://tu-sitio.netlify.app/success.html",
                    failure: "https://tu-sitio.netlify.app/index.html"
                },
                auto_return: "approved",
                metadata: body.metadata 
            }
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ id: result.id }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.toString() }) };
    }
};