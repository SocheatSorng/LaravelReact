import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { fetchProducts } from "../utilis/fetchProducts";
import Loading from "../components/Loading";

// Import Swiper React Components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

import ProductDisplay from "./ProductDisplay";

const SingleProduct = () => {
  const [product, setProduct] = useState(null); // Changed from [] to null
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        const foundProduct = products.find((p) => p.id === parseInt(id));
        setProduct(foundProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <div className="text-center p-5">
        <h4 className="text-secondary">Product not found</h4>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={"Our Shop Single"} curPage={"Shop / Single Product"} />
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
                            loop={false}
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
                                <img src={product.image} alt={product.title} />
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
              </article>
            </div>
            {/* Right side (if needed) */}
            {/* <div className='col-lg-4 col-12'>Right Side</div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
