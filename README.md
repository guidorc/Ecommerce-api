# Ecommerce API

This API is written in Node.Js using the express framework and MongoDB's Atlas as its object database.

The available routes are as follows

## /Products

This route offers the possibility to create products, get all products, get a single product by it's id, as well as patch and delete a specific product.

- GET:

  - `/`: Returns information of all products registered on the db.
  - `/:productId` Returns information regarding the specified product.

- POST

  - `/`: Create a new product object on the database. The request body must include a product name and price, and it may include a reference image file.
    **Note:** User authentication is needed to access this endpoint.

- PATCH

  - `/:productId`: Updates specified product information.

- DELETE
  - `/:productId`: Deletes the specified product from the database

**Example use case:**

![list_products](https://github.com/guidorc/node-ecommerce/assets/50532651/16f4f71e-b664-45e8-84bd-bf7d5b75b0ff)

## /Orders

This route allows users to place orders, get all orders, get a single order by it's id, and delete a specific order.

- GET:

  - `/`: Returns information of all orders registered on the db.
  - `/:orderId` Returns information regarding the specified order.

- POST

  - `/`: Place a new order to the database. The request body must include a product id, it may include the desired quantity (deafult 1).

- DELETE
  - `/:orderId`: Deletes the specified order from the database

**Note:** User authentication is needed to access all endpoints.

**Example use case:**

![list_orders](https://github.com/guidorc/node-ecommerce/assets/50532651/38691bc4-3108-4553-8c6f-e2fd3163f82e)

## /User

This route allows users to sign-up, sign-in, as well as delete a specific user.

- POST

  - `/signup`: Creates a new user, the request body must include and available email address and a password.
  - `/signin`: Authenticates a user and returns a JWT, the request body must include the user email address and password.

- DELETE
  - `/:userId`: Deletes the specified user from the system. **Note:** User authentication is needed to access this endpoint.

**Example use case:**

![signin](https://github.com/guidorc/node-ecommerce/assets/50532651/5456dbf8-49b7-4efe-ae8e-3c833b1b33e5)

## Setup and execute

- To set up the project, execute npm install
- To start the server, execute `npm start`
- To run unit tests, execute `npm test`

  **Note:** All commands should be run on the root directory
