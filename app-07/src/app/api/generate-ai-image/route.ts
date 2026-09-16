import { NextResponse } from "next/server";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: Request) {
  // SWITCHING to gemini-2.5-flash-image-preview (Nano Banana)
  // This model uses the standard generateContent endpoint.
  const FREE_TIER_MODEL = "gemini-2.5-flash-image-preview";
  const BASE_URL = "https://generativelanguage.googleapis.com";

  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Missing name field" },
        { status: 400 }
      );
    }
    
    // Construct the correct URL for the flash-image model
    const fullUrl = `${BASE_URL}/v1beta/models/${FREE_TIER_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    console.log("✅ GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Set" : "Not Set");
    console.log("✅ FULL GEMINI FLASH IMAGE URL (Free Tier):", fullUrl);

    const prompt = `Create an image for an instagram post on "${name}". Make it animation style image and don't show any text in the picture. ALso please make sure the image is in jpg format and do not exceed 400kb limit in size.`;

    // 1. Corrected URL using the gemini-2.5-flash-image-preview model
    const geminiRes = await fetch(
      fullUrl,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 2. Corrected Payload for generateContent endpoint
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            // Request the model to output an image modality
            responseModalities: ['IMAGE'], 
          },
        }),
      }
    );

    if (!geminiRes.ok) {
        const errorText = await geminiRes.text();
        console.error("🔴 GEMINI FLASH IMAGE RAW ERROR:", errorText);

        return NextResponse.json(
          {
              error: "Gemini Flash Image generation failed",
              details: errorText,
          },
          { status: geminiRes.status }
        );
    }


    const json = await geminiRes.json();

    // 3. Corrected extraction logic for the generateContent response with IMAGE modality
    // The base64 image data is found in candidates[0].content.parts[0].inlineData.data
    const base64 = json?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;

    if (!base64) {
      // Log the full response for debugging if no image is found
      console.error("🔴 Gemini Response JSON (No Base64 Found):", JSON.stringify(json, null, 2));

      return NextResponse.json(
        { error: "No image data returned from Gemini Flash Image" },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(base64, "base64");

    // S3 logic remains the same
    // const s3 = new S3Client({
    //   region: "eu-west-2",
    //   credentials: {
    //     accessKeyId: process.env.ACCESS_KEY_ID_AWS!,
    //     secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS!,
    //   },
    // });

    const key = `ai-images/${Date.now()}-${name.replace(/\s+/g, "_")}.png`;



    const url = `https://mangoapp-images.s3.eu-west-2.amazonaws.com/${key}`;

    return NextResponse.json({ imageUrl: url });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}