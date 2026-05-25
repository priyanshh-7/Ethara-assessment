export default function Input({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ink/75">{label}</span>
      <input
        className="w-full rounded-md border border-ink/15 bg-white px-3 py-3 outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/15"
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <span className="mt-1 block text-sm font-semibold text-coral">{error}</span>}
    </label>
  );
}
