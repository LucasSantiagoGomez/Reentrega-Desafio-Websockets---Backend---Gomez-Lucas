import fs from "fs";
import socket from "./socket.js";
import express from "express";
export default class productManager {
    constructor(){
        this.products = [];
        this.path = "./files/productos.json"
    }
    productServer = express()
    returnObject = async()=>{
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const result = JSON.parse(data)
        return result;
    }

    getProducts = async () => {
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const result= JSON.parse(data)
            console.log(result)
            return result;
        }else{
            return [];
        }
    }

    addProduct = async (product) =>{
        const products = await this.getProducts();
        if(products.length === 0){
            product.id = 1;
        }else{
            product.id = products[products.length - 1].id + 1;
        }
        products.push(product)
        await fs.promises.writeFile(
            this.path,
            JSON.stringify(products,null,"\t")  
        );
        socket.io.emit("products",products)
        return products;
    }

    updateProduct = async (id, changes)=>{
        try{
            const data = await fs.promises.readFile(this.path, "utf-8");
            const result = JSON.parse(data)
            this.products = result

            const indexProduct = this.products.findIndex((product) => product.id === id);
            if(indexProduct === -1){
                console.error("El producto no ha sido encontrado")
                return;
            }
            const productupdated = {...this.products[indexProduct],...changes}
            this.products[indexProduct] = productupdated
            this.products.push(productupdated)
            await fs.promises.writeFile(this.path, JSON.stringify(this.products,null,"\t"))
            console.log("Producto actualizado")
        }catch(error) {
            console.log("error")
        }
    }
    getProductById = async (id) => {
        try {
            if (fs.existsSync(this.path)) {
                const result = await this.getProducts();
                let indexValue = result.find((event) => event.id === id);
                console.log(indexValue)
                return indexValue;
            }
        } catch (error) {
            console.log(error);
        }

    }

   deleteProduct = async(id) =>{
    if(fs.existsSync(this.path)){
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id === id);

        if(productIndex === -1){
            console.log("El producto no existe")
            return [];
        }else{
            for( var i = 0; i < products.length; i++){
                if (products[i].id === id ){
                    products.splice(i,1);
                }
            }
            await fs.promises.writeFile(this.path, JSON.stringify(products,null,"\t"))
            socket.io.emit("products",products)
            return products;
        }
    }
   }

}  