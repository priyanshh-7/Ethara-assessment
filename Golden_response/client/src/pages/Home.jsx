import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BookOpen, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { domains } from "../data/domains.js";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.18], [1, 0.45]);

  return (
    <>
      <section className="story-gradient overflow-hidden">
        <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <motion.div style={{ y, opacity }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-bold text-teal shadow-sm">
              <Sparkles size={16} aria-hidden="true" />
              Role based LMS for modern tech learning
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-normal sm:text-6xl lg:text-7xl">Ethara Learn</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70">
              Build skills through immersive courses, educator-led lectures, secure checkout, progress tracking, and learner support.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 font-bold text-white hover:bg-ink/90" to="/courses">
                Explore courses
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link className="inline-flex items-center justify-center rounded-md border border-ink/15 bg-white px-5 py-3 font-bold hover:bg-ink hover:text-white" to="/signup">
                Start learning
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
            <img
              className="h-[520px] w-full rounded-lg object-cover shadow-soft"
              src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80"
              alt="Students learning with laptops in a collaborative classroom"
            />
            <div className="absolute bottom-5 left-5 right-5 grid gap-3 rounded-lg bg-white/90 p-4 shadow-soft backdrop-blur sm:grid-cols-3">
              {[
                ["5", "Domains"],
                ["JWT", "Secure auth"],
                ["Razorpay", "Checkout"]
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="text-xl font-extrabold">{value}</div>
                  <div className="text-sm text-ink/60">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section
        id="about"
        className="bg-white py-20"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="font-bold uppercase tracking-[0.2em] text-coral">About</p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-normal">Learning that moves with your ambition.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                [BookOpen, "Educators create courses, set prices, and upload lectures."],
                [TrendingUp, "Students buy courses and track watched lecture progress."],
                [ShieldCheck, "Sanitized APIs, role protection, and structured errors."]
              ].map(([Icon, text]) => (
                <motion.div key={text} whileHover={{ y: -4 }} className="rounded-lg border border-ink/10 bg-mist p-5">
                  <Icon className="text-teal" aria-hidden="true" />
                  <p className="mt-4 text-sm leading-6 text-ink/70">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <section id="courses" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-3xl">
            <p className="font-bold uppercase tracking-[0.2em] text-teal">Courses</p>
            <h2 className="mt-3 text-4xl font-extrabold">Domains offered on Ethara Learn.</h2>
          </motion.div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {domains.map((domain, index) => (
              <motion.article
                key={domain.name}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.55 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-lg bg-white shadow-sm"
              >
                <img src={domain.image} alt="" className="h-36 w-full object-cover" loading="lazy" />
                <div className="p-4">
                  <h3 className="font-extrabold">{domain.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{domain.copy}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        id="cart"
        className="bg-ink py-20 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-amber">Cart</p>
            <h2 className="mt-3 text-4xl font-extrabold">Add multiple courses and buy together.</h2>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} className="rounded-lg bg-white p-6 text-ink">
            <div className="h-3 rounded-full bg-ink/10">
              <motion.div className="h-3 rounded-full bg-coral" initial={{ width: "10%" }} whileInView={{ width: "82%" }} transition={{ duration: 1 }} />
            </div>
            <p className="mt-5 text-lg font-bold">Progress, cart updates, and payment confirmation all happen through protected API endpoints.</p>
            <Link className="mt-5 inline-flex items-center gap-2 rounded-md bg-teal px-4 py-3 font-bold text-white" to="/cart">
              Open cart
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
