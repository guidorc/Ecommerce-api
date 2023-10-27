const { expect } = require("chai");
const sinon = require("sinon");
const orderController = require("../../api/controllers/orders");
const Order = require("../../api/models/order");

describe("Order Controller", () => {
  let res;
  let findStub;

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

  afterEach(() => {
    findStub.restore();
  });

  describe("Get all orders", () => {
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
});
