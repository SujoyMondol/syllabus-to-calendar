import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export default function updateCalendarData(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const filePath = path.join(process.cwd(), "src/pages/calendar-data.json");
      fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error writing calendar-data.json:", error);
      return res.status(500).json({ success: false, error: "Failed to update" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
