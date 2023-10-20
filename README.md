# Ecommerce API
This API is written in Node.Js using the express framework and MongoDB's Atlas as its object database.

The available routes are as follows

## Products

This route offers the possibility to create products, get all prodcuts, get a single product by it's id, as well as patch and delete a specific product.

- GET:
  - ``/``: Returns information of all products registered on the db.
  - ``/:productId`` Returns information regarding the specified product.

- POST
  - ``/``: Create a new product object on the database. The request body must include a product name and price, and it may include a reference image file.
    **Note:** User authentication is needed to access this endpoint.

- PATCH
  - ``/:productId``: Updates specified product information.
 
- DELETE
  - ``/:productId``: Deletes the specified product from the database

### Setup and execute
- To set up the project, run npm install
- to start the server, execute the command ``npm start`` in the project directory.
