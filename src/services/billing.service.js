import {
  getBillingSummary,
  getOrderForSplit,
  getOrderItemsForSplit,
} from "../repositories/billing.repository.js";
import {
  validateBillingSummary,
  validateSplitBill,
} from "../validators/billing.validator.js";

export const fetchBillingSummary = async ({ tenantId, orderId }) => {
  //validating request data
  validateBillingSummary({
    tenantId,
    orderId,
  });

  //getting billing summary
  const billingSummary = await getBillingSummary({
    tenantId,
    orderId,
  });

  //checking if order exists
  if (!billingSummary) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return billingSummary;
};

export const splitBill = async ({
  tenantId,
  orderId,
  splitType,
  parts,
  items,
}) => {
  //validating request data
  validateSplitBill({
    tenantId,
    orderId,
    splitType,
    parts,
    items,
  });

  //getting order details
  const order = await getOrderForSplit({
    tenantId,
    orderId,
  });

  //checking if order exists
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  // EQUAL split logic
  if (splitType === "EQUAL") {
    const totalAmount = Number(order.final_total);
    const numberOfParts = Number(parts);

    const splitAmount = totalAmount / numberOfParts;

    const breakdown = {};

    for (let i = 1; i <= numberOfParts; i++) {
      breakdown[`part_${i}`] = Number(splitAmount.toFixed(2));
    }

    // Calculating rounding difference
    const breakdownTotal = Object.values(breakdown).reduce((total, amount) => total + amount,0,);

    const difference = Number((totalAmount - breakdownTotal).toFixed(2));

    // Adding difference to first part
    if (difference !== 0) {
      breakdown["part_1"] = Number((breakdown["part_1"] + difference).toFixed(2),);
    }

    return {
      split_type: "EQUAL",
      total_amount: totalAmount,
      parts: numberOfParts,
      breakdown,
    };
  }

  // BY_ITEM split logic
  if (splitType === "BY_ITEM") {
    // Getting all order items from database
    const orderItems = await getOrderItemsForSplit({
      orderId,
    });

    // Creating breakdown for each part
    const breakdown = {};

    for (let i = 1; i <= Number(parts); i++) {
      breakdown[`part_${i}`] = 0;
    }

    // Processing each item sent by frontend
    for (const requestedItem of items) {
      // Finding the actual order item in database
      const orderItem = orderItems.find(
        (item) => item.id === requestedItem.order_item_id,
      );

      // Checking if item belongs to the order
      if (!orderItem) {
        const error = new Error("Order item not found for this order");
        error.statusCode = 404;
        throw error;
      }

      // Calculating actual item total
      const itemTotal =
        Number(orderItem.quantity) * Number(orderItem.unit_price);

      // Getting number of parts sharing this item
      const assignedParts = requestedItem.assigned_parts;

      const shareAmount = itemTotal / assignedParts.length;

      // Adding share to each assigned part
      for (const part of assignedParts) {
        breakdown[`part_${part}`] += shareAmount;
      }
    }

    // Calculate total amount currently assigned to all parts
    const itemsTotal = Object.values(breakdown).reduce(
      (total, amount) => total + amount,
      0,
    );

    // Getting final order total
    const totalAmount = Number(order.final_total);

    // Calculating extra amount such as tax/service charge
    const extraAmount = totalAmount - itemsTotal;

    // Distributing extra amount proportionally
    if (itemsTotal > 0 && extraAmount !== 0) {
      for (const part in breakdown) {
        const proportion = breakdown[part] / itemsTotal;
        breakdown[part] += extraAmount * proportion;
      }
    }

    // Rounding all values
    for (const part in breakdown) {
      breakdown[part] = Number(breakdown[part].toFixed(2));
    }

    // Fixing rounding difference
    const breakdownTotal = Object.values(breakdown).reduce(
      (total, amount) => total + amount,
      0,
    );

    const difference = Number((totalAmount - breakdownTotal).toFixed(2));

    if (difference !== 0) {
      breakdown["part_1"] = Number(
        (breakdown["part_1"] + difference).toFixed(2),
      );
    }
    return {
      split_type: "BY_ITEM",
      total_amount: totalAmount,
      parts: Number(parts),
      breakdown,
    };
  }
};
