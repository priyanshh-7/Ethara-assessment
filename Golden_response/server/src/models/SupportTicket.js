import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    issue: { type: String, required: true },
    status: { type: String, enum: ["open", "in-progress", "resolved"], default: "open" }
  },
  { timestamps: true }
);

export default mongoose.model("SupportTicket", supportTicketSchema);
