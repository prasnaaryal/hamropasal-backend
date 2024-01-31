import productModel from "../../models/Product.js";

export const createProduct = async (product) => {
  try {
    const newProduct = await productModel(product);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllProducts = async () => {
  try {
    const products = await productModel.find({});
    return products;
  } catch (error) {
    throw new Error(error);
  }
};

export const getProductsByQuery = async (searchQuery) => {
  try {
    let query = {}; // Empty query by default

    if (searchQuery) {
      // If a search query is provided, create a regular expression to perform a case-insensitive search
      const searchRegex = new RegExp(searchQuery, "i");
      query = { name: searchRegex }; // Modify the field name ('name' in this case) according to your data model
    }

    const products = await productModel.find(query);
    return products;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteProduct = async (productId) => {
  try {
    await productModel.findByIdAndDelete(productId);
    return;
  } catch (error) {
    throw new Error(error);
  }
};
export const updateProduct = async (
  productId,
  name,
  category,
  image,
  price,
  description
) => {
  try {
    const product = await productModel.findById(productId);
    if (name) {
      product.name = name;
    }
    if (category) {
      product.category = category;
    }
    if (image) {
      product.image = image;
    }
    if (price) {
      product.price = price;
    }
    if (description) {
      product.description = description;
    }
    await product.save();
    return product;
  } catch (error) {
    throw new Error(error);
  }
};

export const getProductsById = async (productId) => {
  try {
    const product = await productModel.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    throw new Error(error);
  }
};
