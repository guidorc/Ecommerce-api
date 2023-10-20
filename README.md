# Ecommerce API
This API is written in Node.Js using the express framework and MongoDB's Atlas as its object database.

The available routes are as follows

## Products

This route offers the possibility to create products, get all products, get a single product by it's id, as well as patch and delete a specific product.

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
 
## Orders

This route allows users to place orders, get all orders, get a single order by it's id, and delete a specific order.

- GET:
  - ``/``: Returns information of all orders registered on the db.
  - ``/:orderId`` Returns information regarding the specified order.

- POST
  - ``/``: Place a new order to the database. The request body must include a product id, it may include the desired quantity (deafult 1).
 
- DELETE
  - ``/:orderId``: Deletes the specified order from the database
 
**Note:** User authentication is needed to access all endpoints.

## User

This route allows users to sign-up, sign-in, as well as delete a specific user.

- POST
  - ``/signup``: Creates a new user, the request body must include and available email address and a password.
  - ``/signin``: Authenticates a user and returns a JWT, the request body must include the user email address and password.
 
- DELETE
  - ``/:userId``: Deletes the specified user from the system. **Note:** User authentication is needed to access this endpoint.

### Setup and execute
- To set up the project, run npm install
- to start the server, execute the command ``npm start`` in the project directory.
