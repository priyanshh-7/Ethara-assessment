import { motion } from "framer-motion";
import { BookOpen, IndianRupee, TrendingUp, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import http, { apiError } from "../api/http.js";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    http
      .get("/profile/me")
      .then(({ data }) => setProfile(data))
      .catch((error) => toast.error(apiError(error)));
  }, []);

  if (!profile) return <section className="mx-auto max-w-7xl px-4 py-16">Loading profile...</section>;

  if (profile.role === "educator") {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-teal">Educator profile</p>
            <h1 className="mt-2 text-4xl font-extrabold">{profile.user.name}</h1>
          </div>
          <Link className="rounded-md bg-coral px-5 py-3 text-center font-bold text-white" to="/studio">
            Create course
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat icon={BookOpen} label="Courses" value={profile.courses.length} />
          <Stat icon={IndianRupee} label="Total earnings" value={`₹${profile.totalEarnings}`} />
          <Stat icon={UsersRound} label="Students" value={profile.courses.reduce((sum, course) => sum + course.enrolledStudents, 0)} />
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {profile.courses.map((course) => (
            <motion.article key={course._id} whileHover={{ y: -4 }} className="rounded-lg bg-white p-5 shadow-sm">
              <h2 className="text-xl font-extrabold">{course.title}</h2>
              <p className="mt-2 text-sm text-ink/60">{course.domain}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-md bg-mist p-3">
                  <div className="text-2xl font-extrabold">{course.enrolledStudents}</div>
                  <div className="text-sm text-ink/60">Students enrolled</div>
                </div>
                <div className="rounded-md bg-mist p-3">
                  <div className="text-2xl font-extrabold">₹{course.earnings}</div>
                  <div className="text-sm text-ink/60">Earnings</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="font-bold uppercase tracking-[0.2em] text-teal">Student profile</p>
      <h1 className="mt-2 text-4xl font-extrabold">{profile.user.name}</h1>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {profile.enrollments.map((enrollment) => (
          <motion.article key={enrollment._id} whileHover={{ y: -4 }} className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="text-xl font-extrabold">{enrollment.course.title}</h2>
            <p className="mt-2 text-sm text-ink/60">{enrollment.course.domain}</p>
            <div className="mt-5 h-3 rounded-full bg-ink/10">
              <div className="h-3 rounded-full bg-teal" style={{ width: `${enrollment.progress}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm font-semibold text-ink/65">
              <span>{enrollment.progress}% complete</span>
              <span>
                {enrollment.watched}/{enrollment.totalLectures} lectures
              </span>
            </div>
            <Link className="mt-5 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 font-bold text-white" to={`/courses/${enrollment.course._id}`}>
              <TrendingUp size={18} aria-hidden="true" />
              Continue
            </Link>
          </motion.article>
        ))}
        {!profile.enrollments.length && <div className="rounded-lg bg-white p-8 text-ink/60">No enrolled courses yet.</div>}
      </div>
    </section>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <Icon className="text-teal" aria-hidden="true" />
      <div className="mt-4 text-3xl font-extrabold">{value}</div>
      <div className="text-sm font-semibold text-ink/60">{label}</div>
    </div>
  );
}
