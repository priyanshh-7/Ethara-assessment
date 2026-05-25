import "@vidstack/react/player/styles/base.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { motion } from "framer-motion";
import { CheckCircle2, IndianRupee, Phone, PlayCircle, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import http, { apiError } from "../api/http.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);

  useEffect(() => {
    http
      .get(`/courses/${id}`)
      .then(({ data }) => {
        setCourse(data.course);
        setActiveLecture(data.course.lectures[0] || null);
      })
      .catch((error) => toast.error(apiError(error)));
  }, [id]);

  const addToCart = async () => {
    if (!user) return toast.error("Please login as a student");
    if (user.role !== "student") return toast.error("Only students can purchase courses");
    try {
      await http.post(`/cart/${course._id}`);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  const markWatched = async () => {
    if (!activeLecture || user?.role !== "student") return;
    try {
      const { data } = await http.patch(`/progress/${course._id}/lectures/${activeLecture._id}`);
      toast.success(`Progress ${data.progress}%`);
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  if (!course) return <section className="mx-auto max-w-7xl px-4 py-16">Loading course...</section>;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <img
            className="h-72 w-full rounded-lg object-cover shadow-soft"
            src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"}
            alt=""
          />
          <div className="mt-6">
            <span className="rounded-md bg-teal/10 px-3 py-2 text-sm font-bold text-teal">{course.domain}</span>
            <h1 className="mt-4 text-4xl font-extrabold">{course.title}</h1>
            <p className="mt-4 leading-8 text-ink/70">{course.description}</p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-ink/70">
              <span>Educator: {course.educator?.name}</span>
              <span className="inline-flex items-center gap-1">
                <Phone size={16} aria-hidden="true" />
                {course.educatorContact}
              </span>
              <span className="inline-flex items-center gap-1">
                <IndianRupee size={16} aria-hidden="true" />
                {course.price}
              </span>
            </div>
            <button className="mt-6 inline-flex items-center gap-2 rounded-md bg-coral px-5 py-3 font-bold text-white" onClick={addToCart}>
              <ShoppingCart size={18} aria-hidden="true" />
              Add to cart
            </button>
          </div>
        </motion.div>

        <aside className="space-y-4">
          {activeLecture ? (
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <MediaPlayer className="media-player" title={activeLecture.title} src={activeLecture.videoUrl} onEnded={markWatched}>
                <MediaProvider />
              </MediaPlayer>
              <h2 className="mt-4 text-xl font-extrabold">{activeLecture.title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">{activeLecture.description}</p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-md border border-ink/15 px-4 py-2 font-bold hover:bg-ink hover:text-white" onClick={markWatched}>
                <CheckCircle2 size={18} aria-hidden="true" />
                Mark watched
              </button>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-6 shadow-sm">No lectures have been uploaded yet.</div>
          )}

          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="text-xl font-extrabold">Lectures</h2>
            <div className="mt-4 grid gap-2">
              {course.lectures.map((lecture) => (
                <button
                  key={lecture._id}
                  className={`flex items-center gap-3 rounded-md border px-3 py-3 text-left transition ${
                    activeLecture?._id === lecture._id ? "border-teal bg-teal/10" : "border-ink/10 hover:bg-ink/5"
                  }`}
                  onClick={() => setActiveLecture(lecture)}
                >
                  <PlayCircle className="shrink-0 text-teal" size={20} aria-hidden="true" />
                  <span>
                    <span className="block font-bold">{lecture.title}</span>
                    <span className="text-sm text-ink/60">{lecture.durationMinutes || 0} minutes</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
