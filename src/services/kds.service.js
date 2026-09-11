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

  return await getOrdersByStation(
    stationId,
    tenantId,
    branchId
  );
};


const updateItemStatus = async (
  tenantId,
  branchId,
  itemId,
  status
) => {
  return await updateItemStatusInDb(
    itemId,
    status,
    tenantId,
    branchId
  );
};


const syncKds = async (
  tenantId,
  branchId,
  lastEventId
) => {
  return await getKdsEvents(
    tenantId,
    branchId,
    lastEventId
  );
};


const printKot = async (
  tenantId,
  branchId,
  orderId,
  printerIp,
  rawBytes
) => {
  return await createPrintJob(
    tenantId,
    branchId,
    orderId,
    printerIp,
    rawBytes
  );
};


export {
  getKdsOrders,
  updateItemStatus,
  syncKds,
  printKot
};