import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, ChevronDown, ChevronUp, Clock, BookOpen, Lock } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import useLessonStore from '../store/lessonStore';



export default function LessonsPage() {
  const [openLesson, setOpenLesson] = React.useState(null);
  const { completedIds, markComplete, getCurriculum } = useLessonStore();
  const location = useLocation();
  const CURRICULUM = getCurriculum();

  // Build a flat ordered list of all lesson IDs for sequential unlock
  const allLessonIds = React.useMemo(
    () => CURRICULUM.flatMap(w => w.lessons.map(l => l.id)),
    [CURRICULUM]
  );

  React.useEffect(() => {
    // If navigated from dashboard with a specific lesson ID
    if (location.state?.openLessonId) {
      setOpenLesson(location.state.openLessonId);
    }
  }, [location.state]);

  const totalLessons = CURRICULUM.flatMap(w => w.lessons).length;
  const doneCount = completedIds.length;
  const pct = Math.round((doneCount / totalLessons) * 100);

  const markDone = (id) => {
    markComplete(id);
    setOpenLesson(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
      
      {/* Progress Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: '#0C2B35', borderRadius: 24, padding: 32, color: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <BookOpen size={28} color="#EC5A42" />
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Your Psychology Curriculum</h1>
            <p style={{ margin: '4px 0 0', color: '#9CA3AF', fontSize: 15 }}>{doneCount} of {totalLessons} lessons completed</p>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', height: 10, borderRadius: 5 }}>
          <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
            style={{ height: '100%', background: '#EC5A42', borderRadius: 5 }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: '#9CA3AF' }}>{pct}% complete</div>
      </motion.div>

      {/* Weekly Sections */}
      {CURRICULUM.map((week, wi) => (
        <motion.div key={wi} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: wi * 0.1 }}
          style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E8DED8' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0C2B35', marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid #F7EBE3' }}>
            {week.week}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {week.lessons.map((lesson) => {
              const isDone = completedIds.includes(lesson.id);
              const isOpen = openLesson === lesson.id;
              // A lesson is locked if ANY lesson before it in the sequence is not completed
              const lessonIndex = allLessonIds.indexOf(lesson.id);
              const precedingIds = allLessonIds.slice(0, lessonIndex);
              const isLocked = precedingIds.some(pid => !completedIds.includes(pid));
              // How many preceding uncompleted lessons remain
              const remainingCount = precedingIds.filter(pid => !completedIds.includes(pid)).length;
              return (
                <div key={lesson.id}>
                  <div
                    onClick={() => !isLocked && setOpenLesson(isOpen ? null : lesson.id)}
                    title={isLocked ? `Complete ${remainingCount} more lesson${remainingCount !== 1 ? 's' : ''} to unlock this` : undefined}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                      borderRadius: 14, cursor: isLocked ? 'not-allowed' : 'pointer',
                      background: isDone ? '#F7EBE3' : isLocked ? '#FAFAFA' : '#FDFBF8',
                      border: `2px solid ${isDone ? '#EC5A42' : isLocked ? '#E8DED8' : '#E8DED8'}`,
                      opacity: isLocked ? 0.55 : 1, transition: 'all 150ms ease'
                    }}
                  >
                    {isDone
                      ? <CheckCircle size={22} color="#EC5A42" />
                      : isLocked
                      ? <Lock size={18} color="#9CA3AF" />
                      : <Circle size={22} color="#D1CABB" />
                    }
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#0C2B35', textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.7 : 1 }}>
                        {lesson.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Clock size={12} color="#718096" />
                        <span style={{ fontSize: 12, color: '#718096', fontWeight: 600 }}>{lesson.duration} read</span>
                      </div>
                    </div>
                    {!isLocked && (isOpen ? <ChevronUp size={18} color="#718096" /> : <ChevronDown size={18} color="#718096" />)}
                  </div>

                  <AnimatePresence>
                    {isOpen && lesson.content && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '20px 20px 24px', background: '#FDFBF8', borderRadius: '0 0 14px 14px', border: '2px solid #E8DED8', borderTop: 'none' }}>
                          <div style={{ fontSize: 15, lineHeight: 2, color: '#4A5568', whiteSpace: 'pre-line' }}>
                            {lesson.content.replace(/\*\*(.*?)\*\*/g, '$1')}
                          </div>
                          {!isDone && (
                            <button onClick={() => markDone(lesson.id)}
                              style={{ marginTop: 20, background: '#EC5A42', color: 'white', padding: '12px 28px', borderRadius: 999, border: 'none', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
                              ✓ Mark as Complete
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}

    </div>
  );
}
