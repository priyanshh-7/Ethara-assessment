import { motion } from "framer-motion";
import { IndianRupee, Phone, ShoppingCart, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function CourseCard({ course, onAddToCart }) {
  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm transition hover:shadow-soft"
    >
      <img
        src={course.thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"}
        alt=""
        className="h-48 w-full object-cover"
        loading="lazy"
      />
      <div className="space-y-4 p-5">
        <div>
          <span className="rounded-md bg-teal/10 px-2 py-1 text-xs font-bold text-teal">{course.domain}</span>
          <h3 className="mt-3 text-xl font-extrabold">{course.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/65">{course.description}</p>
        </div>
        <div className="grid gap-2 text-sm text-ink/65">
          <span className="inline-flex items-center gap-2">
            <UserRound size={16} aria-hidden="true" />
            {course.educator?.name || "Ethara educator"}
          </span>
          <span className="inline-flex items-center gap-2">
            <Phone size={16} aria-hidden="true" />
            {course.educatorContact || course.educator?.phone || "Contact unavailable"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center text-lg font-extrabold">
            <IndianRupee size={18} aria-hidden="true" />
            {course.price}
          </span>
          <div className="flex gap-2">
            <Link className="rounded-md border border-ink/15 px-3 py-2 text-sm font-bold hover:bg-ink hover:text-white" to={`/courses/${course._id}`}>
              View
            </Link>
            {onAddToCart && (
              <button className="grid h-10 w-10 place-items-center rounded-md bg-coral text-white hover:bg-coral/90" onClick={() => onAddToCart(course._id)} aria-label={`Add ${course.title} to cart`}>
                <ShoppingCart size={18} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
