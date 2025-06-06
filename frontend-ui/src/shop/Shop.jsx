import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { fetchProducts } from "../utilis/fetchProducts";
import ProductCards from "./ProductCards";
import Pagination from "./Pagination";
import Search from "./Search";
import ShopCategory from "./ShopCategory";
import { useSearchParams } from "react-router-dom";
import LoadingSkeleton from "./LoadingSkeleton";
import { get } from "../utilis/apiService";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [GridList] = useState(true); // Fixed to grid view only
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // function to change the current page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fetch products and set categories
  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch products using the utility function
        const result = await fetchProducts();
        const fetchedProducts = result.data || [];

        // Fetch categories using API service
        const categoriesResult = await get("categories");
        const fetchedCategories = categoriesResult.data || [];

        // Cache the products in localStorage
        localStorage.setItem("shopProducts", JSON.stringify(fetchedProducts));

        setAllProducts(fetchedProducts);

        if (categoryParam) {
          setSelectedCategory(categoryParam);
          setProducts(
            fetchedProducts.filter(
              (product) =>
                product.CategoryID?.toString() === categoryParam ||
                product.category?.toString() === categoryParam
            )
          );
        } else {
          setProducts(fetchedProducts);
        }

        // Create categories list - "All Categories" + categories from API
        const uniqueCategories = [
          "All Categories",
          ...fetchedCategories.map((cat) => cat.Name || cat.name),
        ];

        setCategories(uniqueCategories);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Try to get cached products first
    const cachedProducts = localStorage.getItem("shopProducts");
    if (cachedProducts) {
      const products = JSON.parse(cachedProducts);
      setAllProducts(products);
      setProducts(
        categoryParam
          ? products.filter(
              (product) =>
                product.CategoryID?.toString() === categoryParam ||
                product.category?.toString() === categoryParam
            )
          : products
      );
      setIsLoading(false);

      // Still need to fetch categories if not cached
      get("categories")
        .then((result) => {
          const fetchedCategories = result.data || [];
          const uniqueCategories = [
            "All Categories",
            ...fetchedCategories.map((cat) => cat.Name || cat.name),
          ];
          setCategories(uniqueCategories);
        })
        .catch((err) => console.error("Error fetching categories:", err));
    } else {
      getProducts();
    }
  }, [categoryParam]);

  // Filter products based on selected category
  const filterItem = (curcat) => {
    setSelectedCategory(curcat);

    if (curcat === "All Categories") {
      setProducts(allProducts);
    } else {
      const filteredProducts = allProducts.filter((product) => {
        // Check both CategoryName and the relation to category
        return (
          product.CategoryName === curcat ||
          product.category?.Name === curcat ||
          product.category === curcat
        );
      });
      setProducts(filteredProducts);
    }
  };

  // Calculate the range of products displayed
  const totalProducts = products.length;
  const displayFrom = indexOfFirstProduct + 1;
  const displayTo = Math.min(indexOfLastProduct, totalProducts);

  const showResults = `Showing ${displayFrom} - ${displayTo} of ${totalProducts} Results`;
  return (
    <div>
      <PageHeader title="Our Shop Page" curPage="Shop" />
      <div className="shop-page padding-tb">
        <div className="container">
          {error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : (
            <div className="row justify-content-center">
              <div className="col-lg-9 col-12">
                <article>
                  {isLoading ? (
                    <LoadingSkeleton count={6} />
                  ) : (
                    <>
                      <div className="shop-title d-flex flex-warp justify-content-between">
                        <p>{showResults}</p>
                      </div>

                      {/* product cards */}
                      <div>
                        <ProductCards
                          GridList={GridList}
                          products={currentProducts}
                        />
                      </div>

                      <Pagination
                        productsPerPage={productsPerPage}
                        totalProducts={totalProducts}
                        paginate={paginate}
                        activePage={currentPage}
                      />
                    </>
                  )}
                </article>
              </div>
              {!isLoading && (
                <div className="col-lg-3 col-12">
                  <aside>
                    <Search products={products} GridList={GridList} />
                    <ShopCategory
                      filterItem={filterItem}
                      menuItems={categories}
                      selectedCategory={selectedCategory}
                    />
                  </aside>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
