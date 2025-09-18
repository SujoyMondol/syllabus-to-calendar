/* eslint-disable */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import CloudConvert from "cloudconvert";

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { fileBuffer, originalName } = req.body;
    if (!fileBuffer) {
      return res.status(400).json({ error: "No file provided" });
    }

    // ✅ Always provide a safe filename with extension
    let filename = "upload.pdf";
    if (originalName && typeof originalName === "string" && originalName.includes(".")) {
      filename = originalName;
    }

    // Create a job
    const job = await cloudConvert.jobs.create({
      tasks: {
        "import-file": { operation: "import/upload" },
        "convert-file": {
          operation: "convert",
          input: "import-file",
          input_format: "pdf",
          output_format: "docx",
        },
        "export-file": {
          operation: "export/url",
          input: "convert-file",
        },
      },
    });

    // Find the import task
    const importTask = job.tasks.find((t: any) => t.name === "import-file");
    if (!importTask) {
      return res.status(500).json({ error: "Import task not found" });
    }

    // Upload file buffer with proper filename
    await cloudConvert.tasks.upload(importTask, Buffer.from(fileBuffer, "base64"), filename);

    // Wait for job completion
    const finishedJob = await cloudConvert.jobs.wait(job.id);

    // Find the export task
    const exportTask = finishedJob.tasks.find((t: any) => t.operation === "export/url");
    if (
      !exportTask ||
      !exportTask.result ||
      !exportTask.result.files ||
      exportTask.result.files.length === 0
    ) {
      return res.status(500).json({ error: "Export task failed" });
    }

    const fileUrl = exportTask.result.files[0].url;
    res.status(200).json({ url: fileUrl });
  } catch (err: any) {
    console.error("CloudConvert error:", err);
    res.status(500).json({ error: err.message || "CloudConvert failed" });
  }
}
