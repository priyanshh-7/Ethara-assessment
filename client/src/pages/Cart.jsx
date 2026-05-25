import { motion } from "framer-motion";
import { IndianRupee, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import http, { apiError } from "../api/http.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Cart() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const loadCart = () =>
    http
      .get("/cart")
      .then(({ data }) => {
        setItems(data.cart.courses);
        setTotal(data.total);
      })
      .catch((error) => toast.error(apiError(error)));

  useEffect(() => {
    loadCart();
  }, []);

  const remove = async (courseId) => {
    try {
      await http.delete(`/cart/${courseId}`);
      toast.success("Removed from cart");
      loadCart();
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  const checkout = async () => {
    try {
      const { data } = await http.post("/payments/order");
      const options = {
        key: data.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Ethara Learn",
        description: "Course purchase",
        order_id: data.order.id,
        prefill: { name: user.name, email: user.email, contact: user.phone },
        handler: async (response) => {
          await http.post("/payments/verify", response);
          toast.success("Purchase complete");
          loadCart();
        },
        modal: { ondismiss: () => toast("Payment cancelled") }
      };

      if (!window.Razorpay) {
        toast.error("Razorpay checkout script is not loaded");
        return;
      }
      new window.Razorpay(options).open();
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold">Cart</h1>
      <div className="mt-8 grid gap-6">
        {items.map((course) => (
          <motion.article key={course._id} whileHover={{ x: 4 }} className="grid gap-4 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-[140px_1fr_auto] sm:items-center">
            <img className="h-28 w-full rounded-md object-cover sm:w-36" src={course.thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"} alt="" />
            <div>
              <h2 className="text-xl font-extrabold">{course.title}</h2>
              <p className="mt-1 text-sm text-ink/60">{course.domain}</p>
              <p className="mt-2 inline-flex items-center font-bold">
                <IndianRupee size={16} aria-hidden="true" />
                {course.price}
              </p>
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-md border border-ink/10 hover:bg-coral hover:text-white" onClick={() => remove(course._id)} aria-label={`Remove ${course.title}`}>
              <Trash2 size={18} aria-hidden="true" />
            </button>
          </motion.article>
        ))}
        {!items.length && <div className="rounded-lg bg-white p-8 text-ink/60">Your cart is empty.</div>}
      </div>
      <div className="mt-8 flex flex-col gap-4 rounded-lg bg-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center text-2xl font-extrabold">
          Total: <IndianRupee className="ml-3" size={22} aria-hidden="true" />
          {total}
        </span>
        <button className="rounded-md bg-amber px-5 py-3 font-extrabold text-ink disabled:cursor-not-allowed disabled:opacity-50" disabled={!items.length} onClick={checkout}>
          Buy all courses
        </button>
      </div>
    </section>
  );
}
