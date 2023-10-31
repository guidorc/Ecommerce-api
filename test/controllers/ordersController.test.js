const { expect, assert } = require("chai");
const sinon = require("sinon");
const orderController = require("../../api/controllers/orders");
const Order = require("../../api/models/order");
const Product = require("../../api/models/product");

describe("Order Controller", () => {
  let res;
  let findStub;
  let findByIdStub;
  let deleteStub;
  let createStub;
  let orderSaveStub;

  const mockOrders = [
    {
      toObject: () => ({
        _id: "orderId",
        product: "productId",
        quantity: 2,
      }),
    },
  ];

  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  });

  describe("Get all orders", () => {
    afterEach(() => {
      findStub.restore();
    });

    it("should send a 200 response with all orders on success", async () => {
      const execStub = sinon.stub();
      const populateStub = sinon.stub().returns({ exec: execStub });
      const selectStub = sinon.stub().returns({ populate: populateStub });

      execStub.resolves(mockOrders);

      findStub = sinon.stub(Order, "find").returns({ select: selectStub });

      await orderController.get_all({}, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].orders.length).to.equal(
        mockOrders.length
      );
    });

    it("should send a 500 error response on failure", async () => {
      const execStub = sinon.stub();
      const populateStub = sinon.stub().returns({ exec: execStub });
      const selectStub = sinon.stub().returns({ populate: populateStub });

      execStub.rejects("Error message");

      findStub = sinon.stub(Order, "find").returns({ select: selectStub });

      await orderController.get_all({}, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].message).to.equal(
        "Failed to find orders"
      );
    });
  });

  describe("Get by order id", () => {
    afterEach(() => {
      findByIdStub.restore();
    });

    it("should send a 200 response with the requested order on success", async () => {
      const execStub = sinon.stub();
      const populateStub = sinon.stub().returns({ exec: execStub });
      const selectStub = sinon.stub().returns({ populate: populateStub });

      execStub.resolves(mockOrders[0]);

      findByIdStub = sinon
        .stub(Order, "findById")
        .returns({ select: selectStub });

      await orderController.get_by_id({ params: { orderId: "orderId" } }, res);

      const expected = {
        ...mockOrders[0].toObject(),
        info: {
          type: "GET",
          description: "Get all orders",
          url: "http://localhost:3000/orders",
        },
      };

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      assert.deepEqual(res.json.firstCall.args[0], expected);
    });

    it("should send a 404 response when order is not found", async () => {
      const execStub = sinon.stub();
      const populateStub = sinon.stub().returns({ exec: execStub });
      const selectStub = sinon.stub().returns({ populate: populateStub });

      execStub.resolves(null);

      findByIdStub = sinon
        .stub(Order, "findById")
        .returns({ select: selectStub });

      await orderController.get_by_id({ params: { orderId: "orderId" } }, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].message).to.equal(
        "Unable to find requested order"
      );
    });

    it("should send a 500 error response on failure", async () => {
      const execStub = sinon.stub();
      const populateStub = sinon.stub().returns({ exec: execStub });
      const selectStub = sinon.stub().returns({ populate: populateStub });

      execStub.rejects("Error message");

      findByIdStub = sinon
        .stub(Order, "findById")
        .returns({ select: selectStub });

      await orderController.get_by_id({ params: { orderId: "orderId" } }, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].message).to.equal(
        "Failed to find order"
      );
    });
  });

  describe("create order", () => {
    afterEach(() => {
      findByIdStub.restore();
      orderSaveStub.restore();
    });

    it("should send 201 response on success", async () => {
      findByIdStub = sinon
        .stub(Product, "findById")
        .resolves({ productId: "product_id" });

      orderSaveStub = sinon.stub(Order.prototype, "save").resolves({
        id: "order_id",
        product: "product_id",
        quantity: 2,
      });

      await orderController.create(
        { body: { productId: "productId", quantity: 1 } },
        res
      );

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      const response = res.json.firstCall.args[0];
      expect(response.message).to.equal("Order created successfully");
      expect(response.createdOrder._id).to.equal("order_id");
      expect(response.createdOrder.productId).to.equal("product_id");
      expect(response.createdOrder.quantity).to.equal(2);
    });

    it("should return a 404 response when product is not found", async () => {
      findByIdStub = sinon.stub(Product, "findById").resolves(null);

      await orderController.create(
        {
          body: {
            productId: "non_existent_product",
            quantity: 2,
          },
        },
        res
      );

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      const response = res.json.firstCall.args[0];
      expect(response.message).to.equal("Product not found");
    });

    it("should send a 500 error response on failure", async () => {
      findByIdStub = sinon
        .stub(Product, "findById")
        .resolves({ productId: "product_id" });

      orderSaveStub = sinon.stub(Order.prototype, "save").rejects();

      await orderController.create(
        { body: { productId: "productId", quantity: 1 } },
        res
      );

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].message).to.equal(
        "Failed to create order"
      );
    });
  });

  describe("delete order", () => {
    afterEach(() => {
      deleteStub.restore();
    });

    it("should send a 200 response on success", async () => {
      const execStub = sinon.stub();

      execStub.resolves();

      deleteStub = sinon.stub(Order, "deleteOne").returns({ exec: execStub });

      await orderController.delete({ params: { orderId: "orderId" } }, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].message).to.equal(
        "Order deleted successfully"
      );
    });

    it("should send a 500 error response on failure", async () => {
      const execStub = sinon.stub();

      execStub.rejects("Error message");

      deleteStub = sinon.stub(Order, "deleteOne").returns({ exec: execStub });

      await orderController.get_by_id({ params: { orderId: "orderId" } }, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });
});
