const { expect } = require("chai");
const sinon = require("sinon");
const orderController = require("../../api/controllers/orders");
const Order = require("../../api/models/order");

describe("Order Controller", () => {
  let mockOrders;
  let findStub = sinon.stub(Order, "find");

  describe.only("Get all orders", () => {
    describe("When orders are found successfully", () => {
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      beforeEach(async () => {
        mockOrders = [{ _id: "orderId", product: "productId", quantity: 2 }];
        findStub.returns({
          select: sinon.stub().returns({
            populate: sinon
              .stub()
              .returns({ exec: sinon.stub().resolves(mockOrders) }),
          }),
        });

        return orderController.get_all(req, res);
      });

      it("should return a 200 response with all orders", function () {
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0].orders.length).to.equal(
          mockOrders.length
        );
      });
    });
  });

  it("should send a 500 error response on failure", (done) => {
    const findStub = sinon.stub(Order, "find");
    findStub.returns({
      select: sinon.stub().returns({
        populate: sinon
          .stub()
          .returns({ exec: sinon.stub().rejects("Error message") }),
      }),
    });

    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    orderController.get_all(req, res);

    findStub.restore();
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0].message).to.equal(
      "Failed to find orders"
    );

    done();
  });
});
