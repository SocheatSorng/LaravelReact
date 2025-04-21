import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import { get, getImageUrl } from "../utilis/apiService";

// Import Swiper React Components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

import ProductDisplay from "./ProductDisplay";

const SingleProduct = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        // Fetch the specific book by ID using API service
        const result = await get(`books/${id}`);

        if (result.success && result.data) {
          // Format the data to match the expected structure
          const formattedProduct = {
            id: result.data.BookID,
            title: result.data.Title,
            price: result.data.Price,
            brand: result.data.Author,
            stock: result.data.StockQuantity,
            description:
              result.data.book_detail?.Description ||
              "No description available",
            // Store the BookID for image path construction
            BookID: result.data.BookID,
            category_id: result.data.CategoryID,
          };

          setProduct(formattedProduct);

          // Fetch related books using API service
          try {
            const relatedResult = await get(`books/${id}/related`);
            if (relatedResult.success && relatedResult.data) {
              // Format related books
              const formattedRelated = relatedResult.data
                .map((book) => ({
                  id: book.BookID,
                  title: book.Title,
                  price: book.Price,
                  brand: book.Author,
                  stock: book.StockQuantity,
                  // Store BookID for image path
                  BookID: book.BookID,
                  category_id: book.CategoryID,
                }))
                .slice(0, 4);

              setRelatedProducts(formattedRelated);
            }
          } catch (relatedError) {
            console.error("Error fetching related products:", relatedError);
            // If related books API fails, fetch all books and filter
            try {
              const allBooksResult = await get("books");
              if (allBooksResult && Array.isArray(allBooksResult.data)) {
                const related = allBooksResult.data
                  .filter(
                    (book) =>
                      book.BookID !== parseInt(id) &&
                      (book.Author === formattedProduct.brand ||
                        book.CategoryID === formattedProduct.category_id)
                  )
                  .map((book) => ({
                    id: book.BookID,
                    title: book.Title,
                    price: book.Price,
                    brand: book.Author,
                    stock: book.StockQuantity,
                    // Store BookID for image path
                    BookID: book.BookID,
                    category_id: book.CategoryID,
                  }))
                  .slice(0, 4);

                setRelatedProducts(related);
              }
            } catch (allBooksError) {
              console.error("Error fetching all books:", allBooksError);
            }
          }
        } else {
          setError("Product data not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Error loading product");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error || !product) {
    return (
      <div className="text-center p-5">
        <h4 className="text-secondary">{error || "Book not found"}</h4>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={"Book Details"} curPage={"Single Product"} />
      <div className="shop-single padding-tb aside-bg">
        <div className="container">
          <div className="row justify-content-center">
            {/* left side */}
            <div className="col-lg-8 col-12">
              <article>
                <div className="product-details">
                  <div className="row align-items-center">
                    <div className="col-md-6 col-12">
                      <div className="product-thumb">
                        <div className="swiper-container pro-single-top">
                          {/* Swiper to display all images */}
                          <Swiper
                            spaceBetween={30}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                              delay: 2000,
                              disableOnInteraction: false,
                            }}
                            navigation={{
                              prevEl: ".pro-single-prev",
                              nextEl: ".pro-single-next",
                            }}
                            modules={[Navigation, Autoplay]}
                            className="mySwiper"
                          >
                            <SwiperSlide>
                              <div className="single-thumb">
                                <img
                                  src={getImageUrl(
                                    `books/${product.BookID}/image`
                                  )}
                                  alt={product.title}
                                  className="img-fluid rounded"
                                  onError={(e) => {
                                    e.target.src =
                                      "/assets/images/product-placeholder.png";
                                  }}
                                />
                              </div>
                            </SwiperSlide>
                          </Swiper>

                          {/* Navigation buttons */}
                          <div className="pro-single-prev">
                            <i className="icofont-rounded-left"></i>
                          </div>
                          <div className="pro-single-next">
                            <i className="icofont-rounded-right"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="post-content">
                        <div>
                          {product && <ProductDisplay item={product} />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Info Section */}
                <div className="review mt-5">
                  <ul
                    className="review-nav lab-ul nav nav-pills"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        id="pills-desc-tab"
                        data-bs-toggle="pill"
                        href="#pills-desc"
                        role="tab"
                        aria-controls="pills-desc"
                        aria-selected="true"
                      >
                        Description
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        id="pills-info-tab"
                        data-bs-toggle="pill"
                        href="#pills-info"
                        role="tab"
                        aria-controls="pills-info"
                        aria-selected="false"
                      >
                        Additional Info
                      </a>
                    </li>
                  </ul>

                  {/* Tab Content */}
                  <div
                    className="review-content tab-content"
                    id="pills-tabContent"
                  >
                    <div
                      className="review-desc tab-pane fade show active"
                      id="pills-desc"
                      role="tabpanel"
                      aria-labelledby="pills-desc-tab"
                    >
                      <p>{product.description}</p>
                    </div>
                    <div
                      className="review-desc tab-pane fade"
                      id="pills-info"
                      role="tabpanel"
                      aria-labelledby="pills-info-tab"
                    >
                      <div className="review-desc-content">
                        <ul className="lab-ul">
                          <li>
                            <span>Author:</span> {product.brand}
                          </li>
                          <li>
                            <span>ISBN:</span> {product.id + 978000000000}
                          </li>
                          <li>
                            <span>Language:</span> English
                          </li>
                          <li>
                            <span>Publisher:</span> Kinokuniya Publishing
                          </li>
                          <li>
                            <span>Pages:</span>{" "}
                            {Math.floor(Math.random() * 400) + 100}
                          </li>
                          <li>
                            <span>Availability:</span>{" "}
                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                  <div className="related-products mt-5">
                    <h4 className="title-border">Related Books</h4>
                    <div className="row">
                      {relatedProducts.map((item) => (
                        <div key={item.id} className="col-lg-3 col-md-6 col-12">
                          <div className="product-item">
                            <div className="product-thumb">
                              <div className="pro-thumb">
                                <img
                                  src={getImageUrl(
                                    `books/${item.BookID}/image`
                                  )}
                                  alt={item.title}
                                  onError={(e) => {
                                    e.target.src =
                                      "/assets/images/product-placeholder.png";
                                  }}
                                />
                              </div>
                              <div className="product-action-link">
                                <Link to={`/shop/${item.id}`}>
                                  <i className="icofont-eye"></i>
                                </Link>
                              </div>
                            </div>
                            <div className="product-content">
                              <h5>
                                <Link to={`/shop/${item.id}`}>
                                  {item.title.substring(0, 20)}...
                                </Link>
                              </h5>
                              <h6>${item.price}</h6>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </div>

            {/* Right side */}
            <div className="col-lg-4 col-12">
              <div className="sidebar-item">
                <div className="sidebar-inner">
                  <div className="sidebar-content">
                    <div className="product-details-tags">
                      <h5 className="title">Categories</h5>
                      <ul className="lab-ul">
                        <li>
                          <Link to="/shop">Fiction</Link>
                        </li>
                        <li>
                          <Link to="/shop">Non-Fiction</Link>
                        </li>
                        <li>
                          <Link to="/shop">Children's Books</Link>
                        </li>
                        <li>
                          <Link to="/shop">Textbooks</Link>
                        </li>
                        <li>
                          <Link to="/shop">Manga & Comics</Link>
                        </li>
                      </ul>
                    </div>

                    <div className="product-details-tags mt-4">
                      <h5 className="title">Popular Authors</h5>
                      <ul className="lab-ul">
                        <li>
                          <Link to="/shop">J.K. Rowling</Link>
                        </li>
                        <li>
                          <Link to="/shop">Haruki Murakami</Link>
                        </li>
                        <li>
                          <Link to="/shop">Stephen King</Link>
                        </li>
                        <li>
                          <Link to="/shop">Jane Austen</Link>
                        </li>
                        <li>
                          <Link to="/shop">George R.R. Martin</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
