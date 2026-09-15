import { StudentEntry, Suggestion } from '../types';

// STRICT RULE: No pre-added dummy/mock student data.
// Real records must ONLY be entered by the authorized Admin to avoid misguiding anyone.
export const INITIAL_STUDENTS: StudentEntry[] = [];

export const INITIAL_SUGGESTIONS: Suggestion[] = [
  {
    id: 'sug-1',
    studentName: 'Student Feedback',
    classSection: 'Campus 32',
    category: 'Punctuality',
    message: 'Can we have a slight grace period of 3 minutes on rainy or high-traffic mornings on Nazimabad road? The van transport gets delayed due to construction.',
    createdAt: '2026-09-10',
    upvotes: 18,
  },
  {
    id: 'sug-2',
    studentName: 'Morning Assembly Note',
    classSection: 'Campus 32',
    category: 'Morning Assembly',
    message: 'We loved the Hadith recitation on Taqwa in the morning assembly this Thursday. It would be wonderful to have weekly student-led reflections on the Seerat un Nabi ﷺ.',
    createdAt: '2026-09-08',
    upvotes: 24,
  },
  {
    id: 'sug-3',
    studentName: 'General Suggestion',
    classSection: 'Campus 32',
    category: 'Campus Life',
    message: 'Organizing a peer-mentor buddy system where senior students encourage junior classes to arrive 10 minutes before the bell would help reduce late entries effectively.',
    createdAt: '2026-09-05',
    upvotes: 15,
  },
];
