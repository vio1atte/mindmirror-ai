import { useMemo, useState } from 'react';
import {
 Activity, ArrowRight, Atom, Award, Bookmark, BookOpen,
 Brain, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp,
 Clock3, Compass, FlaskConical, GraduationCap, Heart, History, Lightbulb,
 ListChecks, Menu, MessageCircle, Moon, NotebookPen, Play, Plus, Search,
 Send, Settings2, Sparkles, Star, Sun, Target, TrendingUp, Trophy, X, Zap, Timer, ClipboardCheck, Download, PlayCircle, PauseCircle, BrainCircuit, Gauge, RotateCcw
} from 'lucide-react';
import './App.css';




type Lesson = {
 id: string; title: string; level: string; minutes: number; hook: string;
 explain: string; example: string; question: string; answer: string;
 misconception: string; followUp: string; flashcards: { front: string; back: string }[];
};
type Subject = { id: string; name: string; group: string; emoji: string; color: string; description: string; lessons: Lesson[] };
type ChatMessage = { role: 'you' | 'coach'; text: string };




const subjects: Subject[] = [
 { id: 'biology', name: 'Biology', group: 'SCIENCE LAB', emoji: '🧬', color: 'mint', description: 'Life, cells, and systems', lessons: [
   { id: 'osmosis', title: 'Osmosis & water movement', level: 'AP Biology', minutes: 7, hook: 'Imagine a raisin soaking in water. It swells because water moves across its skin toward the area with more dissolved particles.', explain: 'Osmosis is the net movement of water across a selectively permeable membrane from an area with lower solute concentration to an area with higher solute concentration. Water moves down its own water-potential gradient until equilibrium is reached.', example: 'A plant cell in fresh water takes in water. Its central vacuole expands and the cell becomes turgid; the cell wall helps stop it from bursting.', question: 'A cell is placed in a solution with a higher solute concentration than its cytoplasm. Predict what happens to the cell and explain why.', answer: 'Water leaves the cell by osmosis because the surrounding solution is hypertonic relative to the cytoplasm. The cell loses water and may shrink.', misconception: 'Common mix-up: solute does not have to move for osmosis to happen. Water crosses the membrane; the solute concentration difference helps determine the net direction.', followUp: 'What would happen if the outside solution had a lower solute concentration than the cytoplasm?', flashcards: [{front:'Osmosis',back:'Net movement of water across a selectively permeable membrane down its water-potential gradient.'},{front:'Hypertonic solution',back:'A solution with a higher solute concentration than the comparison cell; water tends to leave the cell.'},{front:'Turgid plant cell',back:'A firm plant cell filled with water; the cell wall resists further expansion.'}] },
   { id: 'enzymes', title: 'Enzymes & activation energy', level: 'AP Biology', minutes: 6, hook: 'A bike mechanic does not change the destination, but makes the journey easier. Enzymes help reactions happen faster without being used up.', explain: 'Enzymes are biological catalysts. They lower the activation energy needed to reach a reaction’s transition state, increasing reaction rate without changing the overall energy difference or equilibrium of the reaction.', example: 'Amylase helps break starch into smaller sugars. Temperature and pH can affect the shape of its active site and therefore its activity.', question: 'Why can a very high temperature cause an enzyme to stop working effectively?', answer: 'High temperature can disrupt bonds that maintain the enzyme’s shape. The active site changes, so the substrate no longer fits as well.', misconception: 'Enzymes do not provide energy to a reaction or get permanently consumed. They change the pathway and lower activation energy.', followUp: 'Why might an enzyme work slowly in a very cold environment without being permanently damaged?', flashcards: [{front:'Activation energy',back:'The energy barrier reactants must overcome for a reaction to proceed.'},{front:'Active site',back:'The region of an enzyme where the substrate binds and the reaction is facilitated.'},{front:'Denaturation',back:'A change in a protein’s structure that can disrupt its function.'}] },
   { id: 'photosynthesis', title: 'Photosynthesis: energy in', level: 'Biology', minutes: 8, hook: 'A plant is like a solar-powered workshop: it captures light energy and stores some of it in chemical bonds.', explain: 'Photosynthesis uses light energy to convert carbon dioxide and water into sugars, releasing oxygen. The light reactions capture energy in ATP and NADPH; the Calvin cycle uses that energy to build carbohydrate from carbon dioxide.', example: 'A plant near a sunny window may photosynthesize faster than one in deep shade, if light is the limiting factor and other conditions are suitable.', question: 'Where do the carbon atoms in the sugar made during photosynthesis originally come from?', answer: 'The carbon atoms come from carbon dioxide taken in by the plant, which is incorporated into organic molecules during the Calvin cycle.', misconception: 'Most of the dry mass a plant gains as it grows comes from carbon dioxide, not from soil being turned into plant matter.', followUp: 'What could happen to the rate of photosynthesis if light increases but carbon dioxide becomes limiting?', flashcards: [{front:'Chloroplast',back:'Organelle where photosynthesis occurs in plants and algae.'},{front:'Light reactions',back:'Reactions that capture light energy and produce ATP, NADPH, and oxygen.'},{front:'Carbon source for sugar',back:'Carbon dioxide (CO₂) from the environment.'}] }
 ]},
 { id: 'chemistry', name: 'Chemistry', group: 'SCIENCE LAB', emoji: '⚗️', color: 'lilac', description: 'Matter, reactions, and bonds', lessons: [
   { id: 'bonds', title: 'Ionic vs. covalent bonds', level: 'Chemistry', minutes: 6, hook: 'Think of atoms as trying to reach more stable electron arrangements. They can transfer electrons or share them.', explain: 'Ionic bonding involves electrostatic attraction between oppositely charged ions, often after electron transfer. Covalent bonding involves atoms sharing pairs of electrons.', example: 'Sodium chloride forms from sodium ions and chloride ions. In a water molecule, oxygen and hydrogen share electrons in covalent bonds.', question: 'Why does solid sodium chloride conduct electricity poorly, while molten sodium chloride conducts well?', answer: 'In the solid, ions are locked into a crystal lattice and cannot move freely. When molten, the ions can move and carry electric charge.', misconception: 'Ionic bonds are not simply “one atom gives an electron and then the atoms stick”; the attraction between charged ions holds the lattice together.', followUp: 'Why can a solution of some ionic compounds conduct electricity?', flashcards: [{front:'Ionic bond',back:'Electrostatic attraction between oppositely charged ions.'},{front:'Covalent bond',back:'A bond formed when atoms share electron pairs.'},{front:'Electrolyte',back:'A substance that forms mobile ions in solution or when molten and can conduct electricity.'}] },
   { id: 'ph', title: 'Acids, bases & pH', level: 'Chemistry', minutes: 5, hook: 'pH is like a logarithmic volume knob for hydrogen-ion concentration: one unit is a tenfold change.', explain: 'In common aqueous contexts, lower pH means higher hydrogen-ion concentration, while higher pH means lower hydrogen-ion concentration. A one-unit pH change represents a tenfold change in hydrogen-ion concentration.', example: 'A solution at pH 3 has about ten times the hydrogen-ion concentration of a solution at pH 4.', question: 'How does the hydrogen-ion concentration of a pH 2 solution compare with a pH 4 solution?', answer: 'The pH 2 solution has about 100 times the hydrogen-ion concentration of the pH 4 solution, because the difference is two pH units.', misconception: 'The pH scale is logarithmic, not linear. A change of two units is not merely twice the concentration.', followUp: 'How many times greater is the hydrogen-ion concentration at pH 1 than at pH 3?', flashcards: [{front:'Acidic solution',back:'A solution with greater hydrogen-ion activity than a neutral solution under the same conditions.'},{front:'One pH unit',back:'A tenfold change in hydrogen-ion concentration in the usual classroom approximation.'},{front:'Neutral pH',back:'Approximately pH 7 at 25°C for pure water.'}] }
 ]},
 { id: 'physics', name: 'Physics', group: 'SCIENCE LAB', emoji: '🪐', color: 'blue', description: 'Forces, energy, and motion', lessons: [
   { id: 'newton', title: 'Newton’s laws of motion', level: 'Physics', minutes: 7, hook: 'A full shopping cart is harder to speed up than an empty one. More mass means more inertia.', explain: 'Newton’s second law states that net force equals mass times acceleration (F = ma). Acceleration points in the direction of the net force and increases with force but decreases with mass.', example: 'The same push gives an empty cart more acceleration than a loaded cart, assuming the net force is the same.', question: 'If the same net force acts on an object with twice the mass, what happens to its acceleration?', answer: 'Its acceleration is halved, because acceleration equals net force divided by mass.', misconception: 'A moving object does not need a continuing net force to keep moving at constant velocity. Net force is needed to change velocity.', followUp: 'What net force is needed to keep an object moving at constant velocity in an ideal frictionless setting?', flashcards: [{front:'Net force',back:'The vector sum of all forces acting on an object.'},{front:'Inertia',back:'An object’s resistance to changes in its motion; related to mass.'},{front:'Newton’s second law',back:'Net force equals mass multiplied by acceleration: F = ma.'}] }
 ]},
 { id: 'math', name: 'Mathematics', group: 'QUANT STUDIO', emoji: '📐', color: 'peach', description: 'Patterns, functions, and proof', lessons: [
   { id: 'functions', title: 'Functions as input-output machines', level: 'Algebra', minutes: 5, hook: 'A function is like a vending machine: each valid input has exactly one output.', explain: 'A function assigns each input in its domain exactly one output. Different inputs may share the same output, but a single input cannot have two different outputs in the same function.', example: 'For f(x) = 2x + 3, input 4 gives output 11. Every time you enter x = 4, the function returns 11.', question: 'Could a relation that pairs x = 2 with y = 5 and y = 8 be a function? Explain.', answer: 'No. The input x = 2 has two different outputs, so the relation does not meet the definition of a function.', misconception: 'A function does not need to be a straight line, and different inputs are allowed to produce the same output.', followUp: 'Can two different inputs have the same output in a function? Give an example.', flashcards: [{front:'Domain',back:'The set of all allowed inputs.'},{front:'Range',back:'The set of outputs the function actually produces.'},{front:'Function',back:'A relation where every input has exactly one output.'}] }
 ]},
 { id: 'statistics', name: 'Statistics', group: 'QUANT STUDIO', emoji: '📊', color: 'yellow', description: 'Data, uncertainty, and evidence', lessons: [
   { id: 'sampling', title: 'Sampling & bias', level: 'AP Statistics', minutes: 7, hook: 'If you ask only the students in the library whether homework is too hard, you may miss the views of students who never go there.', explain: 'A sample should represent the population you want to learn about. Bias occurs when the method systematically favors certain outcomes or excludes parts of the population.', example: 'A voluntary online poll may overrepresent people with strong opinions because they are more likely to respond.', question: 'A school surveys only students in an advanced math class about the school’s overall workload. What is one concern?', answer: 'The sample may not represent the whole school because advanced math students may have different workloads and experiences than other students.', misconception: 'A large sample does not automatically remove bias. A huge biased sample can still produce a misleading result.', followUp: 'How could the school choose a more representative sample?', flashcards: [{front:'Population',back:'The full group you want to draw conclusions about.'},{front:'Sample',back:'The subset of a population that is actually observed.'},{front:'Bias',back:'A systematic problem in how data are collected that can distort conclusions.'}] }
 ]},
 { id: 'history', name: 'History', group: 'HUMANITIES', emoji: '🏛️', color: 'rose', description: 'Context, causes, and change', lessons: [
   { id: 'causation', title: 'Historical causation', level: 'History', minutes: 6, hook: 'Big events are rarely caused by one domino. They usually emerge from several pressures interacting over time.', explain: 'Historical causation asks how and why events happened. Strong analysis distinguishes long-term conditions, short-term triggers, and the choices people made, while supporting claims with evidence.', example: 'When explaining a revolution, consider economic pressures, political exclusion, new ideas, and a specific event that accelerated conflict.', question: 'Why is “one event caused the revolution” often an incomplete historical argument?', answer: 'It may ignore long-term conditions, multiple interacting causes, and the choices of different groups. A stronger explanation weighs causes and supports them with evidence.', misconception: 'Chronology alone does not prove causation. Two events occurring one after another does not automatically mean the first caused the second.', followUp: 'How could you decide which cause was most important without ignoring the others?', flashcards: [{front:'Long-term cause',back:'A condition that develops over time and helps make an event possible.'},{front:'Trigger',back:'A nearer-term event that accelerates or sparks a larger process.'},{front:'Historical evidence',back:'Sources or data used to support an interpretation of the past.'}] }
 ]},
 { id: 'english', name: 'English & Writing', group: 'HUMANITIES', emoji: '✍️', color: 'lilac', description: 'Interpretation, voice, and argument', lessons: [
   { id: 'claims', title: 'Building a strong claim', level: 'Writing', minutes: 5, hook: 'A claim is not just a topic. It is a position someone could reasonably ask you to prove.', explain: 'A strong analytical claim makes a specific, arguable interpretation and gives your paragraph direction. Evidence supports the claim; commentary explains how that evidence supports it.', example: 'Instead of “The character changes,” try “The character’s growing secrecy reveals how fear gradually overrides their loyalty.”', question: 'What is the difference between evidence and commentary in an analytical paragraph?', answer: 'Evidence is the detail or quotation from the text. Commentary explains what that evidence means and how it supports the claim.', misconception: 'Dropping a quotation into a paragraph is not the same as analyzing it. The writer must explain its significance.', followUp: 'What question could you ask after a quotation to push your analysis deeper?', flashcards: [{front:'Claim',back:'A specific, arguable point that the writing will support.'},{front:'Evidence',back:'Textual detail, quotation, or data that supports a claim.'},{front:'Commentary',back:'The reasoning that connects evidence to the claim.'}] }
 ]},
 { id: 'coding', name: 'Computer Science', group: 'QUANT STUDIO', emoji: '💻', color: 'blue', description: 'Logic, algorithms, and systems', lessons: [
   { id: 'algorithms', title: 'Algorithms & decomposition', level: 'Computer Science', minutes: 6, hook: 'Planning a road trip is easier when you split it into routes, stops, fuel, and timing. Programs benefit from the same approach.', explain: 'An algorithm is a finite sequence of clear steps for solving a problem. Decomposition breaks a large problem into smaller parts that can be designed, tested, and maintained independently.', example: 'A study planner could be split into tasks for adding assignments, sorting by due date, and marking tasks complete.', question: 'Why might decomposing a large programming problem make it easier to debug?', answer: 'Smaller parts have clearer responsibilities, so you can test each part independently and narrow down where a failure occurs.', misconception: 'Writing more code is not the same as making progress. A clear plan and small testable components often save time.', followUp: 'What would be a sensible first small component for a homework-planner app?', flashcards: [{front:'Algorithm',back:'A finite set of clear steps for solving a problem or completing a task.'},{front:'Decomposition',back:'Breaking a complex problem into smaller, manageable subproblems.'},{front:'Debugging',back:'Finding, understanding, and fixing problems in a program.'}] }
 ]},
 { id: 'environment', name: 'Earth & Environment', group: 'SCIENCE LAB', emoji: '🌎', color: 'mint', description: 'Climate, ecosystems, and our planet', lessons: [
   { id: 'energy', title: 'Earth’s energy balance', level: 'Environmental Science', minutes: 7, hook: 'Earth’s temperature depends partly on the balance between energy arriving from the Sun and energy escaping back to space.', explain: 'Earth absorbs incoming solar energy and emits energy as infrared radiation. Greenhouse gases absorb and re-emit some outgoing infrared radiation, affecting the temperature at which Earth’s energy balance is restored.', example: 'Increasing greenhouse gas concentrations creates an energy imbalance until the climate system warms enough to emit more energy to space.', question: 'How can increasing greenhouse gas concentrations lead to warming even though sunlight still comes from the same Sun?', answer: 'More outgoing infrared radiation is absorbed and re-emitted by greenhouse gases, reducing the rate energy escapes to space at first. The system warms until outgoing energy balances absorbed energy again.', misconception: 'The greenhouse effect is not the same as the ozone hole. They involve different atmospheric processes.', followUp: 'How could melting reflective ice influence the amount of solar energy Earth absorbs?', flashcards: [{front:'Energy balance',back:'The relationship between incoming energy absorbed by Earth and outgoing energy emitted to space.'},{front:'Greenhouse gas',back:'A gas that absorbs and emits infrared radiation, influencing Earth’s energy balance.'},{front:'Albedo',back:'The fraction of incoming sunlight a surface reflects.'}] }
 ]}
];




