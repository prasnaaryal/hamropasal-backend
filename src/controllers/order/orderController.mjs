import * as OrderService from '../../services/order/orderService.mjs';

export const createOrder = async (req, res) => {
  // products = {productid, quantity}
  // total = total price of all products
  const { products, paymentType, returnUrl, websiteUrl } = req.body;
  const { userId } = req.User;
  try {
    const order = await OrderService.createOrder({
      user: userId,
      products,
      paymentType,
      returnUrl,
      websiteUrl,
    });
    res.status(201).send(order);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const confirmOrderPayment = async (req, res) => {
  const { pidx, orderId } = req.body;
  try {
    const order = await OrderService.confirmOrderPayment(pidx, orderId);
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getAllOrdersByUser = async (req, res) => {
  try {
    // if id is not provided, get orders of logged in user
    const { id } = req.params;
    const { userId } = req.User;
    const orders = await OrderService.getAllOrdersByUser(id ?? userId);
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await OrderService.getOrderById(orderId);
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await OrderService.updateOrderStatus(orderId, status);
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    await OrderService.deleteOrder(orderId);
    res.status(200).send({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
