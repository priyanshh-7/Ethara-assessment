import { UserPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import http, { apiError } from "../api/http.js";
import Input from "../components/Input.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { isEmail, required, strongPassword } from "../utils/validation.js";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "student", password: "" });
  const [errors, setErrors] = useState({});

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!required(form.name)) nextErrors.name = "Name is required";
    if (!isEmail(form.email)) nextErrors.email = "Enter a valid email";
    if (!required(form.phone)) nextErrors.phone = "Phone is required";
    if (!strongPassword(form.password)) nextErrors.password = "Use 8 characters with uppercase, lowercase and number";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const { data } = await http.post("/auth/register", form);
      login(data.token, data.user);
      toast.success(data.message);
      navigate("/profile");
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  return (
    <section className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-lg bg-white p-6 shadow-soft">
        <h1 className="text-3xl font-extrabold">Sign up</h1>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input label="Full name" value={form.name} error={errors.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <Input label="Email" type="email" value={form.email} error={errors.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <Input label="Phone" value={form.phone} error={errors.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink/75">Role</span>
            <select className="w-full rounded-md border border-ink/15 bg-white px-3 py-3" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option value="student">Student</option>
              <option value="educator">Educator</option>
            </select>
          </label>
          <Input label="Password" type="password" value={form.password} error={errors.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-coral px-5 py-3 font-bold text-white" type="submit">
            <UserPlus size={18} aria-hidden="true" />
            Create account
          </button>
        </form>
      </div>
    </section>
  );
}
