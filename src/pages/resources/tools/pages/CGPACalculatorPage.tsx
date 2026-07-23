import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { SEO } from '../../../../components/seo';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calculator, ArrowLeft, GraduationCap, TrendingUp, Award, RefreshCw, Info } from 'lucide-react';

const GRADES: Record<string, number> = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0,
};

const GRADE_COLORS: Record<string, string> = {
  'O': 'text-emerald-400', 'A+': 'text-green-400', 'A': 'text-blue-400',
  'B+': 'text-primary', 'B': 'text-amber-400', 'C': 'text-orange-400',
  'P': 'text-red-400', 'F': 'text-red-600',
};

interface Course { id: number; name: string; credits: number; grade: string; }
interface Semester { id: number; name: string; courses: Course[]; }

let nextCourseId = 100;
let nextSemId = 10;

function defaultCourses(): Course[] {
  return [
    { id: nextCourseId++, name: '', credits: 3, grade: 'A+' },
    { id: nextCourseId++, name: '', credits: 3, grade: 'A' },
  ];
}

function calcGPA(courses: Course[]): number {
  let tp = 0, tc = 0;
  courses.forEach(c => { const p = GRADES[c.grade] ?? 0; tp += p * c.credits; tc += c.credits; });
  return tc ? tp / tc : 0;
}

