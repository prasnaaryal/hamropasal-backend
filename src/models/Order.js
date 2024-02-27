import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      populate: ["firstName", "email"],
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
      },
    ],
    total: Number,
    status: {
      type: String,
      enum: ["pending", "confirmed", "inTransit", "delivered"],
      default: "pending",
    },
    paymentType: {
      type: String,
      enum: ["cod", "khalti"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "failed", "success"],
      default: "pending",
    },
    paymentId: String,
  },
  { timestamps: true }
);

export default model("Order", orderSchema);
