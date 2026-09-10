let ioInstance = null;

export const initOrderGateway = (io) => {
  ioInstance = io;
  io.on('connection', (socket) => {
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
    });
  });
};

export const getOrderGateway = () => {
  return {
    emitNewOrderToKDS: (branchId, orderData) => {
      if (ioInstance) {
        ioInstance.to(`branch_${branchId}_kds`).emit('NEW_ORDER_RECEIVED', orderData);
      }
    },
    emitOrderStatusUpdate: (orderId, status) => {
      if (ioInstance) {
        ioInstance.to(`order_${orderId}`).emit('ORDER_STATUS_UPDATED', {
          order_id: orderId,
          status,
          timestamp: new Date().toISOString()
        });
      }
    }
  };
};