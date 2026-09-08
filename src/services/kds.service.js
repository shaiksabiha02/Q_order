import {
  getOrdersByStation,
  updateItemStatusInDb,
  getKdsEvents,
  createPrintJob
} from "../repositories/kds.repository.js";


const getKdsOrders = async (
  tenantId,
  branchId,
  stationId
) => {
  const allowedStations = ["Bar", "Grill", "Main"];

  if (!allowedStations.includes(stationId)) {
    throw new Error("Invalid station_id");
  }

  const orders = await getOrdersByStation(
    stationId,
    tenantId,
    branchId
  );

  return orders;
};


const updateItemStatus = async (
  itemId,
  status,
  tenantId,
  branchId
) => {
  const item = await updateItemStatusInDb(
    itemId,
    status,
    tenantId,
    branchId
  );

  return item;
};


const getKdsSync = async (
  tenantId,
  branchId,
  lastEventId
) => {
  const events = await getKdsEvents(
    tenantId,
    branchId,
    lastEventId
  );

  return events;
};

const printKot = async (
  tenantId,
  branchId,
  orderId,
  printerIp,
  rawBytes
) => {
  const job = await createPrintJob(
    tenantId,
    branchId,
    orderId,
    printerIp,
    rawBytes
  );

  return job;
};

export {
  getKdsOrders,
  updateItemStatus,
  getKdsSync,
  printKot
};