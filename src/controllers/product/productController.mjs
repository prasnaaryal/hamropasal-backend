import * as ProductService from "../../services/product/productService.mjs";

export const createProduct = async (req, res) => {
  const { name, category, image, price, description } = req.body;
  try {
    const product = await ProductService.createProduct({
      name,
      category,
      image,
      price,
      description,
    });
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
export const getAllProducts = async (req,res) => {
    try {
        const products = await ProductService.getAllProducts();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
export const getProductsByQuery = async(req, res) => {
    try {
        const {query} = req.body;
        const products = await ProductService.getProductsByQuery(query);
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
export const deleteProduct = async(req, res) => {
    try {
        const {productId} = req.params;
        await ProductService.deleteProduct(productId);
        res.status(200).send({message: "Product deleted successfully"});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
export const updateProduct = async(req, res) => {
    try {
        const {productId} = req.params;
        const {name, category, image, price, description} = req.body;
        const product = await ProductService.updateProduct(productId, name, category, image, price, description);
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
export const getProductsById = async(req, res) => {
    try {
        const {productId} = req.params;
        const product = await ProductService.getProductsById(productId);
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
