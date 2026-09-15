export interface StudentEntry {
  id: string;
  name: string; // strictly lowercase alphabets and spaces
  classNum: number; // 6, 7, 8, 9, 10
  section: string; // single uppercase character (e.g. 'A')
  lateCount: number;
  lastDate: string; // numerical date format (YYYY-MM-DD)
  datesHistory: string[];
}

export interface Suggestion {
  id: string;
  studentName: string;
  classSection?: string;
  category: 'Punctuality' | 'Campus Life' | 'Morning Assembly' | 'Ethics & Discipline' | 'General';
  message: string;
  createdAt: string;
  upvotes: number;
}

export type NavigationTab = 
  | 'dashboard' 
  | 'management' 
  | 'warning' 
  | 'suggestions' 
  | 'journey';

export interface EmailDispatchAlert {
  id: string;
  studentName: string;
  classNum: number;
  section: string;
  lateCount: number;
  timestamp: string;
  recipient: string;
  teacherEmail?: string;
  mailSubject?: string;
  mailBody?: string;
}
