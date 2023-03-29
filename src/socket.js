import { Server } from "socket.io";
import productManager from "./productManager.js";

const socket = {};
socket.connect = (server) => {
    const ProductManager = new productManager();
    socket.io = new Server (server);

    socket.io.on("connection", async (socket)=>{
        console.log("conectado");
        const products = await ProductManager.getProducts()

        socket.emit("products",products)
    })
}
export default socket;
