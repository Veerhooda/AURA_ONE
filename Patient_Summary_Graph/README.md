# Patient Summary & Recovery Graph 📊

An automated AI-powered workflow that generates medical summaries and visual recovery trends from raw patient data.

## 🧰 Tech Stack

- **Orchestration**: [n8n](https://n8n.io/) (v2.0) - Workflow automation.
- **AI Model**: **Groq** running `llama-3.3-70b-versatile` for ultra-fast text analysis.
- **Backend Logic**: **JavaScript** (within n8n) for data data parsing, validation, and transformation.
- **Visualization**: [QuickChart API](https://quickchart.io/) for generating static line graphs.
- **API**: Webhook-based architecture (accepts JSON, returns JSON).

## 🌊 Workflow Overview

1.  **Webhook Trigger**: Receives raw patient JSON (history, symptoms, vitals).
2.  **AI Analysis (Groq)**: The LLM analyzes the history to generate:
    - A professional 3-sentence **Medical Summary**.
    - A generic **Recovery Score Array** (Integers 0-100) based on severity.
3.  **Data Cleaning**: JavaScript nodes strip markdown and ensure valid JSON format.
4.  **Graph Generation**:
    - The Recovery Score array is sent to **QuickChart**.
    - QuickChart returns a binary PNG image.
    - The binary is converted to a **Base64 String**.
5.  **Response**: The system returns a combined JSON object with the summary and the embedded graph image.

## 🚀 Usage

### 1. Import Workflow

Import `Patient Summary + Recovery Graph.json` into your local or cloud n8n instance.

### 2. Configure Credentials

- **Groq API**: Add your Groq API Key to the _Groq Chat Model_ node.
- **Webhook**: Ensure the standard Webhook node is active/listening.

### 3. Test (Frontend)

Open `index.html` in your browser.

1. Copy your n8n Webhook URL (e.g., `http://localhost:5678/webhook/generate-summary`).
2. Paste it into the "Webhook URL" field.
3. Click **Send POST Request**.
4. The API will return the summary text and render the Base64 recovery graph.

### 📥 Example Input Payload

```json
{
  "patient_name": "Sarah Jenkins",
  "patient_id": "P001",
  "current_symptoms": "fever, cough",
  "patient_history": [
    { "visit_date": "2025-01-01", "severity_score": 8 },
    { "visit_date": "2025-01-05", "severity_score": 6 }
  ]
}
```

## 🔍 Code Review & Analysis

**Strengths:**

- **Speed**: using Groq for inference ensures sub-second responses for complex medical summaries.
- **Portability**: Logic is self-contained in n8n; the QuickChart integration removes the need for local plotting libraries.
- **Robustness**: Includes `try/catch` blocks in JavaScript nodes to handle LLM hallucinations (e.g., standardizing JSON output).

**Potential Improvements (Action Items):**

1.  **Response Mapping Mismatch**:
    - _Observation_: The final `Respond to Webhook` node maps `"recovery_graph_url"` to `$json.recovery_data`. However, the `index.html` client expects the Base64 string in a field named `image_data`.
    - _Fix_: Update the final node's JSON response body to map `"image_data": "{{ $json.image_data }}"` (merging the output from the image processing node).
2.  **Error Handling**: If QuickChart fails, the workflow should fallback to a text-only response rather than potentially breaking at the Merge node.
