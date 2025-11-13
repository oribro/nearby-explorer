import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    searchQuery: { type: String, required: true },
    searchType: { type: String, enum: ["text", "location"], required: true },
    resultsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model("History", historySchema);
export default History;