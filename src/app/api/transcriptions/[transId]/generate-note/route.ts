import { NextRequest, NextResponse } from "next/server";
import { firestore } from "../../../../../../firebase/server";
import { generateObject } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const serviceAccountVar = {
  type: process.env.FIREBASE_TYPE!,
  project_id: process.env.FIREBASE_PROJECT_ID!,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID!,
  private_key: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL!,
  client_id: process.env.FIREBASE_CLIENT_ID!,
  auth_uri: process.env.FIREBASE_AUTH_URI!,
  token_uri: process.env.FIREBASE_TOKEN_URI!,
  auth_provider_x509_cert_url:
    process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL!,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL!,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN!,
};

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY!;
const google = createGoogleGenerativeAI({
  apiKey,
});

export async function POST(
  req: NextRequest,
  { params }: { params: { transId: string } }
) {
  try {
    if (!firestore) {
      return NextResponse.json(
        { message: "Firestore is not initialized" },
        { status: 500 }
      );
    }

    const { transId } = params;
    const docRef = firestore.collection("transcriptions").doc(transId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    const data = doc.data();
    const fileUrl = data?.fileURL;
    const fileName = data?.fileName;

    if (!fileUrl) {
      return NextResponse.json(
        { message: "File URL not found in the document" },
        { status: 404 }
      );
    }

    const noteText = `### Interpretation of Arterial Blood Gases (ABGs)

Arterial Blood Gases (ABGs) provide critical information about a patient's oxygenation, ventilation, and acid-base balance. Understanding how to interpret ABGs is essential for medical students and healthcare providers to diagnose and manage respiratory, metabolic, and mixed acid-base disorders. This guide will cover the key components of ABG interpretation.

#### Components of an ABG
An ABG report typically includes the following parameters:
1. **pH**: Indicates the acidity or alkalinity of the blood.
2. **PaCO₂**: Partial pressure of carbon dioxide, reflecting respiratory function.
3. **PaO₂**: Partial pressure of oxygen, indicating oxygenation.
4. **HCO₃⁻**: Bicarbonate level, reflecting metabolic function.
5. **SaO₂**: Oxygen saturation, showing the percentage of hemoglobin saturated with oxygen.
6. **Base Excess/Base Deficit**: Indicates the amount of excess or insufficient bicarbonate in the system.

#### Step-by-Step Interpretation

1. **Assess the pH**: 
   - Normal range: 7.35-7.45
   - < 7.35: Acidemia
   - > 7.45: Alkalemia

2. **Determine the Primary Disorder**:
   - **Respiratory Acidosis/Alkalosis**: Look at PaCO₂.
     - Normal range: 35-45 mmHg
     - > 45 mmHg: Respiratory Acidosis
     - < 35 mmHg: Respiratory Alkalosis
   - **Metabolic Acidosis/Alkalosis**: Look at HCO₃⁻.
     - Normal range: 22-26 mEq/L
     - < 22 mEq/L: Metabolic Acidosis
     - > 26 mEq/L: Metabolic Alkalosis

3. **Evaluate Compensation**:
   - The body attempts to compensate for primary acid-base disturbances by adjusting the other component (respiratory or metabolic).
   - **Respiratory Compensation**: For metabolic disorders, the lungs adjust PaCO₂.
   - **Metabolic Compensation**: For respiratory disorders, the kidneys adjust HCO₃⁻.
   - Use compensation formulas to determine if the response is appropriate:
     - **Metabolic Acidosis**: Expected PaCO₂ = (1.5 × HCO₃⁻) + 8 ± 2
     - **Metabolic Alkalosis**: Expected PaCO₂ = 0.7 × (HCO₃⁻ - 24) + 40
     - **Acute Respiratory Acidosis**: Expected HCO₃⁻ increase = 1 mEq/L per 10 mmHg PaCO₂ above 40
     - **Chronic Respiratory Acidosis**: Expected HCO₃⁻ increase = 3.5 mEq/L per 10 mmHg PaCO₂ above 40
     - **Acute Respiratory Alkalosis**: Expected HCO₃⁻ decrease = 2 mEq/L per 10 mmHg PaCO₂ below 40
     - **Chronic Respiratory Alkalosis**: Expected HCO₃⁻ decrease = 4 mEq/L per 10 mmHg PaCO₂ below 40

4. **Calculate the Anion Gap (AG)**:
   - Useful in metabolic acidosis to identify the cause.
   - **Formula**: AG = Na⁺ - (Cl⁻ + HCO₃⁻)
   - Normal AG: 8-12 mEq/L
   - **High AG Metabolic Acidosis**: Common causes include ketoacidosis, lactic acidosis, renal failure, and toxic ingestions (MUDPILES).
   - **Normal AG Metabolic Acidosis**: Common causes include diarrhea, renal tubular acidosis, and hyperchloremia.

5. **Assess Oxygenation (PaO₂ and SaO₂)**:
   - PaO₂ normal range: 75-100 mmHg
   - SaO₂ normal range: 95-100%
   - Low PaO₂ or SaO₂ may indicate hypoxemia due to various causes, including ventilation-perfusion mismatch, diffusion impairment, or shunt.

#### Practical Example
**ABG Report**:
- pH: 7.32
- PaCO₂: 50 mmHg
- HCO₃⁻: 26 mEq/L
- PaO₂: 80 mmHg
- SaO₂: 95%

**Interpretation**:
1. **Assess the pH**: 7.32 (Acidemia)
2. **Primary Disorder**: PaCO₂ is 50 mmHg (Respiratory Acidosis)
3. **Compensation**: HCO₃⁻ is 26 mEq/L (slightly elevated, but not fully compensating)
4. **Oxygenation**: PaO₂ is 80 mmHg and SaO₂ is 95% (normal oxygenation)

**Conclusion**: The ABG indicates acute respiratory acidosis with adequate oxygenation.

#### Conclusion
Interpreting ABGs involves a systematic approach to analyze the pH, PaCO₂, HCO₃⁻, and oxygenation status. Understanding compensation mechanisms and calculating the anion gap can further help in diagnosing the underlying conditions. Regular practice and familiarity with normal values and compensation formulas are crucial for accurate interpretation and effective clinical decision-making.`;

    const schema = z.object({
      podcastScript: z.array(
        z.object({
          host: z.enum(["Eslam", "Aya"]),
          text: z.string(),
        })
      ),
    });

    const prompt = `
   You are a podcast script generator to help medical students learn better. Create a professional podcast conversation script with 2 hosts, Eslam and Aya, discussing the topic provided. The dialogue should be interactive, with both hosts taking turns to speak. Eslam should start with an introduction, followed by a back-and-forth conversation where both hosts share information, ask each other questions, and ensure no important points are missed. Use medical terminology appropriately and make the conversation engaging and informative for medical students.
 
    
    Note: ${noteText}
    `;

    const { object: podcastScript } = await generateObject({
      model: google("models/gemini-1.5-pro-latest"),
      schema: schema,
      prompt: prompt,
    });

    const res = podcastScript.podcastScript;

    return NextResponse.json({ res }, { status: 200 });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error },
      { status: 500 }
    );
  }
}
