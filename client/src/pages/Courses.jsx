import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import http, { apiError } from "../api/http.js";
import CourseCard from "../components/CourseCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { domains } from "../data/domains.js";

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    http
      .get("/courses", { params: domain ? { domain } : {} })
      .then(({ data }) => setCourses(data.courses))
      .catch((error) => toast.error(apiError(error)))
      .finally(() => setLoading(false));
  }, [domain]);

  const addToCart = async (courseId) => {
    if (!user) return toast.error("Please login as a student to add courses");
    if (user.role !== "student") return toast.error("Educator accounts cannot add courses to cart");
    try {
      await http.post(`/cart/${courseId}`);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-bold uppercase tracking-[0.2em] text-teal">Catalog</p>
          <h1 className="mt-2 text-4xl font-extrabold">Courses</h1>
        </div>
        <label className="max-w-xs">
          <span className="mb-1 block text-sm font-semibold text-ink/70">Domain</span>
          <select className="w-full rounded-md border border-ink/15 bg-white px-3 py-3" value={domain} onChange={(event) => setDomain(event.target.value)}>
            <option value="">All domains</option>
            {domains.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="py-16">Loading courses...</div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} onAddToCart={addToCart} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
