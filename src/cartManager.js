import fs from "fs";


export default class cartManager {
    constructor(){
        this.cart = [];
        this.path = "./files/cart.json"
    }

    getCart = async () => {
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const result= JSON.parse(data)
            console.log(result)
            return result;
        }else{
            return [];
        }
    }

    addCart = async (cart) =>{
        const carts = await this.getCart();
        if(carts.length === 0){
            cart.id = 1;
        }else{
            cart.id = carts[carts.length - 1].id + 1;
        }
        carts.push(cart)
        await fs.promises.writeFile(
            this.path,
            JSON.stringify(carts,null,"\t")
        );
        return cart;
    }

    addCartProduct =async (product, id) => {
        try {
          const carts = await this.getCart();
          const cartIndex = carts.findIndex((c) => c.id === id);
          const cart = carts[cartIndex];
          const productIndex = cart.products.findIndex((p) => p.id === product.id);
      
          if (productIndex !== -1) {
            cart.products[productIndex].quantity += product.quantity;
          } else {
            cart.products.push({
              id: product.id,
              quantity: product.quantity
            });
          }
          carts[cartIndex] = cart;
        } catch (error) {
          return "Hubo un error al añadir un producto al carrito";
        }
      }
    

    getCartById = async (id) => {
        try {
            if (fs.existsSync(this.path)) {
                const result = await this.getCart();
                let indexValue = result.find((event) => event.id === id);
                console.log(indexValue)
                return indexValue;
            }
        } catch (error) {
            console.log(error);
        }

    }

}