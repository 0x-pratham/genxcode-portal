import LegalLayout from "../components/LegalLayout";

export default function Privacy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      accent="bg-cyan-500/20"
    >
      <p>
        At GenXCode, we prioritize transparency and responsible data usage.
      </p>

      <p>
        We collect minimal information such as your name, email and activity
        data to manage your membership, points, challenges and community
        participation.
      </p>

      <p>
        All data is securely stored. We do not sell or distribute personal
        information to third parties.
      </p>

      <p>
        Continued use of the platform implies agreement with this policy.
      </p>
    </LegalLayout>
  );
}
