export default async function handler(request) {
  // Only allow POST requests
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const body = await request.json();

    const {
      device,
      problem,
      age,
      condition,
      description
    } = body;

    // Validate required fields
    if (!device || !problem || !age || !condition) {
      return Response.json(
        { error: "Missing diagnosis information." },
        { status: 400 }
      );
    }

    if (!description || description.trim().length < 8) {
      return Response.json(
        {
          error:
            "Please describe the device problem in a little more detail."
        },
        { status: 400 }
      );
    }

    // API key is stored ONLY on Vercel
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error: "AI service is not configured yet."
        },
        { status: 500 }
      );
    }

    const prompt = `
You are the AI diagnosis engine for RE:FIX,
an e-waste repair and recycling platform.

Your job is to help a user decide whether an electronic
device should be REPAIRED, REUSED/DONATED, or RECYCLED.

This is an educational prototype.

Do not claim certainty.
Do not invent exact technical faults.
Do not provide dangerous electrical repair instructions.

USER INFORMATION

Device:
${device}

Main problem:
${problem}

Approximate age:
${age} years

Current condition:
${condition}

User description:
${description}

Return ONLY valid JSON.

Required structure:

{
  "diagnosis": "short likely issue",
  "recommendation": "REPAIR | REUSE | RECYCLE",
  "repairability": 0,
  "confidence": 0,
  "reason": "short explanation",
  "difficulty": "Easy | Medium | Hard",
  "repairCost": "₹X–₹Y",
  "potentialSaving": 0,
  "wasteAvoided": 0,
  "nextAction": "clear practical next step"
}

Rules:

- repairability must be between 0 and 100.
- confidence must be between 50 and 95.
- recommendation must be exactly REPAIR, REUSE, or RECYCLE.
- potentialSaving must be a reasonable INR estimate.
- wasteAvoided must be an approximate number of grams.
- repairCost must be an approximate range.
- Do not give an exact service quote.
- Keep the explanation concise.
- Prefer repair when the problem is commonly serviceable.
- Prefer reuse when the device still has useful value but repair economics are weak.
- Prefer recycle when the device is severely damaged, very old, or unlikely to be economically useful.
`;

    /*
     * IMPORTANT:
     * Use an API model ID that is currently available
     * in your OpenAI API account.
     *
     * Replace the value below if your API account uses
     * a different model ID.
     */
    const model = process.env.OPENAI_MODEL || "gpt-5.6";

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },

        body: JSON.stringify({
          model,
          input: prompt,
          max_output_tokens: 700
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "OpenAI API error:",
        errorText
      );

      return Response.json(
        {
          error: "AI service request failed."
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    const output =
      data.output_text || "";

    if (!output) {
      throw new Error(
        "AI returned an empty response."
      );
    }

    // Remove possible markdown code fences
    const cleaned = output
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const diagnosis = JSON.parse(cleaned);

    // Validate recommendation
    const allowedRecommendations = [
      "REPAIR",
      "REUSE",
      "RECYCLE"
    ];

    if (
      !allowedRecommendations.includes(
        diagnosis.recommendation
      )
    ) {
      throw new Error(
        "Invalid recommendation returned by AI."
      );
    }

    // Sanitize numeric values
    diagnosis.repairability = Math.max(
      0,
      Math.min(
        100,
        Number(diagnosis.repairability) || 0
      )
    );

    diagnosis.confidence = Math.max(
      50,
      Math.min(
        95,
        Number(diagnosis.confidence) || 50
      )
    );

    diagnosis.potentialSaving = Math.max(
      0,
      Number(diagnosis.potentialSaving) || 0
    );

    diagnosis.wasteAvoided = Math.max(
      0,
      Number(diagnosis.wasteAvoided) || 0
    );

    return Response.json({
      success: true,
      diagnosis
    });

  } catch (error) {

    console.error(
      "Diagnosis error:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to generate AI diagnosis."
      },
      { status: 500 }
    );
  }
}