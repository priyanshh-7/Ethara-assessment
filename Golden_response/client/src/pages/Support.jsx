import { LifeBuoy, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import http, { apiError } from "../api/http.js";
import Input from "../components/Input.jsx";
import Textarea from "../components/Textarea.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { isEmail, required } from "../utils/validation.js";

export default function Support() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [token, setToken] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    courseId: "",
    issue: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    http.get("/courses").then(({ data }) => {
      setCourses(data.courses);
      setForm((current) => ({ ...current, courseId: current.courseId || data.courses[0]?._id || "" }));
    });
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!required(form.name)) nextErrors.name = "Required";
    if (!isEmail(form.email)) nextErrors.email = "Enter a valid email";
    if (!required(form.phone)) nextErrors.phone = "Required";
    if (!required(form.courseId)) nextErrors.courseId = "Required";
    if (!required(form.issue)) nextErrors.issue = "Required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const { data } = await http.post("/support", form);
      setToken(data.token);
      toast.success(data.message);
      setForm({ ...form, issue: "" });
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-md bg-teal text-white">
            <LifeBuoy aria-hidden="true" />
          </span>
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-teal">Customer support</p>
            <h1 className="text-3xl font-extrabold">Raise a course issue</h1>
          </div>
        </div>

        {token && (
          <div className="mt-6 flex items-center gap-3 rounded-lg border border-teal/20 bg-teal/10 p-4 font-bold text-teal">
            <Ticket aria-hidden="true" />
            Token number: {token}
          </div>
        )}

        <form className="mt-6 grid gap-4" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name} error={errors.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <Input label="Email" type="email" value={form.email} error={errors.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            <Input label="Phone" value={form.phone} error={errors.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-ink/75">Course unique ID</span>
              <select className="w-full rounded-md border border-ink/15 bg-white px-3 py-3" value={form.courseId} onChange={(event) => setForm({ ...form, courseId: event.target.value })} aria-invalid={Boolean(errors.courseId)}>
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title} - {course._id}
                  </option>
                ))}
              </select>
              {errors.courseId && <span className="mt-1 block text-sm font-semibold text-coral">{errors.courseId}</span>}
            </label>
          </div>
          <Textarea label="Issue" value={form.issue} error={errors.issue} onChange={(event) => setForm({ ...form, issue: event.target.value })} />
          <button className="rounded-md bg-coral px-5 py-3 font-bold text-white">Submit issue</button>
        </form>
      </div>
    </section>
  );
}
