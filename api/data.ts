import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory / serverless storage for suggestions & students on Vercel
let savedSuggestions = [
  {
    id: "sug-1",
    studentName: "Fatima Zahra",
    classSection: "Class 9-A",
    category: "Punctuality",
    message: "Can we have a slight grace period of 3 minutes on rainy or high-traffic mornings on Nazimabad road? The van transport gets delayed due to construction.",
    createdAt: "2026-09-10",
    upvotes: 18
  },
  {
    id: "sug-2",
    studentName: "Noor Ul Huda",
    classSection: "Class 10-B",
    category: "Morning Assembly",
    message: "We loved the Hadith recitation on Taqwa in the morning assembly this Thursday. It would be wonderful to have weekly student-led reflections on the Seerat un Nabi ﷺ.",
    createdAt: "2026-09-08",
    upvotes: 24
  },
  {
    id: "sug-3",
    studentName: "Rumaisa Siddiqui",
    classSection: "Class 8-C",
    category: "Campus Life",
    message: "Organizing a peer-mentor buddy system where senior students encourage junior classes to arrive 10 minutes before the bell would help reduce late entries effectively.",
    createdAt: "2026-09-05",
    upvotes: 15
  }
];

let savedStudents = [
  {
    id: "stu-1",
    name: "Ayesha Khan",
    grNumber: "GR-8921",
    classSection: "Class 9-B",
    lateCount: 2,
    lateDates: ["2026-09-02", "2026-09-09"],
    warningLevel: "Yellow",
    notes: "Van delay reported",
    parentPhone: "0300-1234567"
  },
  {
    id: "stu-2",
    name: "Zainab Ahmed",
    grNumber: "GR-7412",
    classSection: "Class 10-A",
    lateCount: 4,
    lateDates: ["2026-09-01", "2026-09-04", "2026-09-08", "2026-09-11"],
    warningLevel: "Red",
    notes: "Parent interview requested",
    parentPhone: "0321-9876543"
  },
  {
    id: "stu-3",
    name: "Maryam Bilal",
    grNumber: "GR-9055",
    classSection: "Class 8-A",
    lateCount: 1,
    lateDates: ["2026-09-11"],
    warningLevel: "Normal",
    notes: "First arrival after 7:50 AM",
    parentPhone: "0333-5551234"
  }
];

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

    return res.status(200).json({ status: 'ok', suggestions: savedSuggestions, students: savedStudents });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
