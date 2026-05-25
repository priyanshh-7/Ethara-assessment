import { Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import http, { apiError } from "../api/http.js";
import Input from "../components/Input.jsx";
import { isEmail } from "../utils/validation.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (!isEmail(email)) return setError("Enter a valid email");
    setError("");
    try {
      const { data } = await http.post("/auth/forgot-password", { email });
      toast.success(data.message);
    } catch (requestError) {
      toast.error(apiError(requestError));
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-lg bg-white p-6 shadow-soft">
        <h1 className="text-3xl font-extrabold">Forgot password</h1>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input label="Email" type="email" value={email} error={error} onChange={(event) => setEmail(event.target.value)} />
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal px-5 py-3 font-bold text-white">
            <Mail size={18} aria-hidden="true" />
            Send reset link
          </button>
        </form>
      </div>
    </section>
  );
}
