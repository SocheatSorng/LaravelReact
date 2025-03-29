import React from 'react';
import ProductActions from './ProductActions';

function ProductTableBody() {
  const products = [
    {
      id: 1,
      name: "Black T-shirt",
      image: "/assets/images/product/p-1.png",
      sizes: ["S", "M", "L", "XL"],
      price: "$80.00",
      stock: {
        available: 486,
        sold: 155
      },
      category: "Fashion",
      rating: {
        score: 4.5,
        count: 55
      }
    },
    // Add more products as needed
  ];

  return (
    <tbody>
      {products.map(product => (
        <tr key={product.id}>
          <td>
            <div className="form-check ms-1">
              <input type="checkbox" className="form-check-input" id={`product${product.id}`} />
              <label className="form-check-label" htmlFor={`product${product.id}`}></label>
            </div>
          </td>
          <td>
            <div className="d-flex align-items-center gap-2">
              <div className="rounded bg-light avatar-md d-flex align-items-center justify-content-center">
                <img src={product.image} alt="" className="avatar-md" />
              </div>
              <div>
                <a href="#!" className="text-dark fw-medium fs-15">{product.name}</a>
                <p className="text-muted mb-0 mt-1 fs-13">
                  <span>Size: </span>{product.sizes.join(" , ")}
                </p>
              </div>
            </div>
          </td>
          <td>{product.price}</td>
          <td>
            <p className="mb-1 text-muted">
              <span className="text-dark fw-medium">{product.stock.available} Item</span> Left
            </p>
            <p className="mb-0 text-muted">{product.stock.sold} Sold</p>
          </td>
          <td>{product.category}</td>
          <td>
            <span className="badge p-1 bg-light text-dark fs-12 me-1">
              <span className="align-middle text-warning me-1">⭐</span>
              {product.rating.score}
            </span>
            {product.rating.count} Review
          </td>
          <td>
            <ProductActions />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default ProductTableBody;