import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    videoUrl: { type: String, required: true },
    durationMinutes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    domain: {
      type: String,
      enum: ["Cyber Security", "Data Science", "Full Stack Web Development", "Devops", "Agentic AI"],
      required: true
    },
    description: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    educator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    educatorContact: { type: String, required: true },
    lectures: [lectureSchema],
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
