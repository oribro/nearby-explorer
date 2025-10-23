import dotenv from "dotenv";
dotenv.config();

export const config = {
  openTripMapKey: process.env.OPENTRIPMAP_KEY,
  port: process.env.PORT || 5000,
};
