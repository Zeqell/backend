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
        const productsFiltered = products.filter(product => product.id !== id) 
        await fs.promises.writeFile(this.path, JSON.stringify(productsFiltered))
        console.log('Producto eliminado.')
    }

}

async function test() {

    const instance = new ProductManager('./products.json')

    console.log(await instance.getProducts()) // []

    await instance.addProduct({
        title: "producto prueba",
        description: "Este es un producto prueba",
        price: 200,
        thumbnail: "Sin img",
        code: "abc123",
        stock: 25
    }) // El Producto "producto prueba" fue agregado exitosamente.

    console.log('Producto recién agregado:', await instance.getProducts()) // Muestra el producto recién agregado.

    console.log('El producto con id 1 es:', await instance.getProductById(1)) // Muestra el producto con id = 1.

    console.log(await instance.getProductById(1)) // Producto no encontrado.

    await instance.updateProduct(
        1,
        {
            stock: 200
        }
    ) // Producto actualizado correctamente.

    await instance.deleteProduct(1) // Producto eliminado.

    await instance.deleteProduct(150) // El producto a eliminar no existe.
}

test();