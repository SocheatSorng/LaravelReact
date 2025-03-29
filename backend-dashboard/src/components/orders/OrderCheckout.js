import React from 'react';

function OrderCheckout() {
  return (
    <div className="container-xxl">
      <h4 className="fw-bold py-3 mb-4">Order Checkout</h4>
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="card-title">Billing Information</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Shipping Address</label>
                  <textarea className="form-control" rows="3"></textarea>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-borderless mb-0">
                  <tbody>
                    <tr>
                      <td>Subtotal</td>
                      <td className="text-end">$240.00</td>
                    </tr>
                    <tr>
                      <td>Shipping</td>
                      <td className="text-end">$10.00</td>
                    </tr>
                    <tr className="border-top">
                      <th>Total</th>
                      <td className="text-end fw-bold">$250.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-3">
                <button className="btn btn-primary w-100">Place Order</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCheckout;