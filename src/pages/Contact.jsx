import LegalLayout from "../components/LegalLayout";

export default function Contact() {
  return (
    <LegalLayout
      title="Contact Us"
      accent="bg-emerald-500/20"
    >
      <p>
        For collaborations, partnerships or membership support, feel free to
        reach out.
      </p>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-cyan-300 font-medium">
          📧 genxcode.community@gmail.com
        </p>
        <p>📞 +917057020856</p>
      </div>

      <p>
        Our team typically responds within 24–48 hours.
      </p>
    </LegalLayout>
  );
}
