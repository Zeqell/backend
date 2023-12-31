const fs = require('fs')

class ProductManager {
    constructor() {
        this.path = './products.json'
        this.start()
    }

    start() {
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([]))
        }
    }

    async getProducts() {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(data)
    }

    async addProduct({ title, description, price, thumbnail, code, stock }) {
        const products = await this.getProducts()
        const id = products.length > 0 ? products[products.length - 1].id + 1 : 1

        //Comprobamos que ningún campo esté vacío.
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return console.error("Debe completar todos los campos.")
        }
        //Comprobamos que el código (code) no esté repetido.
        if (products.some(product => product.code === code)) {
            return console.error("El código ya existe.")
        }
        //Creamos el objeto incluyendo un id autoincrementable y lo "pusheamos" al array de productos.
        const newProduct = { id, title, description, price, thumbnail, code, stock }
        products.push(newProduct)
        console.log(`El Producto "${newProduct.title}" fue agregado exitosamente.`)
        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }

    async getProductById(id) {
        const products = await this.getProducts()
        const product = products.find(product => product.id === id)
        if (!product) return console.log("Producto no encontrado.")
        return product
    }
    async updateProduct(id, productUpdate) {
        const products = await this.getProducts()
        const productFind = products.findIndex(product => product.id === id)
        if (productFind === -1) return console.log('No se encuentra el producto.')
        products[productFind] = { ...products[productFind], ...productUpdate, id }
        await fs.promises.writeFile(this.path, JSON.stringify(products))
        console.log('Producto actualizado correctamente.')
    }

    async deleteProduct(id) {
        const products = await this.getProducts()
        if (!products.some(product => product.id === id)) return console.log('El producto que quiere borrar no existe.')
        const productsDelete = products.splice(products, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(productsDelete))
        console.log('Producto eliminado.')
    }

}
exports.productsManager = ProductManager;