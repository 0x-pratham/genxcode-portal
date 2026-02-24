import LegalLayout from "../layouts/LegalLayout";

export default function Terms() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      accent="bg-fuchsia-500/20"
    >
      <p>
        GenXCode is a structured student-driven technical ecosystem.
      </p>

      <p>
        Members are expected to maintain professionalism, submit original work
        and follow community guidelines.
      </p>

      <p>
        Plagiarism, misuse or policy violations may lead to suspension or
        removal from the platform.
      </p>

      <p>
        The GenXCode leadership team reserves the right to update structure,
        systems and guidelines when necessary.
      </p>
    </LegalLayout>
  );
}
