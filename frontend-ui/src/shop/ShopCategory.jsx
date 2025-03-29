import React from "react";

const ShopCategory = ({ filterItem, menuItems, selectedCategory }) => {
  return (
    <>
      <div className="widget-header mb-3">
        <h5 className="border-bottom pb-2">All Categories</h5>
      </div>
      <div className="category-list">
        {menuItems.map((Val, id) => {
          return (
            <button
              className={`btn btn-outline-secondary w-100 text-start mb-2 ${
                selectedCategory === Val ? "active bg-primary text-white" : ""
              }`}
              key={id}
              onClick={() => filterItem(Val)}
            >
              {Val}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default ShopCategory;
