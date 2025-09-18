// pages/api/process-syllabus.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `
    Extract the course code and course name along with all important dates, deadlines, and events from the following syllabus text and return them as a structured JSON array.
    Also make a list of all types of events found in the syllabus. 
    courseCode: The course code (e.g., CS101)
    courseName: The full name of the course (e.g., Introduction to Computer Science)
    For each event, include:
    - title: A short descriptive title
    - date: The date in YYYY-MM-DD format
    - time: The time if specified (or null if not)
    - description: A longer description of the event
    - type: The type of event (exam, assignment, class, holiday, etc.)

    Syllabus text:
    ${text}

    Return only valid JSON in this format:
    {
      "courseCode": "CS101",
      "courseName": "Introduction to Computer Science",
      "eventTypes": ["exam", "assignment", "class", "holiday",..],  
      "events": [
        {
          "title": "Final Exam",
          "date": "2023-12-15",
          "time": "14:00",
          "description": "Comprehensive final exam covering all course material",
          "type": "exam"
        }
      ]
    }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      max_tokens: 2000,
    });

    const responseText = completion.choices[0].message.content;
    
    // Log the response to console
    console.log('OpenAI API Response:', responseText);
    
    try {
      const events = JSON.parse(responseText || '{}');
      res.status(200).json(events);
      const filePath = path.join(process.cwd(), "src/pages/calendar-data.json");

      fs.writeFileSync(filePath, JSON.stringify(events, null, 2), "utf-8");

    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      res.status(500).json({ error: 'Failed to parse response from AI' });
    }
  } catch (error) {
    console.error('Error processing syllabus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}