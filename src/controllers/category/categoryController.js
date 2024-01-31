import * as CategoriesService from "../../services/category/categoryServices.js";

export const getAllCategories = (req, res) => {
  try {
    const category = CategoriesService.getAllCategories();
    res.status(201).json({ count: category.length, categories: category });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
