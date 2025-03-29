import React from "react";
import { Link } from "react-router-dom";
import shopBanner from "../assets/images/banner/banner-shop.jpg";

const getBackgroundImage = (curPage) => {
  const images = {
    Shop: shopBanner, // Using local image file
    Blog: "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=1200", // Book-related image
    About:
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1200", // Bookstore interior
    Contact:
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1200", // Bookstore interior
    "Single Product":
      "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1200", // Open book
  };
  return images[curPage] || images.Shop;
};

const PageHeader = ({ title, curPage }) => {
  return (
    <div
      className="pageheader-section"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${getBackgroundImage(
          curPage
        )}')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        padding: "80px 0",
        position: "relative",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="pageheader-content text-center">
              <h2 className="text-white mb-3">{title}</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-white text-decoration-none">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <span className="text-white">{curPage}</span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
