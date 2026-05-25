import { LogIn } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import http, { apiError } from "../api/http.js";
import Input from "../components/Input.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { isEmail, required } from "../utils/validation.js";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!isEmail(form.email)) nextErrors.email = "Enter a valid email";
    if (!required(form.password)) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const { data } = await http.post("/auth/login", form);
      login(data.token, data.user);
      toast.success(data.message);
      navigate("/profile");
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-lg bg-white p-6 shadow-soft">
        <h1 className="text-3xl font-extrabold">Login</h1>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input label="Email" type="email" value={form.email} error={errors.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <Input label="Password" type="password" value={form.password} error={errors.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 font-bold text-white" type="submit">
            <LogIn size={18} aria-hidden="true" />
            Login
          </button>
        </form>
        <div className="mt-5 flex justify-between text-sm font-semibold">
          <Link className="text-teal" to="/forgot-password">
            Forgot password?
          </Link>
          <Link className="text-coral" to="/signup">
            Create account
          </Link>
        </div>
      </div>
    </section>
  );
}
