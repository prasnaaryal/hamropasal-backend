import Order from "../../models/Order.js";
import callKhaltiApi, { verifyPayment } from "../payment/khalti/index.mjs";
import { getProductsById } from "../product/productService.mjs";
import { getUserDetails } from "../user/userServices.mjs";

function calculateTotal(products) {
  return products.reduce(async (total, product) => {
    // Get the product details
    const productDetails = await getProductsById(product.product);
    // Calculate the price for this product (price * quantity)
    const productTotal = productDetails.price * product.quantity;

    // Add the price for this product to the total
    return total + productTotal;
  }, 0); // Start with a total of 0
}

export const createOrder = async ({
  user,
  products,
  paymentType,
  returnUrl,
  websiteUrl,
}) => {
  let total = 0;
  total = await calculateTotal(products);
  // const order = await Order.create({
  //   user,
  //   products,
  //   total,
  // });
  const order = new Order({
    user,
    products,
    total,
  });

  if (!order) {
    throw new Error("Order creation failed");
  }
  const userDetails = await getUserDetails(user);
  if (paymentType === "khalti" && user && returnUrl && websiteUrl) {
    // Prepare the payment data
    const paymentData = {
      return_url: returnUrl,
      website_url: websiteUrl,
      amount: total * 100, // Convert the amount to paisa (1 NPR = 100 paisa)
      purchase_order_id: order._id.toString(),
      purchase_order_name: "Order " + order._id,
      customer_info: {
        user_id: userDetails._id.toString(),
        email: userDetails.email,
        name: `${userDetails.firstName} ${userDetails.lastName}`,
      },
    };
    // Call the khalti payment gateway api
    const response = await callKhaltiApi(paymentData);
    // If the response is successful, return the order
    order.paymentType = paymentType;
    order.paymentId = response.pidx;
    order.save();
    return response;
  }
  order.save();
  return order;
};

export const confirmOrderPayment = async (pidx, orderId) => {
  // Call the khalti payment gateway api to verify the payment
  const response = await verifyPayment(pidx);
  // If the payment is successful, update the order status to 'paid'
  if (response.status === "Completed") {
    console.log("Order confirmed");
    return await updateOrderStatus(orderId, "confirmed", "success");
  }
  return response;
};

export const getAllOrders = async () => {
  return await Order.find();
};

export const getOrderById = async (orderId) => {
  return await Order.findById(orderId);
};

export const getAllOrdersByUser = async (userId) => {
  return await Order.find({ user: userId });
};

export const updateOrderStatus = async (orderId, status, paymentStatus) => {
  return await Order.findByIdAndUpdate(
    orderId,
    { status, paymentStatus },
    { new: true }
  );
};

export const deleteOrder = async (orderId) => {
  return await Order.findByIdAndDelete(orderId);
};

export const deleteAllOrders = async () => {
  return await Order.deleteMany();
};

// deleteAllOrders().then(() => {
//   console.log('All orders deleted');
// });
