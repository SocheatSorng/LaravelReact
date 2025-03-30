import React from "react";
import { useParams } from "react-router-dom";
import DynamicPage from "../DynamicPage";

const PageRenderer = () => {
  const { slug } = useParams();

  // Pass the slug to the DynamicPage component
  return <DynamicPage slug={slug} />;
};

export default PageRenderer;
