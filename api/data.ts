import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory / serverless storage for suggestions & students on Vercel
let savedSuggestions = [
  {
    id: "sug-1",
    studentName: "Student Feedback",
    classSection: "Campus 32",
    category: "Punctuality",
    message: "Can we have a slight grace period of 3 minutes on rainy or high-traffic mornings on Nazimabad road? The van transport gets delayed due to construction.",
    createdAt: "2026-09-10",
    upvotes: 18
  },
  {
    id: "sug-2",
    studentName: "Morning Assembly Note",
    classSection: "Campus 32",
    category: "Morning Assembly",
    message: "We loved the Hadith recitation on Taqwa in the morning assembly this Thursday. It would be wonderful to have weekly student-led reflections on the Seerat un Nabi ﷺ.",
    createdAt: "2026-09-08",
    upvotes: 24
  },
  {
    id: "sug-3",
    studentName: "General Suggestion",
    classSection: "Campus 32",
    category: "Campus Life",
    message: "Organizing a peer-mentor buddy system where senior students encourage junior classes to arrive 10 minutes before the bell would help reduce late entries effectively.",
    createdAt: "2026-09-05",
    upvotes: 15
  }
];

// STRICT RULE: Strictly NO pre-added girls / students.
// Prevents misguiding users or showing fake late marks against real names.
let savedStudents: any[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query.action || (req.body && req.body.action);

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'success',
      suggestions: savedSuggestions,
      students: savedStudents,
    });
  }

  if (req.method === 'POST') {
    const payload = req.body;

    if (action === 'save_suggestions' && Array.isArray(payload.suggestions)) {
      savedSuggestions = payload.suggestions;
      return res.status(200).json({ status: 'success', count: savedSuggestions.length });
    }

    if (action === 'save_students' && Array.isArray(payload.students)) {
      savedStudents = payload.students;
      return res.status(200).json({ status: 'success', count: savedStudents.length });
    }

    return res.status(400).json({ status: 'error', message: 'Unknown action' });
  }

  return res.status(405).json({ status: 'error', message: 'Method not allowed' });
}
