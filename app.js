const express = require('express');
const { productsManager } = require('./productsManager');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const products = new productsManager('./products.json');

app.get('/products', async (req, res) => {
    let { limit } = req.query;
    const devolverProducts = await products.getProducts();

    if (!limit || limit > devolverProducts.length) {
        res.status(200).json({
            status: 'ok',
            data: devolverProducts,
        });
    } else {
        res.status(200).json({
            status: 'ok',
            data: devolverProducts.slice(0, limit),
        });
    }
});

app.get('/products/:id', async (req, res) => {
    const id = req.params.id * 1;
    const devolverProductsId = await products.getProductById(id);

    if (typeof devolverProductsId === 'string') {
        res.status(404).json({
            status: 'fail',
            data: devolverProductsId,
        });
    } else {
        res.status(200).json({
            status: 'ok',
            data: devolverProductsId,
        });
    }
});

app.listen(8080, () => {
    console.log(`Example app listening on port http://localhost:8080`);
});