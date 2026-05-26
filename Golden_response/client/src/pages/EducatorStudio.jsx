import { Plus, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import http, { apiError } from "../api/http.js";
import Input from "../components/Input.jsx";
import Textarea from "../components/Textarea.jsx";
import { domains } from "../data/domains.js";
import { required } from "../utils/validation.js";

const blankCourse = {
  title: "",
  domain: domains[0].name,
  description: "",
  thumbnail: "",
  price: "",
  educatorContact: ""
};

export default function EducatorStudio() {
  const [form, setForm] = useState(blankCourse);
  const [lecture, setLecture] = useState({ courseId: "", title: "", description: "", videoUrl: "", durationMinutes: "" });
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});

  const load = () =>
    http
      .get("/courses/educator/mine")
      .then(({ data }) => {
        setCourses(data.courses);
        setLecture((current) => ({ ...current, courseId: current.courseId || data.courses[0]?._id || "" }));
      })
      .catch((error) => toast.error(apiError(error)));

  useEffect(() => {
    load();
  }, []);

  const createCourse = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    ["title", "description", "price", "educatorContact"].forEach((field) => {
      if (!required(form[field])) nextErrors[field] = "Required";
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const { data } = await http.post("/courses", form);
      toast.success(data.message);
      setForm(blankCourse);
      load();
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  const addLecture = async (event) => {
    event.preventDefault();
    if (!lecture.courseId || !lecture.title || !lecture.videoUrl) {
      toast.error("Course, title and video URL are required");
      return;
    }
    try {
      const { data } = await http.post(`/courses/${lecture.courseId}/lectures`, lecture);
      toast.success(data.message);
      setLecture({ courseId: lecture.courseId, title: "", description: "", videoUrl: "", durationMinutes: "" });
      load();
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="font-bold uppercase tracking-[0.2em] text-teal">Educator studio</p>
      <h1 className="mt-2 text-4xl font-extrabold">Create courses and upload lectures</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form className="rounded-lg bg-white p-5 shadow-sm" onSubmit={createCourse}>
          <h2 className="text-2xl font-extrabold">New course</h2>
          <div className="mt-5 grid gap-4">
            <Input label="Title" value={form.title} error={errors.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-ink/75">Domain</span>
              <select className="w-full rounded-md border border-ink/15 bg-white px-3 py-3" value={form.domain} onChange={(event) => setForm({ ...form, domain: event.target.value })}>
                {domains.map((domain) => (
                  <option key={domain.name} value={domain.name}>
                    {domain.name}
                  </option>
                ))}
              </select>
            </label>
            <Textarea label="Description" value={form.description} error={errors.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <Input label="Thumbnail URL" value={form.thumbnail} onChange={(event) => setForm({ ...form, thumbnail: event.target.value })} />
            <Input label="Price" type="number" min="0" value={form.price} error={errors.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
            <Input label="Educator contact number" value={form.educatorContact} error={errors.educatorContact} onChange={(event) => setForm({ ...form, educatorContact: event.target.value })} />
            <button className="inline-flex items-center justify-center gap-2 rounded-md bg-coral px-5 py-3 font-bold text-white">
              <Plus size={18} aria-hidden="true" />
              Create course
            </button>
          </div>
        </form>

        <form className="rounded-lg bg-white p-5 shadow-sm" onSubmit={addLecture}>
          <h2 className="text-2xl font-extrabold">Upload lecture</h2>
          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-ink/75">Course</span>
              <select className="w-full rounded-md border border-ink/15 bg-white px-3 py-3" value={lecture.courseId} onChange={(event) => setLecture({ ...lecture, courseId: event.target.value })}>
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Lecture title" value={lecture.title} onChange={(event) => setLecture({ ...lecture, title: event.target.value })} />
            <Textarea label="Lecture description" value={lecture.description} onChange={(event) => setLecture({ ...lecture, description: event.target.value })} />
            <Input label="Video URL" value={lecture.videoUrl} onChange={(event) => setLecture({ ...lecture, videoUrl: event.target.value })} />
            <Input label="Duration in minutes" type="number" min="0" value={lecture.durationMinutes} onChange={(event) => setLecture({ ...lecture, durationMinutes: event.target.value })} />
            <button className="inline-flex items-center justify-center gap-2 rounded-md bg-teal px-5 py-3 font-bold text-white">
              <Upload size={18} aria-hidden="true" />
              Add lecture
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {courses.map((course) => (
          <article key={course._id} className="rounded-lg bg-white p-5 shadow-sm">
            <h3 className="text-lg font-extrabold">{course.title}</h3>
            <p className="mt-1 text-sm text-ink/60">{course.lectures.length} lectures</p>
            <p className="mt-3 text-sm font-semibold">Students: {course.enrolledStudents}</p>
            <p className="text-sm font-semibold">Earnings: ₹{course.earnings}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
