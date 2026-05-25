import { KeyRound } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import http, { apiError } from "../api/http.js";
import Input from "../components/Input.jsx";
import { strongPassword } from "../utils/validation.js";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (!strongPassword(password)) return setError("Use 8 characters with uppercase, lowercase and number");
    setError("");
    try {
      const { data } = await http.patch(`/auth/reset-password/${token}`, { password });
      toast.success(data.message);
      navigate("/login");
    } catch (requestError) {
      toast.error(apiError(requestError));
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-lg bg-white p-6 shadow-soft">
        <h1 className="text-3xl font-extrabold">Reset password</h1>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input label="New password" type="password" value={password} error={error} onChange={(event) => setPassword(event.target.value)} />
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 font-bold text-white">
            <KeyRound size={18} aria-hidden="true" />
            Update password
          </button>
        </form>
      </div>
    </section>
  );
}