function GPABadge({ gpa }: { gpa: number }) {
  const label = gpa >= 9 ? 'Outstanding' : gpa >= 8 ? 'Excellent' : gpa >= 7 ? 'Good' : gpa >= 6 ? 'Average' : gpa >= 5 ? 'Pass' : 'Fail';
  const color = gpa >= 9 ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
    : gpa >= 8 ? 'text-green-400 border-green-400/30 bg-green-400/10'
    : gpa >= 7 ? 'text-primary border-primary/30 bg-primary/10'
    : gpa >= 6 ? 'text-amber-400 border-amber-400/30 bg-amber-400/10'
    : 'text-red-400 border-red-400/30 bg-red-400/10';
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${color}`}>{label}</span>
  );
}

export default function CGPACalculatorPage() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: nextSemId++, name: 'Semester 1', courses: defaultCourses() },
  ]);

  const semesterGPAs = useMemo(() => semesters.map(s => calcGPA(s.courses)), [semesters]);

  const cgpa = useMemo(() => {
    let tp = 0, tc = 0;
    semesters.forEach(s => {
      s.courses.forEach(c => { const p = GRADES[c.grade] ?? 0; tp += p * c.credits; tc += c.credits; });
    });
    return tc ? tp / tc : 0;
  }, [semesters]);

  const totalCredits = useMemo(() =>
    semesters.reduce((acc, s) => acc + s.courses.reduce((a, c) => a + c.credits, 0), 0),
    [semesters]
  );

  function addSemester() {
    setSemesters(prev => [...prev, { id: nextSemId++, name: `Semester ${prev.length + 1}`, courses: defaultCourses() }]);
  }

  function removeSemester(id: number) {
    setSemesters(prev => prev.filter(s => s.id !== id));
  }

  function updateSemesterName(id: number, name: string) {
    setSemesters(prev => prev.map(s => s.id === id ? { ...s, name } : s));
  }

  function addCourse(semId: number) {
    setSemesters(prev => prev.map(s =>
      s.id === semId ? { ...s, courses: [...s.courses, { id: nextCourseId++, name: '', credits: 3, grade: 'A' }] } : s
    ));
  }

  function removeCourse(semId: number, courseId: number) {
    setSemesters(prev => prev.map(s =>
      s.id === semId ? { ...s, courses: s.courses.filter(c => c.id !== courseId) } : s
    ));
  }

  function updateCourse(semId: number, courseId: number, field: keyof Course, value: string | number) {
    setSemesters(prev => prev.map(s =>
      s.id === semId ? { ...s, courses: s.courses.map(c => c.id === courseId ? { ...c, [field]: value } : c) } : s
    ));
  }

  function resetAll() {
    nextSemId = 10; nextCourseId = 100;
    setSemesters([{ id: nextSemId++, name: 'Semester 1', courses: defaultCourses() }]);
  }

  return (
    <>
      <SEO title="Advanced CGPA Calculator | Tech Toolkit" description="Calculate your semester GPA, cumulative CGPA, and track academic progress with multi-semester support." url="/resources/cgpa-calculator" />

      {/* Header */}
      <div className="border-b border-white/5 bg-muted/10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <Link href="/resources">
            <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <ArrowLeft size={15} /> Tech Toolkit
            </div>
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium">Advanced CGPA Calculator</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10 max-w-4xl">
        {/* Page title */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">🎓</div>
            <div>
              <h1 className="text-2xl font-display font-bold">Advanced CGPA Calculator</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Multi-semester · Cumulative GPA · Academic progress tracker</p>
            </div>
          </div>
          <button
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
          >
            <RefreshCw size={13} /> Reset
          </button>
        </div>

        {/* CGPA summary card */}
        <motion.div
          layout
          className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20"
        >
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><Calculator size={13} /> Cumulative CGPA</div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-display font-bold text-primary">{cgpa.toFixed(2)}</span>
                <span className="text-muted-foreground text-sm mb-1">/ 10</span>
              </div>
              <div className="mt-2"><GPABadge gpa={cgpa} /></div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><GraduationCap size={13} /> Semesters</div>
              <div className="text-3xl font-display font-bold">{semesters.length}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><TrendingUp size={13} /> Total Credits</div>
              <div className="text-3xl font-display font-bold">{totalCredits}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>0</span><span>5</span><span>10</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-violet-400"
                initial={{ width: 0 }}
                animate={{ width: `${(cgpa / 10) * 100}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Semester list */}
        <div className="space-y-6">
          <AnimatePresence>
            {semesters.map((sem, si) => {
              const semGPA = semesterGPAs[si];
              return (
                <motion.div
                  key={sem.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl bg-card border border-white/10 overflow-hidden"
                >
                  {/* Semester header */}
                  <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/2">
                    <input
                      value={sem.name}
                      onChange={e => updateSemesterName(sem.id, e.target.value)}
                      className="bg-transparent font-display font-bold text-sm focus:outline-none focus:ring-0 w-40"
                      aria-label="Semester name"
                    />
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Sem GPA</div>
                        <div className="text-lg font-bold text-primary">{semGPA.toFixed(2)}</div>
                      </div>
                      {semesters.length > 1 && (
                        <button onClick={() => removeSemester(sem.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors" aria-label="Remove semester">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Courses */}
                  <div className="p-4 space-y-2">
                    {/* Column headers */}
                    <div className="grid grid-cols-[1fr_80px_80px_32px] gap-2 text-[10px] text-muted-foreground uppercase tracking-wide px-1 mb-1">
                      <span>Course</span><span className="text-center">Credits</span><span className="text-center">Grade</span><span />
                    </div>
                    {sem.courses.map(c => (
                      <div key={c.id} className="grid grid-cols-[1fr_80px_80px_32px] gap-2 items-center p-2.5 rounded-xl bg-white/4 border border-white/8 hover:border-white/15 transition-colors">
                        <input
                          value={c.name}
                          onChange={e => updateCourse(sem.id, c.id, 'name', e.target.value)}
                          placeholder="Course name"
                          className="bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/40 truncate"
                        />
                        <input
                          type="number"
                          value={c.credits}
                          onChange={e => updateCourse(sem.id, c.id, 'credits', Math.max(1, Math.min(6, +e.target.value || 1)))}
                          min={1} max={6}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-center text-foreground focus:outline-none focus:border-primary/50"
                        />
                        <select
                          value={c.grade}
                          onChange={e => updateCourse(sem.id, c.id, 'grade', e.target.value)}
                          className={`w-full bg-white/5 border border-white/10 rounded-lg px-1 py-1 text-sm text-center cursor-pointer focus:outline-none focus:border-primary/50 ${GRADE_COLORS[c.grade] || ''}`}
                        >
                          {Object.keys(GRADES).map(g => <option key={g} value={g} className="bg-background text-foreground">{g} ({GRADES[g]})</option>)}
                        </select>
                        <button onClick={() => sem.courses.length > 1 && removeCourse(sem.id, c.id)} className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors" aria-label="Remove course">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addCourse(sem.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-white/15 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/4 transition-all"
                    >
                      <Plus size={13} /> Add Course
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <button
            onClick={addSemester}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-primary/30 text-sm font-semibold text-primary hover:bg-primary/8 hover:border-primary/50 transition-all"
          >
            <Plus size={15} /> Add Semester
          </button>
        </div>

        {/* Grade scale info */}
        <div className="mt-10 p-5 rounded-2xl bg-white/3 border border-white/8">
          <div className="flex items-center gap-2 text-sm font-semibold mb-3"><Info size={14} className="text-muted-foreground" /> Grade Scale (10-point system)</div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {Object.entries(GRADES).map(([g, p]) => (
              <div key={g} className="flex flex-col items-center py-2 px-1 rounded-xl bg-white/5 border border-white/8">
                <span className={`text-sm font-bold ${GRADE_COLORS[g] || ''}`}>{g}</span>
                <span className="text-xs text-muted-foreground">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
