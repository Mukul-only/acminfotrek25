import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      default: "logout",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 43200, // 12 hours (matches your JWT expiry)
    },
  },
  { timestamps: true }
);

const Blacklist = mongoose.model("Blacklist", blacklistSchema);
export default Blacklist;
