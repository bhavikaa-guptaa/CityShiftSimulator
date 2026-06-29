import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, MapPin, DollarSign, Briefcase, User, Send, RefreshCcw, Heart, AlertCircle, CheckCircle2, MoreHorizontal, MoveRight, Share2 } from 'lucide-react';
import Globe from './components/Globe';
import AvatarRoom from './components/AvatarRoom';
import { simulateLife } from './services/ai';

const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-midnight-950"
  >
    <div className="relative w-32 h-32 mb-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-t-2 border-accent-blue rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 border-r-2 border-accent-indigo rounded-full opacity-50"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Plane className="text-accent-blue animate-pulse" size={32} />
      </div>
    </div>
    <motion.h2
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="text-2xl font-display font-light text-white tracking-widest"
    >
      PACKING YOUR BAGS...
    </motion.h2>
  </motion.div>
);

const ResultCard = ({ title, children, icon: Icon, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`glass-card p-8 rounded-2xl relative overflow-hidden group ${className}`}
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      {Icon && <Icon size={48} />}
    </div>
    <h3 className="text-sm font-display tracking-[0.2em] text-accent-blue uppercase mb-6">{title}</h3>
    {children}
  </motion.div>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[500px] flex flex-col items-center justify-center bg-midnight-900 rounded-[3rem] border border-white/5 p-12 text-center">
          <AlertCircle size={48} className="text-rose-500 mb-4" />
          <h4 className="text-xl font-display mb-2">Visualization Offline</h4>
          <p className="text-slate-500 font-light text-sm">We couldn't connect to the 3D neural link. The rest of your simulation is still active.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ✅ FIX: Accept hairColor, skinColor, familyCount, familyTags as props
// instead of trying to read formData (which only exists in App scope)
const SimsMode = ({
  isOpen,
  onClose,
  gender,
  city,
  cityVibe,
  routine,
  hairColor,
  skinColor,
  familyCount,
  familyTags
}) => {
  const [currentScene, setCurrentScene] = useState('morning');
  const scenes = [
    { id: 'morning', label: 'Morning Ritual', icon: '☕' },
    { id: 'work', label: 'Professional Grind', icon: '💻' },
    { id: 'night', label: 'City Lights', icon: '🍸' }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-midnight-950 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/10 glass">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center">
            <User size={20} className="text-accent-blue" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold">Life in {city}</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Advanced Neural Simulation</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-3 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
        >
          <RefreshCcw size={20} className="rotate-45" />
        </button>
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 relative flex flex-col lg:flex-row overflow-hidden">
        {/* Left: 3D View */}
        <div className="flex-1 relative">
          {/* ✅ FIX: Use props directly, not formData */}
          <AvatarRoom
            gender={gender}
            cityVibe={cityVibe}
            isSimMode={true}
            currentScene={currentScene}
            hairColor={hairColor}
            skinColor={skinColor}
            familyCount={familyCount}
            familyTags={familyTags}
          />

          {/* Overlay Routine Info */}
          <div className="absolute top-10 left-10 max-w-sm pointer-events-none">
            <motion.div
              key={currentScene}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="glass p-6 rounded-2xl border-l-4 border-l-accent-blue"
            >
              <h4 className="text-sm font-display text-accent-blue uppercase tracking-widest mb-2">Live Status</h4>
              <p className="text-xl font-light italic">
                {currentScene === 'morning'
                  ? routine[0]
                  : currentScene === 'work'
                  ? routine[1]
                  : routine[routine.length - 1]}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right: Controls & Inventory */}
        <div className="w-full lg:w-96 bg-midnight-900/50 backdrop-blur-xl border-l border-white/10 p-8 flex flex-col gap-8 overflow-y-auto">
          <div>
            <h3 className="text-xs font-display tracking-[0.3em] text-slate-500 uppercase mb-6">Simulation Timeline</h3>
            <div className="space-y-3">
              {scenes.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => setCurrentScene(scene.id)}
                  className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between group ${
                    currentScene === scene.id
                      ? 'bg-accent-blue border-accent-blue text-white shadow-lg shadow-accent-blue/20'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{scene.icon}</span>
                    <span className="font-display font-medium">{scene.label}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${currentScene === scene.id ? 'bg-white' : 'bg-slate-700'} group-hover:bg-white transition-colors`} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-6 bg-accent-blue/10 border border-accent-blue/20 rounded-2xl">
              <h4 className="text-xs font-display text-accent-blue uppercase tracking-widest mb-3">City Mood</h4>
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                The simulation reflects {city}'s unique energy. Your avatar's posture and the surroundings are calibrated to local lifestyle metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [step, setStep] = useState('landing'); // landing, loading, results
  const [formData, setFormData] = useState({
    currentCity: '',
    destinationCity: '',
    income: '',
    profession: '',
    lifestyle: '',
    gender: 'male',
    hairColor: '#000000',
    skinColor: '#ffe0bd',
    familyCount: 0,
    familyTags: ''
  });
  const [result, setResult] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSimMode, setShowSimMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep('loading');
    try {
      const data = await simulateLife(formData);
      setResult(data);
      setStep('results');
    } catch (error) {
      alert("Something went wrong on your journey. Please try again.");
      setStep('landing');
    }
  };

  const reset = () => {
    setResult(null);
    setStep('landing');
  };

  const getCityVibe = (cityName) => {
    const lower = cityName.toLowerCase();
    if (lower.includes('tokyo')) return 'tokyo';
    if (lower.includes('angeles')) return 'la';
    if (lower.includes('london')) return 'london';
    return 'default';
  };

  return (
    <div className="min-h-screen text-slate-200">
      <AnimatePresence>
        {step === 'loading' && <LoadingScreen />}
      </AnimatePresence>

      <main className="relative z-10">
        {step === 'landing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 relative"
          >
            <Globe />
            <div className="max-w-4xl w-full text-center mb-12 relative z-10">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-8xl font-display font-semibold mb-6 tracking-tight"
              >
                What If I <span className="text-accent-blue italic">Moved</span> There?
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto"
              >
                A cinematic life simulator that mirrors your future in any city in the world.
              </motion.p>
            </div>

            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onSubmit={handleSubmit}
              className="glass p-8 md:p-12 rounded-3xl max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
            >
              <div className="space-y-2">
                <label className="text-xs font-display tracking-widest text-slate-500 uppercase">Home Base</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-blue" size={18} />
                  <input
                    required
                    type="text"
                    placeholder="Current City"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 ring-accent-blue/50 outline-none transition-all"
                    value={formData.currentCity}
                    onChange={e => setFormData({ ...formData, currentCity: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-display tracking-widest text-slate-500 uppercase">The Dream</label>
                <div className="relative">
                  <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-indigo" size={18} />
                  <input
                    required
                    type="text"
                    placeholder="Destination City"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 ring-accent-indigo/50 outline-none transition-all"
                    value={formData.destinationCity}
                    onChange={e => setFormData({ ...formData, destinationCity: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-display tracking-widest text-slate-500 uppercase">Monthly Income (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-blue" size={18} />
                  <input
                    required
                    type="number"
                    placeholder="3500"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 ring-accent-blue/50 outline-none transition-all"
                    value={formData.income}
                    onChange={e => setFormData({ ...formData, income: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-display tracking-widest text-slate-500 uppercase">Profession</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-indigo" size={18} />
                  <input
                    required
                    type="text"
                    placeholder="Product Designer"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 ring-accent-indigo/50 outline-none transition-all"
                    value={formData.profession}
                    onChange={e => setFormData({ ...formData, profession: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-display tracking-widest text-slate-500 uppercase">Representation</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                    className={`flex-1 py-4 rounded-xl border transition-all flex items-center justify-center gap-3 ${
                      formData.gender === 'male' ? 'bg-accent-blue border-accent-blue text-white' : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <User size={18} /> Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                    className={`flex-1 py-4 rounded-xl border transition-all flex items-center justify-center gap-3 ${
                      formData.gender === 'female' ? 'bg-accent-indigo border-accent-indigo text-white' : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <User size={18} /> Female
                  </button>
                </div>
              </div>

              {/* Hair and Skin Color Preferences */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-display tracking-widest text-slate-500 uppercase">Hair Color</label>
                <input
                  type="color"
                  className="w-full h-10 rounded-xl border border-white/10 bg-white/5"
                  value={formData.hairColor}
                  onChange={e => setFormData({ ...formData, hairColor: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-display tracking-widest text-slate-500 uppercase">Skin Color</label>
                <input
                  type="color"
                  className="w-full h-10 rounded-xl border border-white/10 bg-white/5"
                  value={formData.skinColor}
                  onChange={e => setFormData({ ...formData, skinColor: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-display tracking-widest text-slate-500 uppercase">Family Members</label>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 focus:ring-2 ring-accent-blue/50 outline-none transition-all"
                  placeholder="Number of family members"
                  value={formData.familyCount}
                  onChange={e => setFormData({ ...formData, familyCount: parseInt(e.target.value, 10) || 0 })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-display tracking-widest text-slate-500 uppercase">Family Tags (comma separated)</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-4 focus:ring-2 ring-accent-blue/50 outline-none transition-all"
                  placeholder="e.g., sports, cooking"
                  value={formData.familyTags}
                  onChange={e => setFormData({ ...formData, familyTags: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-display tracking-widest text-slate-500 uppercase">Your Soul & Routine</label>
                <div className="relative">
                  <User className="absolute left-4 top-6 text-accent-blue" size={18} />
                  <textarea
                    required
                    placeholder="I love specialty coffee, weekend hikes, and loud jazz clubs. Quiet at night, energetic by day."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 h-32 focus:ring-2 ring-accent-blue/50 outline-none transition-all resize-none"
                    value={formData.lifestyle}
                    onChange={e => setFormData({ ...formData, lifestyle: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="md:col-span-2 btn-primary group flex items-center justify-center gap-3">
                Begin Simulation <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          </motion.div>
        )}

        {step === 'results' && result && (
          <div className="max-w-[1400px] mx-auto px-6 py-20 pb-40">
            {/* Header Section */}
            <div className="mb-20 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 mb-8"
              >
                <MapPin size={14} className="text-accent-blue" />
                <span className="text-xs font-display tracking-widest uppercase">{formData.currentCity}</span>
                <MoveRight size={14} className="mx-2 opacity-50" />
                <MapPin size={14} className="text-accent-indigo" />
                <span className="text-xs font-display tracking-widest uppercase font-bold text-white">{formData.destinationCity}</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-display font-medium max-w-4xl mx-auto leading-tight"
              >
                "{result.tagline}"
              </motion.h2>
            </div>

            {/* Avatar Visualization Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-20"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/[0.02] p-8 md:p-12 rounded-[4rem] border border-white/5">
                <div className="lg:col-span-4 max-w-sm">
                  <h3 className="text-3xl font-display font-bold mb-4">Your Future <span className="text-accent-blue italic">Self</span></h3>
                  <p className="text-slate-400 font-light leading-relaxed mb-8">
                    In {formData.destinationCity}, your routine shifts. You walk with more purpose, dress for the {result.commute.includes('cycle') ? 'ride' : 'elements'}, and carry the quiet confidence of someone who finally took the leap.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Aesthetic Override</p>
                        <p className="text-sm font-medium">City-Tailored Casual</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-8">
                  <ErrorBoundary>
                    <AvatarRoom
                      gender={formData.gender}
                      cityVibe={getCityVibe(formData.destinationCity)}
                      hairColor={formData.hairColor}
                      skinColor={formData.skinColor}
                      familyCount={formData.familyCount}
                      familyTags={formData.familyTags}
                    />
                  </ErrorBoundary>
                  <button
                    onClick={() => setShowSimMode(true)}
                    className="w-full mt-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-3 font-display text-sm tracking-widest uppercase transition-all"
                  >
                    Enter Full Life Simulation (Sims Mode) <MoveRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* ✅ FIX: Pass all formData fields that SimsMode needs as explicit props */}
            <AnimatePresence>
              {showSimMode && (
                <SimsMode
                  isOpen={showSimMode}
                  onClose={() => setShowSimMode(false)}
                  gender={formData.gender}
                  city={formData.destinationCity}
                  cityVibe={getCityVibe(formData.destinationCity)}
                  routine={result.daily_routine}
                  hairColor={formData.hairColor}
                  skinColor={formData.skinColor}
                  familyCount={formData.familyCount}
                  familyTags={formData.familyTags}
                />
              )}
            </AnimatePresence>

            {/* Verdict Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mb-20"
            >
              <div className={`flex flex-col items-center gap-4 rounded-3xl p-8 border-2 ${
                result.verdict === 'yes' ? 'bg-emerald-500/10 border-emerald-500/20' :
                result.verdict === 'maybe' ? 'bg-amber-500/10 border-amber-500/20' :
                'bg-rose-500/10 border-rose-500/20'
              }`}>
                <div className="flex items-center gap-3">
                  {result.verdict === 'yes' && <CheckCircle2 className="text-emerald-500" size={32} />}
                  {result.verdict === 'maybe' && <AlertCircle className="text-amber-500" size={32} />}
                  {result.verdict === 'no' && <AlertCircle className="text-rose-500" size={32} />}
                  <span className={`text-4xl font-display font-bold uppercase tracking-tighter ${
                    result.verdict === 'yes' ? 'text-emerald-500' :
                    result.verdict === 'maybe' ? 'text-amber-500' :
                    'text-rose-500'
                  }`}>
                    {result.verdict}
                  </span>
                </div>
                <p className="text-slate-400 font-light text-center max-w-md">{result.verdict_reason}</p>
              </div>
            </motion.div>

            {/* Magazine Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Financial Status */}
              <ResultCard title="Financial Landscape" icon={DollarSign} className="md:col-span-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Local Salary</p>
                    <p className="text-3xl font-display">{result.salary_local}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Avg. Rent (1BR)</p>
                    <p className="text-3xl font-display">{result.rent}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Left After Basics</p>
                    <p className="text-3xl font-display text-accent-blue">{result.leftover}</p>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-full text-xs font-display font-bold uppercase tracking-widest ${
                    result.cost_vs_home === 'cheaper' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {result.cost_vs_home}
                  </div>
                  <p className="text-sm text-slate-400">Relative to your current spend in {formData.currentCity}</p>
                </div>
              </ResultCard>

              {/* Commute */}
              <ResultCard title="The Rhythm" icon={Briefcase} className="md:col-span-4">
                <p className="text-xl font-light leading-relaxed mb-4">{result.commute}</p>
                <div className="flex items-center gap-2 text-accent-indigo">
                  <Plane size={16} />
                  <span className="text-xs font-display uppercase tracking-widest">Typical Daily Motion</span>
                </div>
              </ResultCard>

              {/* Daily Routine - Vertical Magazine Style */}
              <div className="md:col-span-4 space-y-6">
                <ResultCard title="A Day in the Life" icon={MoreHorizontal}>
                  <div className="space-y-10 relative">
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-white/5" />
                    {result.daily_routine.map((item, i) => (
                      <div key={i} className="relative pl-8">
                        <div className="absolute left-0 top-1.5 w-4 h-4 bg-accent-blue rounded-full border-4 border-midnight-950 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        <p className="text-xs font-display text-accent-blue mb-1">{item.split(' - ')[0]}</p>
                        <p className="text-slate-200 font-light leading-snug">{item.split(' - ')[1] || item}</p>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              </div>

              {/* Community & Soul */}
              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ResultCard title="Your Tribe" icon={User}>
                  <div className="space-y-6">
                    {result.friend_types.map((type, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-accent-blue/30 font-display text-2xl">0{i + 1}</span>
                        <p className="text-slate-300 font-light">{type}</p>
                      </div>
                    ))}
                  </div>
                </ResultCard>

                <ResultCard title="The Distance" icon={Heart}>
                  <div className="space-y-4 mb-8">
                    <p className="text-xs text-slate-500 uppercase tracking-widest">What you'll miss</p>
                    <div className="flex flex-wrap gap-2">
                      {result.what_they_miss.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-sm text-slate-400">{item}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/10">
                    <p className="text-xs text-rose-400 uppercase tracking-widest mb-1 font-bold">The Hardest Thing</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{result.hardest_thing}</p>
                  </div>
                </ResultCard>

                <ResultCard title="The Serendipity" icon={CheckCircle2} className="sm:col-span-2">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-16 h-16 rounded-full bg-accent-indigo/20 flex items-center justify-center shrink-0">
                      <Send className="text-accent-indigo" />
                    </div>
                    <div>
                      <h4 className="text-xl font-display mb-2">Hidden Perk</h4>
                      <p className="text-slate-400 font-light leading-relaxed">{result.hidden_perk}</p>
                    </div>
                  </div>
                </ResultCard>
              </div>

              {/* Letter from Future Self */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-12 mt-12 overflow-hidden rounded-[3rem] bg-[#fbf9f4] text-slate-900 p-8 md:p-20 relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <div className="w-40 h-40 border-8 border-current rounded-full" />
                </div>
                <div className="max-w-2xl mx-auto">
                  <p className="text-xs font-display tracking-[0.3em] text-slate-400 uppercase mb-12">One year later...</p>
                  <div className="handwritten text-2xl md:text-3xl italic text-slate-800 leading-loose">
                    "{result.letter}"
                  </div>
                  <div className="mt-16 flex items-center gap-4">
                    <div className="w-12 h-[1px] bg-slate-300" />
                    <p className="font-display text-sm uppercase tracking-widest text-slate-400">Your Future Self in {formData.destinationCity}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-6">
              <button onClick={reset} className="btn-primary flex items-center gap-3">
                <RefreshCcw size={18} /> Explore Another Life
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-display font-semibold transition-all flex items-center gap-3"
              >
                <Share2 size={18} /> Share Journey
              </button>
            </div>

            {/* Share Modal */}
            <AnimatePresence>
              {showShareModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-midnight-950/90 backdrop-blur-xl">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="max-w-xl w-full bg-midnight-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative"
                  >
                    <button
                      onClick={() => setShowShareModal(false)}
                      className="absolute top-6 right-6 text-white/50 hover:text-white"
                    >
                      <RefreshCcw size={24} className="rotate-45" />
                    </button>

                    <div className="p-12 text-center bg-gradient-to-br from-accent-blue/10 to-accent-indigo/10">
                      <div className="mb-8 flex justify-center">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${
                          result.verdict === 'yes' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                          result.verdict === 'maybe' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                          'bg-rose-500/10 border-rose-500/20 text-rose-500'
                        }`}>
                          {result.verdict === 'yes' && <CheckCircle2 size={32} />}
                          {result.verdict === 'maybe' && <AlertCircle size={32} />}
                          {result.verdict === 'no' && <AlertCircle size={32} />}
                        </div>
                      </div>
                      <h4 className="text-sm font-display tracking-[0.3em] uppercase text-accent-blue mb-2">Verdict for</h4>
                      <h3 className="text-4xl font-display font-bold mb-6">{formData.destinationCity}</h3>
                      <p className="text-xl font-light italic text-slate-300 mb-8 leading-relaxed">"{result.tagline}"</p>
                      <div className="px-6 py-3 bg-white/5 inline-block rounded-full border border-white/10 text-xs font-display tracking-widest uppercase">
                        what-if-i-moved.there
                      </div>
                    </div>
                    <div className="p-8 bg-midnight-950 flex flex-col gap-4">
                      <p className="text-center text-xs text-slate-500 mb-2">Screenshot this card to share your potential future.</p>
                      <button
                        onClick={() => setShowShareModal(false)}
                        className="w-full py-4 bg-accent-blue text-white rounded-xl font-display font-bold"
                      >
                        Got it
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Decorative Blur Orbs */}
      <div className="glow-bg w-[500px] h-[500px] bg-accent-blue/10 top-0 -left-20" />
      <div className="glow-bg w-[600px] h-[600px] bg-accent-indigo/10 bottom-0 -right-20" />
    </div>
  );
}