const starterGoals = ['Explain one concept in my own words', 'Review three flashcards', 'Ask a “why” question'];
const coachIntro = 'I’m your thinking partner. Ask for a simpler explanation, an analogy, a worked example, or a hint—then try explaining the idea back in your own words.';




export default function App() {
 const [subjectId, setSubjectId] = useState('biology');
 const [lessonIndex, setLessonIndex] = useState(0);
 const [page, setPage] = useState<'studio' | 'notebook' | 'flashcards' | 'achievements' | 'mission'>('studio');
 const [focusSeconds, setFocusSeconds] = useState(15 * 60);
 const [timerRunning, setTimerRunning] = useState(false);
 const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
 const [examSubmitted, setExamSubmitted] = useState(false);
 const [examSet, setExamSet] = useState(0);
 const [step, setStep] = useState<'learn' | 'check' | 'reflect'>('learn');


const [answer, setAnswer] = useState('');
 const [question, setQuestion] = useState('');
 const [messages, setMessages] = useState<ChatMessage[]>([]);
 const [hint, setHint] = useState(false);
 const [confidence, setConfidence] = useState(3);
 const [completed, setCompleted] = useState<string[]>([]);
 const [bookmarks, setBookmarks] = useState<string[]>([]);
 const [search, setSearch] = useState('');
 const [notes, setNotes] = useState<Record<string, string>>({});
 const [goals, setGoals] = useState<boolean[]>([false, false, false]);
 const [flashIndex, setFlashIndex] = useState(0);
 const [flipped, setFlipped] = useState(false);
 const [mobileMenu, setMobileMenu] = useState(false);
 const [dark, setDark] = useState(false);
 const [showSettings, setShowSettings] = useState(false);
 const [toast, setToast] = useState('');




 const subject = subjects.find(s => s.id === subjectId) ?? subjects[0];
 const lesson = subject.lessons[lessonIndex % subject.lessons.length];
 const lessonKey = `${subject.id}:${lesson.id}`;
 const progress = Math.round(completed.length / subjects.reduce((n, s) => n + s.lessons.length, 0) * 100);
 const allLessons = useMemo(() => subjects.flatMap(s => s.lessons.map(l => ({ ...l, subjectId: s.id, subjectName: s.name, subjectEmoji: s.emoji }))), []);
 const filteredSubjects = useMemo(() => subjects.filter(s => `${s.name} ${s.description} ${s.group}`.toLowerCase().includes(search.toLowerCase())), [search]);
 const currentFlashcards = lesson.flashcards;
 const bookmarkedLessons = allLessons.filter(l => bookmarks.includes(`${l.subjectId}:${l.id}`));




 useEffect(() => {
   try {
     const saved = localStorage.getItem('mindmirror-studio-v1');
     if (saved) {
       const data = JSON.parse(saved);
       setCompleted(Array.isArray(data.completed) ? data.completed : []);
       setBookmarks(Array.isArray(data.bookmarks) ? data.bookmarks : []);
       setNotes(data.notes && typeof data.notes === 'object' ? data.notes : {});
       setGoals(Array.isArray(data.goals) ? data.goals : [false, false, false]);
     }
   } catch { /* The app still works if browser storage is unavailable. */ }
 }, []);




 useEffect(() => {
   try { localStorage.setItem('mindmirror-studio-v1', JSON.stringify({ completed, bookmarks, notes, goals })); } catch { /* Ignore storage restrictions. */ }
 }, [completed, bookmarks, notes, goals]);




 useEffect(() => {
   if (!timerRunning) return;
   const id = window.setInterval(() => setFocusSeconds(seconds => {
     if (seconds <= 1) { window.clearInterval(id); setTimerRunning(false); notify('Focus sprint complete — take a tiny reset break! ✨'); return 0; }
     return seconds - 1;
   }), 1000);
   return () => window.clearInterval(id);
 }, [timerRunning]);




 function notify(text: string) {
   setToast(text);
   window.setTimeout(() => setToast(''), 2200);
 }
 function resetLesson() { setStep('learn'); setAnswer(''); setMessages([]); setHint(false); setQuestion(''); }
 function chooseSubject(id: string) { setSubjectId(id); setLessonIndex(0); setPage('studio'); resetLesson(); setMobileMenu(false); setSearch(''); }
 function chooseLesson(sid: string, lid: string) {
   const s = subjects.find(item => item.id === sid);
   if (!s) return;
   setSubjectId(sid); setLessonIndex(Math.max(0, s.lessons.findIndex(item => item.id === lid)));
   setPage('studio'); resetLesson(); setMobileMenu(false);
 }


function submitAnswer() {
   if (!answer.trim()) return;
   setStep('reflect');
   setMessages(prev => [...prev, { role: 'you', text: answer.trim() }, { role: 'coach', text: `Core idea: ${lesson.answer} ${lesson.misconception}` }]);
   setCompleted(prev => prev.includes(lessonKey) ? prev : [...prev, lessonKey]);
   notify('Concept added to your learning journey ✨');
 }
 function askCoach(override?: string) {
   const q = (override ?? question).trim();
   if (!q) return;
   const lower = q.toLowerCase();
   let reply = `${lesson.explain} Try connecting it to this example: ${lesson.example}`;
   if (lower.includes('simpl') || lower.includes('easy') || lower.includes('confus') || lower.includes('like i')) reply = `Let's make it simpler. ${lesson.hook} The key idea is: ${lesson.answer}`;
   else if (lower.includes('example') || lower.includes('analogy')) reply = `Here's a real-world connection: ${lesson.example} The concept underneath it is: ${lesson.explain}`;
   else if (lower.includes('why')) reply = `Great “why” question. ${lesson.explain} One common mix-up to avoid: ${lesson.misconception}`;
   else if (lower.includes('hint')) reply = `Hint—don't jump straight to the answer. ${lesson.followUp} Start by identifying the key relationship, then explain why it matters.`;
   else if (lower.includes('quiz') || lower.includes('question') || lower.includes('test me')) reply = `Quick challenge: ${lesson.question} After you answer, compare your reasoning with the explanation in the lesson.`;
   else if (lower.includes('remember') || lower.includes('memor')) reply = `Memory hook: ${lesson.hook} Now say the core idea in one sentence: ${lesson.answer}`;
   setMessages(prev => [...prev, { role: 'you', text: q }, { role: 'coach', text: reply }]);
   setQuestion('');
 }
 function nextLesson() {
   if (lessonIndex + 1 < subject.lessons.length) setLessonIndex(i => i + 1);
   else {
     const nextSubject = subjects[(subjects.findIndex(s => s.id === subject.id) + 1) % subjects.length];
     setSubjectId(nextSubject.id); setLessonIndex(0);
   }
   resetLesson(); setFlashIndex(0); setFlipped(false);
 }
 function toggleBookmark() {
   setBookmarks(prev => prev.includes(lessonKey) ? prev.filter(k => k !== lessonKey) : [...prev, lessonKey]);
   notify(bookmarks.includes(lessonKey) ? 'Removed from saved concepts' : 'Saved to your collection 🔖');
 }
 function navTo(next: typeof page) { setPage(next); setMobileMenu(false); }



 return (
   <div className={`app-shell ${dark ? 'dark-mode' : ''}`}>
     <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
       <div className="brand-row">
         <div className="brand-mark"><Brain size={23} /></div>
         <div><div className="brand-name">mind<span>mirror</span><i>✳</i></div><div className="brand-caption">YOUR THINKING, UNLOCKED</div></div>
         <button className="icon-button mobile-close" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={18} /></button>
       </div>
       <button className="new-session" onClick={() => { resetLesson(); navTo('studio'); }}><Plus size={17} /> New learning session <span>↗</span></button>
       <div className="nav-label">YOUR WORKSPACE</div>
       <nav className="main-nav">
         <button className={page === 'studio' ? 'nav-item active' : 'nav-item'} onClick={() => navTo('studio')}><Compass size={17} /> Learning studio <ChevronRight size={15} /></button>
         <button className={page === 'mission' ? 'nav-item active' : 'nav-item'} onClick={() => navTo('mission')}><BrainCircuit size={17} /> Mission control <span className="nav-count">NEW</span></button>
         <button className={page === 'notebook' ? 'nav-item active' : 'nav-item'} onClick={() => navTo('notebook')}><NotebookPen size={17} /> My notebook <span className="nav-count">{Object.values(notes).filter(Boolean).length}</span></button>
         <button className={page === 'flashcards' ? 'nav-item active' : 'nav-item'} onClick={() => { navTo('flashcards'); setFlipped(false); }}><LayersIcon /> Flashcard deck <span className="nav-count">{currentFlashcards.length}</span></button>
         <button className={page === 'achievements' ? 'nav-item active' : 'nav-item'} onClick={() => navTo('achievements')}><Trophy size={17} /> Achievements <span className="nav-count">{completed.length}</span></button>
       </nav>
       <div className="nav-label subjects-label">SUBJECT COLLECTION</div>
       <div className="subject-search"><Search size={15} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Find a subject…" aria-label="Search subjects" /></div>
       <div className="subject-nav">
         {filteredSubjects.map(s => <button key={s.id} className={`subject-link ${subjectId === s.id && page === 'studio' ? 'active' : ''}`} onClick={() => chooseSubject(s.id)}><span className={`subject-emoji ${s.color}`}>{s.emoji}</span><span>{s.name}</span>{subjectId === s.id && page === 'studio' && <span className="active-dot" />}</button>)}
         {filteredSubjects.length === 0 && <p className="no-results">No subjects match that search.</p>}
       </div>
       <div className="sidebar-bottom">
         <div className="streak-card"><div className="streak-icon"><Zap size={17} /></div><div><strong>Your curiosity score</strong><p>{completed.length} concept{completed.length === 1 ? '' : 's'} explored</p></div><span className="streak-count">{completed.length}</span></div>
         <button className="settings-link" onClick={() => setShowSettings(!showSettings)}><Settings2 size={15} /> Preferences <ChevronDown size={14} /></button>
         {showSettings && <div className="settings-popover"><p>Make the studio yours</p><button onClick={() => setDark(v => !v)}>{dark ? <Sun size={15} /> : <Moon size={15} />}{dark ? 'Switch to light mode' : 'Switch to night mode'}</button><small>Your progress and notes are saved in this browser.</small></div>}
         <div className="privacy-note"><span className="privacy-dot" /> Local prototype · your notes stay in this browser</div>
       </div>
     </aside>



     {mobileMenu && <button className="scrim" onClick={() => setMobileMenu(false)} aria-label="Close menu" />}
     <main className="main-area">
       <header className="topbar">
         <button className="icon-button menu-button" onClick={() => setMobileMenu(v => !v)} aria-label="Toggle menu"><Menu size={19} /></button>
         <div className="breadcrumb">MindMirror <span>/</span> {page === 'studio' ? subject.name : page === 'notebook' ? 'My notebook' : page === 'flashcards' ? 'Flashcards' : page === 'mission' ? 'Mission control' : 'Achievements'}</div>
         <div className="topbar-right"><div className="mode-pill"><span /> THINKING PARTNER MODE</div><div className="avatar">M</div></div>
       </header>



       <div className="content-wrap">
         {page === 'studio' && <>
           <section className="welcome-row"><div><div className="eyebrow"><Sparkles size={14} /> YOUR PERSONAL LEARNING UNIVERSE</div><h1>Make the <em>“wait, what?”</em><br className="desktop-break" /> moment click.</h1><p className="welcome-sub">Not just answers. A space to experiment with ideas, spot the gaps, and learn how <strong>you</strong> think.</p><div className="welcome-chips"><span><Brain size={13} /> Curiosity first</span><span><Heart size={13} /> No-pressure practice</span><span><Activity size={13} /> Progress you can feel</span></div></div><div className="orbit-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-core"><Brain size={39} /></div><span className="orbit-star star-a">✦</span><span className="orbit-star star-b">✧</span><span className="orbit-star star-c">·</span><span className="orbit-caption">THINK / TRY / GROW</span></div></section>



           <section className="daily-card"><div className="daily-icon"><Target size={21} /></div><div className="daily-copy"><span>YOUR MINI MISSION</span><strong>One small insight can change everything.</strong><p>Complete a goal to build your learning ritual.</p></div><div className="daily-goals">{starterGoals.map((g, i) => <button key={g} className={goals[i] ? 'goal done' : 'goal'} onClick={() => setGoals(prev => prev.map((v, j) => j === i ? !v : v))}><span>{goals[i] ? <Check size={13} /> : i + 1}</span>{g}</button>)}</div><div className="goal-progress"><strong>{goals.filter(Boolean).length}/3</strong><span>goals</span></div></section>



           <section className="subject-strip"><div className={`strip-icon ${subject.color}`}>{subject.emoji}</div><div className="strip-copy"><span>YOUR CURRENT LAB</span><strong>{subject.name}</strong><small>{subject.description}</small></div><div className="strip-divider" /><div className="strip-copy topic-copy"><span>CONCEPT IN FOCUS</span><strong>{lesson.title}</strong><small>{lesson.level} · {lesson.minutes} min</small></div><button className={`save-button ${bookmarks.includes(lessonKey) ? 'saved' : ''}`} onClick={toggleBookmark} aria-label="Save concept"><Bookmark size={16} fill={bookmarks.includes(lessonKey) ? 'currentColor' : 'none'} />{bookmarks.includes(lessonKey) ? 'Saved' : 'Save concept'}</button></section>



           <div className="workspace-grid"><section className="lesson-column">
             <div className="stepper"><div className={`step-item ${step === 'learn' ? 'current' : 'done'}`}><span>{step === 'learn' ? '01' : <Check size={13} />}</span><div><b>Get the idea</b><small>Build a mental model</small></div></div><div className="step-line" /><div className={`step-item ${step === 'check' ? 'current' : step === 'reflect' ? 'done' : ''}`}><span>{step === 'reflect' ? <Check size={13} /> : '02'}</span><div><b>Test your thinking</b><small>Try it yourself</small></div></div><div className="step-line" /><div className={`step-item ${step === 'reflect' ? 'current' : ''}`}><span>03</span><div><b>Make it stick</b><small>Repair the gap</small></div></div></div>
             <article className="lesson-card"><div className="lesson-card-top"><div className="lesson-tag"><span className="tag-dot" /> CONCEPT LAB <span className="tag-separator">·</span> {lessonIndex + 1} OF {subject.lessons.length}</div><button className="icon-button" onClick={resetLesson} title="Reset lesson"><RotateCcw size={16} /></button></div>
               {step === 'learn' && <><div className="lesson-heading"><div className={`lesson-symbol ${subject.color}`}>{subject.emoji}</div><div><div className="level-label">{lesson.level.toUpperCase()}</div><h2>{lesson.title}</h2><p>Start with intuition, then connect it to the science.</p></div></div><div className="hook-box"><span className="hook-icon"><Lightbulb size={18} /></span><div><label>THE EVERYDAY CONNECTION</label><p>{lesson.hook}</p></div></div><div className="explanation"><div className="section-mini-title"><span className="mini-line" /> THE IDEA, UNPACKED</div><p>{lesson.explain}</p><div className="example-box"><div className="example-icon"><BookOpen size={18} /></div><div><strong>Picture it in real life</strong><p>{lesson.example}</p></div></div></div><div className="lesson-footer"><div className="time-estimate"><Clock3 size={14} /> {lesson.minutes} min <span>·</span> go at your pace</div><button className="primary-button" onClick={() => setStep('check')}>Check my understanding <ArrowRight size={16} /></button></div></>}
               {step === 'check' && <div className="check-screen"><div className="question-icon"><CircleHelp size={24} /></div><div className="section-mini-title"><span className="mini-line" /> YOUR TURN</div><h2>Let’s see what stuck.</h2><p className="question-prompt">{lesson.question}</p><textarea className="answer-input" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Talk me through your thinking… There is no pressure to be perfect." rows={4} /><div className="answer-actions"><button className="text-button" onClick={() => setHint(v => !v)}><Lightbulb size={15} />{hint ? 'Hide hint' : 'Give me a hint'}</button><button className="primary-button" onClick={submitAnswer} disabled={!answer.trim()}>Reflect on my answer <ArrowRight size={16} /></button></div>{hint && <div className="hint-box"><Lightbulb size={16} /><p>{lesson.followUp} Try identifying the relationship first, then explain why it happens.</p></div>}<div className="confidence-box"><span>How confident do you feel right now?</span><div className="confidence-options">{['Not yet', 'A little', 'Getting there', 'Pretty sure', 'I’ve got it'].map((c, i) => <button key={c} className={confidence === i + 1 ? 'selected' : ''} onClick={() => setConfidence(i + 1)}>{i + 1}<small>{c}</small></button>)}</div></div></div>}
               {step === 'reflect' && <div className="reflection-screen"><div className="success-orbit"><Sparkles size={27} /></div><div className="section-mini-title"><span className="mini-line" /> YOUR THINKING, REFLECTED</div><h2>Let’s close the gap.</h2><p className="reflection-intro">Your response is a starting point, not a grade. Compare your reasoning with the core idea below.</p><div className="your-answer"><span>YOUR RESPONSE</span><p>{answer}</p><small>Confidence: {confidence}/5</small></div><div className="coach-feedback"><div className="coach-avatar"><Brain size={19} /></div><div><strong>The concept to keep</strong><p>{lesson.answer}</p><p>{lesson.misconception}</p><div className="followup-question"><span>ONE MORE THOUGHT</span><p>{lesson.followUp}</p></div></div></div><div className="lesson-footer"><button className="secondary-button" onClick={resetLesson}><RotateCcw size={15} /> Try again</button><button className="primary-button" onClick={nextLesson}>Next concept <ArrowRight size={16} /></button></div></div>}
             </article>
             <div className="bottom-note"><span className="shield-mini">✓</span><span>Learning is a process, not a performance. Your draft answers are practice, not grades.</span><button onClick={() => { setPage('flashcards'); setFlipped(false); }}>Review flashcards <ArrowRight size={13} /></button></div>
           </section>
           <aside className="coach-column"><div className="coach-card"><div className="coach-card-header"><div className="coach-heading-icon"><Brain size={18} /></div><div><h3>Ask the coach</h3><p>Your curious sidekick</p></div><span className="online-indicator" /></div><div className="coach-intro"><div className="coach-avatar large"><Sparkles size={21} /></div><div className="coach-bubble"><strong>Hey, learner! 👋</strong><p>{coachIntro}</p></div></div><div className="suggestion-label">TRY A PROMPT</div><div className="suggestions"><button onClick={() => askCoach('Can you explain this more simply?')}>Explain it simply <ArrowRight size={13} /></button><button onClick={() => askCoach('Can you give me an analogy?')}>Give me an analogy <ArrowRight size={13} /></button><button onClick={() => askCoach('Why does this happen?')}>But why? <ArrowRight size={13} /></button><button onClick={() => askCoach('Give me a hint')}>Hint, not the answer <ArrowRight size={13} /></button><button onClick={() => askCoach('Quiz me with a question')}>Quiz me <ArrowRight size={13} /></button></div><div className="chat-log">{messages.slice(-6).map((m, i) => <div className={`chat-message ${m.role}`} key={`${i}-m.role-{m.text.slice(0, 8)}`}><div className="message-label">{m.role === 'coach' ? 'MINDMIRROR' : 'YOU'}</div><p>{m.text}</p></div>)}</div><form className="coach-input-row" onSubmit={e => { e.preventDefault(); askCoach(); }}><input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask about this concept…" aria-label="Ask the coach" /><button type="submit" aria-label="Send question" disabled={!question.trim()}><Send size={16} /></button></form><div className="coach-footnote"><span /> Prototype coach · uses prepared lesson knowledge</div></div>
             <div className="progress-card"><div className="progress-top"><div><span className="progress-label">YOUR LEARNING JOURNEY</span><h3>Small steps count.</h3></div><div className="progress-ring"><span>{progress}%</span></div></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><div className="progress-bottom"><span><CheckCircle2 size={13} /> Keep exploring</span><span>{completed.length}/{allLessons.length} concepts</span></div></div>
             <div className="insight-card"><div className="insight-star"><Sparkles size={16} /></div><div><strong>A MindMirror reminder</strong><p>Confusion is useful data. It tells us where to look next.</p></div></div>
           </aside></div>
         </>}



         {page === 'mission' && <section className="page-panel mission-page">
           <div className="eyebrow"><BrainCircuit size={14} /> YOUR ADAPTIVE STUDY COMMAND CENTER</div>
           <h1>Study with <em>intention.</em></h1>
           <p className="page-lead">MindMirror is built around a simple loop: you try, the coach helps you inspect your thinking, and you choose what to practice next. You stay in control.</p>
           <div className="mission-hero"><div><span className="panel-kicker">THE HUMAN + AI LOOP</span><h2>Think first. Get a nudge. Try again.</h2><p>Start with your own reasoning, ask for a hint instead of an answer, then compare your explanation with the core idea. That keeps the learning yours.</p><button className="primary-button" onClick={() => navTo('studio')}>Continue current lesson <ArrowRight size={15}/></button></div><div className="loop-steps"><div><span>01</span><strong>You attempt</strong><small>Bring your own idea</small></div><div><span>02</span><strong>Coach nudges</strong><small>Hint, analogy, or question</small></div><div><span>03</span><strong>You reflect</strong><small>Check confidence and revise</small></div></div></div>
           <div className="mission-grid">
             <div className="mission-card focus-card"><div className="mission-card-top"><div className="mission-icon violet"><Timer size={20}/></div><span className="panel-kicker">FOCUS SPRINT</span></div><h2>One thing at a time.</h2><p>Choose a short sprint to make starting easier. Pause whenever you need.</p><div className="timer-display">{String(Math.floor(focusSeconds / 60)).padStart(2,'0')}:{String(focusSeconds % 60).padStart(2,'0')}</div><div className="timer-presets"><button onClick={() => {setTimerRunning(false);setFocusSeconds(5*60)}}>5 min</button><button onClick={() => {setTimerRunning(false);setFocusSeconds(15*60)}}>15 min</button><button onClick={() => {setTimerRunning(false);setFocusSeconds(25*60)}}>25 min</button></div><div className="timer-actions"><button className="primary-button" onClick={() => { if (focusSeconds === 0) setFocusSeconds(15*60); setTimerRunning(v => !v); }}>{timerRunning ? <PauseCircle size={16}/> : <PlayCircle size={16}/>} {timerRunning ? 'Pause sprint' : 'Start sprint'}</button><button className="secondary-button" onClick={() => {setTimerRunning(false);setFocusSeconds(15*60)}}>Reset</button></div></div>
             <div className="mission-card"><div className="mission-card-top"><div className="mission-icon mint"><Gauge size={20}/></div><span className="panel-kicker">LEARNING SIGNALS</span></div><h2>Your current snapshot</h2><div className="signal-row"><span>Concepts explored</span><strong>{completed.length}<small> / {allLessons.length}</small></strong></div><div className="signal-track"><span style={{width:`${progress}%`}}/></div><div className="signal-row"><span>Saved concepts</span><strong>{bookmarks.length}</strong></div><div className="signal-row"><span>Notes captured</span><strong>{Object.values(notes).filter(v=>v.trim()).length}</strong></div><div className="signal-row"><span>Daily goals</span><strong>{goals.filter(Boolean).length}/3</strong></div><p className="signal-footnote">These are practice signals, not a judgment of your ability.</p></div>
           </div>
           <div className="mission-card exam-card"><div className="mission-card-top"><div className="mission-icon peach"><ClipboardCheck size={20}/></div><span className="panel-kicker">QUICK RETRIEVAL CHALLENGE</span></div><h2>Can you explain it without peeking?</h2><p className="exam-instructions">Answer these short prompts from the current subject. This is a self-check, not a high-stakes grade.</p><div className="exam-question"><span>01 / SHORT RESPONSE</span><strong>{subject.lessons[examSet % subject.lessons.length].question}</strong><textarea rows={3} value={examAnswers[subject.lessons[examSet % subject.lessons.length].id] ?? ''} onChange={e=>{setExamAnswers(prev=>({...prev,[subject.lessons[examSet % subject.lessons.length].id]:e.target.value}));setExamSubmitted(false)}} placeholder="Write what you remember before opening the explanation…"/></div>{examSubmitted && <div className="exam-feedback"><strong>Compare your thinking</strong><p>{subject.lessons[examSet % subject.lessons.length].answer}</p><small>Also check: {subject.lessons[examSet % subject.lessons.length].misconception}</small></div>}<div className="timer-actions"><button className="primary-button" onClick={()=>setExamSubmitted(true)} disabled={!(examAnswers[subject.lessons[examSet % subject.lessons.length].id] ?? '').trim()}>Reveal comparison <Lightbulb size={15}/></button><button className="secondary-button" onClick={()=>{setExamSet(i=>(i+1)%subject.lessons.length);setExamSubmitted(false)}}>Next prompt <ArrowRight size={15}/></button></div></div>
         </section>}



         {page === 'notebook' && <section className="page-panel"><div className="eyebrow"><NotebookPen size={14} /> YOUR PERSONAL KNOWLEDGE BANK</div><h1>My <em>notebook.</em></h1><p className="page-lead">Capture the idea in your own words. Notes are saved in this browser automatically.</p><div className="notebook-layout"><div className="note-editor"><div className="panel-heading"><div><span className="panel-kicker">QUICK CAPTURE</span><h2>What clicked today?</h2></div><NotebookPen size={23} /></div><label htmlFor="lesson-note">Notes for {lesson.title}</label><textarea id="lesson-note" value={notes[lessonKey] ?? ''} onChange={e => setNotes(prev => ({ ...prev, [lessonKey]: e.target.value }))} placeholder="Write your own explanation, a question to revisit, or a connection you noticed…" rows={8} /><div className="note-editor-footer"><span><CheckCircle2 size={14} /> Auto-saved locally</span><button className="primary-button" onClick={() => notify('Your note is saved in this browser.')}>Save note <Check size={15} /></button></div></div><div className="saved-notes"><div className="panel-heading"><div><span className="panel-kicker">YOUR SAVED CONCEPTS</span><h2>Keepers</h2></div><Bookmark size={22} /></div>{bookmarkedLessons.length === 0 && Object.values(notes).filter(Boolean).length === 0 ? <div className="empty-state"><BookOpen size={28} /><strong>Your knowledge bank starts here.</strong><p>Save a concept or jot down your first insight to see it here.</p><button className="secondary-button" onClick={() => navTo('studio')}>Explore a lesson <ArrowRight size={14} /></button></div> : <div className="saved-list">{bookmarkedLessons.map(l => <button className="saved-row" key={`l.subjectId:{l.id}`} onClick={() => chooseLesson(l.subjectId, l.id)}><span>{l.subjectEmoji}</span><div><strong>{l.title}</strong><small>{l.subjectName} · Saved concept</small></div><ChevronRight size={16} /></button>)}{Object.entries(notes).filter(([, v]) => v.trim()).map(([key, value]) => { const [sid, lid] = key.split(':'); const found = allLessons.find(l => l.subjectId === sid && l.id === lid); return <button className="saved-row" key={`note-${key}`} onClick={() => chooseLesson(sid, lid)}><span>📝</span><div><strong>{found?.title ?? 'Study note'}</strong><small>{value.slice(0, 74)}{value.length > 74 ? '…' : ''}</small></div><ChevronRight size={16} /></button>; })}</div>}</div></div></section>}



         {page === 'flashcards' && <section className="page-panel"><div className="eyebrow"><Zap size={14} /> ACTIVE RECALL STUDIO</div><h1>Make it <em>stick.</em></h1><p className="page-lead">Test your memory before you reveal the answer. Retrieval practice helps you notice what you really know.</p><div className="flashcard-layout"><div className="flashcard-main"><div className="flashcard-top"><span>DECK: {lesson.title.toUpperCase()}</span><span>{flashIndex + 1} / {currentFlashcards.length}</span></div><button className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(v => !v)}><span className="flashcard-label">{flipped ? 'THE ANSWER' : 'TRY TO RECALL'}</span><span className="flashcard-text">{flipped ? currentFlashcards[flashIndex].back : currentFlashcards[flashIndex].front}</span><span className="flashcard-hint"><RotateCcw size={14} /> Click to {flipped ? 'see question' : 'reveal answer'}</span></button><div className="flashcard-controls"><button className="secondary-button" onClick={() => { setFlashIndex(i => (i - 1 + currentFlashcards.length) % currentFlashcards.length); setFlipped(false); }}>Previous</button><button className="primary-button" onClick={() => { setFlashIndex(i => (i + 1) % currentFlashcards.length); setFlipped(false); }}>Next card <ArrowRight size={15} /></button></div><div className="flashcard-dots">{currentFlashcards.map((c, i) => <button key={c.front} className={flashIndex === i ? 'active' : ''} onClick={() => { setFlashIndex(i); setFlipped(false); }} aria-label={`Go to card ${i + 1}`} />)}</div></div><aside className="flashcard-side"><div className="side-icon"><Brain size={22} /></div><h2>How to use this deck</h2><ol><li>Read the prompt and pause.</li><li>Say your answer aloud or write it down.</li><li>Flip the card and compare.</li><li>Repeat the tricky ones later.</li></ol><div className="side-tip"><Lightbulb size={16} /><p><strong>Pro tip:</strong> explaining why an answer is true is more powerful than memorizing the wording.</p></div><button className="text-button" onClick={() => navTo('studio')}>Back to lesson <ArrowRight size={14} /></button></aside></div><div className="deck-switcher"><strong>Choose a subject deck</strong><div>{subjects.map(s => <button key={s.id} className={subjectId === s.id ? 'selected' : ''} onClick={() => { setSubjectId(s.id); setLessonIndex(0); setFlashIndex(0); setFlipped(false); }}><span>{s.emoji}</span>{s.name}</button>)}</div></div></section>}



         {page === 'achievements' && <section className="page-panel"><div className="eyebrow"><Trophy size={14} /> YOUR GROWTH, MADE VISIBLE</div><h1>Look how far you’ve <em>come.</em></h1><p className="page-lead">This is not a leaderboard. It is a record of curiosity, practice, and small wins.</p><div className="stats-grid"><div className="stat-card"><div className="stat-icon mint"><CheckCircle2 size={19} /></div><span>CONCEPTS EXPLORED</span><strong>{completed.length}</strong><small>of {allLessons.length} available concepts</small></div><div className="stat-card"><div className="stat-icon lilac"><Bookmark size={19} /></div><span>SAVED CONCEPTS</span><strong>{bookmarks.length}</strong><small>Ideas to revisit</small></div><div className="stat-card"><div className="stat-icon peach"><NotebookPen size={19} /></div><span>NOTES CAPTURED</span><strong>{Object.values(notes).filter(v => v.trim()).length}</strong><small>Your own explanations</small></div><div className="stat-card"><div className="stat-icon blue"><Target size={19} /></div><span>MINI GOALS</span><strong>{goals.filter(Boolean).length}/3</strong><small>Today's learning ritual</small></div></div><div className="achievement-section"><div className="panel-heading"><div><span className="panel-kicker">MILESTONES</span><h2>Badges you can earn</h2></div><Award size={23} /></div><div className="badge-grid"><div className={completed.length >= 1 ? 'achievement-badge earned' : 'achievement-badge'}><div>🌱</div><strong>First Spark</strong><p>Explore your first concept.</p><span>{completed.length >= 1 ? 'UNLOCKED' : 'EXPLORE 1 CONCEPT'}</span></div><div className={bookmarks.length >= 1 ? 'achievement-badge earned' : 'achievement-badge'}><div>🔖</div><strong>Idea Collector</strong><p>Save a concept for later.</p><span>{bookmarks.length >= 1 ? 'UNLOCKED' : 'SAVE 1 CONCEPT'}</span></div><div className={Object.values(notes).some(v => v.trim()) ? 'achievement-badge earned' : 'achievement-badge'}><div>📝</div><strong>Thought Shaper</strong><p>Write your own study note.</p><span>{Object.values(notes).some(v => v.trim()) ? 'UNLOCKED' : 'WRITE 1 NOTE'}</span></div><div className={completed.length >= 5 ? 'achievement-badge earned' : 'achievement-badge'}><div>🚀</div><strong>Curiosity Explorer</strong><p>Explore five concepts.</p><span>{completed.length >= 5 ? 'UNLOCKED' : `${completed.length}/5 CONCEPTS`}</span></div></div></div><div className="achievement-quote"><Sparkles size={21} /><p>“The goal isn’t to never be confused. It’s to get better at finding your way through confusion.”</p></div><button className="primary-button" onClick={() => navTo('studio')}>Keep exploring <ArrowRight size={15} /></button></section>}



         <footer className="page-footer"><span>mindmirror <b>✳</b> built for curious minds</span><span>Study smarter by understanding deeper.</span></footer>
       </div>
     </main>
     {toast && <div className="toast-message"><CheckCircle2 size={16} /> {toast}</div>}
   </div>
 );
}



function LayersIcon() { return <ListChecks size={17} />; }


