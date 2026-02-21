export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await fetch(
      "https://submit-form.com/qtsJJPvsl",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.FORMSPARK_KEY}`
        },
        body: JSON.stringify(req.body),
      }
    );

    if (!response.ok) {
      return res.status(500).json({ message: "Submission failed" });
    }

    return res.status(200).json({ message: "Success" });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}