import http, { Server, IncomingMessage, ServerResponse } from "http";
import url from "url";

type Product = {
  id: string;
  name: string;
  price: number;
};

let products: Product[] = [
  { id: "1", name: "product1", price: 1 },
  { id: "2", name: "product2", price: 2 },
  { id: "3", name: "product3", price: 3 },
];

const PORT = 8080;

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {


    if (req.method === "GET" && req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/plain" });

      res.end("Hello, World!\n");
    }

    if (req.method === "GET" && req.url === "/api/v1/products") {
      console.log(req.url, "url");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(products));
    }

    if (req.method === "POST" && req.url === "/api/v1/products") {

      let body = "";
      req.on("data", (chunk) => {
        console.log(chunk, "ch");
        body += chunk;
      });

      req.on("end", () => {
        const newProduct = JSON.parse(body);
        products.push(newProduct);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(products));
      });
    }

    if (
      req.method === "DELETE" &&
      req.url &&
      req.url.startsWith("/api/v1/products/")
    ) {
      const productId = req.url.split("/")[2];
      products = products.filter((item) => item.id !== productId);
      console.log(products, "after delete");
      res.writeHead(204, { "Content-Type": "application/json" });
      res.end();
    }

    if (
      req.method === "PUT" &&
      req.url &&
      req.url.startsWith("/api/v1/products/")
    ) {
      const productId = req.url.split("/")[2];
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        const updatedProduct = JSON.parse(body);
        const index = products.findIndex((item) => item.id === productId);
        if (index !== -1) {
          products[index] = { ...products[index], ...updatedProduct };
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(products[index]));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Product not found" }));
        }
      });
    }
  }
);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
