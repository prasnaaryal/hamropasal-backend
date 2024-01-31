// Schema is a class that allows us to represent a collection of fields
import { Schema, model } from "mongoose";
import categories from "../utils/categories.js";

const productSchema = new Schema({
    name: String,
    category: {
        type : String,
        enum : categories,
    },
    image: String,
    price: String,
    description: String,
});


export default model("Product", productSchema);
