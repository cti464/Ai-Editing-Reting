import { useState, useRef, useEffect } from "react";
import { analyzeVideoLocal, VideoAnalysisResult } from "../lib/analyzer";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileVideo, Activity, Info, Sparkles, Check, ChevronRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VideoAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dailyAnalyses, setDailyAnalyses] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const storageData = localStorage.getItem('ai_editing_reting_usage');
    if (storageData) {
      try {
        const parsed = JSON.parse(storageData);
        if (parsed.date === today) {
          setDailyAnalyses(parsed.count);
        } else {
          localStorage.setItem('ai_editing_reting_usage', JSON.stringify({ date: today, count: 0 }));
          setDailyAnalyses(0);
        }
      } catch (e) {
        localStorage.setItem('ai_editing_reting_usage', JSON.stringify({ date: today, count: 0 }));
      }
    } else {
      localStorage.setItem('ai_editing_reting_usage', JSON.stringify({ date: today, count: 0 }));
    }

    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const handleFileChange = async (e: any) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (dailyAnalyses >= 3) {
        setError("You have reached your daily limit of 3 video analyses. Please try again tomorrow.");
        return;
      }
      if (!selectedFile.type.startsWith("video/")) {
        setError("Please upload a valid video file.");
        return;
      }
      setFile(selectedFile);
      setVideoUrl(URL.createObjectURL(selectedFile));
      setError(null);
      setResult(null);
      startAnalysis(selectedFile);
    }
  };

  const startAnalysis = async (selectedFile: File) => {
    setIsAnalyzing(true);
    setProgress(0);
    try {
      const today = new Date().toDateString();
      const newCount = dailyAnalyses + 1;
      localStorage.setItem('ai_editing_reting_usage', JSON.stringify({ date: today, count: newCount }));
      setDailyAnalyses(newCount);

      const res = await analyzeVideoLocal(selectedFile, (p) => setProgress(p));
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to analyze video");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleShare = async () => {
    const text = `I just analyzed my video and got a Viral Score of ${result?.viralPrediction}% on Ai Editing Reting! Try it out here: ${window.location.origin}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ai Editing Reting',
          text: text,
          url: window.location.origin,
        });
      } catch (err) {
        // Fallback copying to clipboard if share dialog is cancelled or fails
        try {
          await navigator.clipboard.writeText(text);
          setToastMsg("Score and link copied to clipboard!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        } catch (e) {}
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setToastMsg("Score and link copied to clipboard!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (e) {}
    }
  };

  const ScoreCircle = ({ score, label, color = "from-purple-500 to-blue-500" }: { score: number, label: string, color?: string }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
            <motion.circle
              cx="50" cy="50" r="45"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] stroke-linecap-round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{Math.round(score)}</span>
            <span className="text-xs text-brand-purple font-medium">/ 100</span>
          </div>
        </div>
        <p className="mt-4 font-semibold text-gray-300">{label}</p>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-safe-offset-10 bottom-24 left-1/2 z-50 px-6 py-3 rounded-full bg-brand-purple text-white font-medium shadow-[0_0_20px_rgba(168,85,247,0.4)] whitespace-nowrap"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel max-w-2xl mx-auto mt-10 sm:mt-20 rounded-3xl p-8 sm:p-12 text-center border-dashed border-2 border-white/20 hover:border-brand-purple/50 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer.files?.[0];
            if (droppedFile) {
              if (dailyAnalyses >= 3) {
                setError("You have reached your daily limit of 3 video analyses. Please try again tomorrow.");
                return;
              }
              if (droppedFile.type.startsWith("video/")) {
                setFile(droppedFile);
                setVideoUrl(URL.createObjectURL(droppedFile));
                setError(null);
                startAnalysis(droppedFile);
              } else {
                setError("Please upload a valid video file.");
              }
            }
          }}
        >
          <div className="w-24 h-24 mx-auto bg-brand-purple/10 rounded-full flex items-center justify-center mb-6">
            <Upload className="w-10 h-10 text-brand-purple" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Upload Video for Analysis</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            Drag and drop your MP4, WebM, or MOV file, or click to browse. Max size 500MB. Processed entirely locally.
          </p>
          <input
            type="file"
            accept="video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-all inline-flex items-center space-x-2"
          >
            <FileVideo className="w-5 h-5" />
            <span>Select Video</span>
          </button>
          
          {error && <p className="mt-6 text-red-400 text-sm font-medium">{error}</p>}
        </motion.div>
      )}

      {isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-xl mx-auto mt-16 sm:mt-32 text-center"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8 relative">
            <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
            <motion.div 
              className="absolute inset-0 border-4 border-brand-purple rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <Activity className="absolute inset-0 m-auto text-brand-blue w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Analyzing your video...</h2>
          <p className="text-gray-400 mb-8">Computing editing pace, audio metrics, and hook strength using local neural heuristics.</p>
          
          <div className="h-2 bg-white/10 rounded-full overflow-hidden w-full max-w-md mx-auto">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>
          <p className="mt-3 text-sm text-gray-500 font-mono">{Math.round(progress)}% Complete</p>
        </motion.div>
      )}

      {result && videoUrl && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Main Video & Score Panel */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="glass-panel rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center gap-6 sm:gap-8 shadow-2xl shadow-brand-purple/10">
              <div className="w-full md:w-1/2 aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-inner max-h-[400px] flex justify-center">
                <video src={videoUrl} controls className="h-full w-auto object-contain bg-black" />
              </div>
              <div className="w-full md:w-1/2 flex flex-col items-center justify-center py-6">
                 <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Viral Potential Score</h2>
                 <ScoreCircle score={result.viralPrediction} label="Viral Probability %" />
                 <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                    <button onClick={() => { setResult(null); setFile(null); }} className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 font-medium transition-colors">
                      Upload New
                    </button>
                    <button onClick={handleShare} className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue font-bold shadow-lg hover:opacity-90 flex items-center justify-center gap-2">
                       <Upload className="w-4 h-4" /> Share
                    </button>
                 </div>
              </div>
            </div>

            {/* Sub Scores */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Engagement", score: result.engagementScore },
                { label: "Editing", score: result.editingScore },
                { label: "Hook (0-3s)", score: result.hookScore },
                { label: "Audio", score: result.audioScore },
              ].map((item, i) => (
                <div key={i} className="glass-panel p-4 sm:p-5 rounded-xl flex flex-col items-center justify-center group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-3xl sm:text-4xl font-black text-white mb-1 sm:mb-2">{item.score}</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-400 text-center">{item.label}</span>
                  <div className="w-full h-1 bg-white/10 rounded-full mt-3 sm:mt-4 overflow-hidden">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${item.score}%` }}
                       className={`h-full ${item.score > 70 ? 'bg-green-500' : item.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Predicted Audience Retention</h3>
                <Sparkles className="w-5 h-5 text-brand-purple" />
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.retentionPrediction.map((val, i) => ({ time: `${i * 10}%`, retention: val }))}>
                    <defs>
                      <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="retention" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorRetention)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Panel: Feedback & Suggestions */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border-brand-purple/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Activity className="w-32 h-32 text-brand-purple" />
              </div>
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Info className="w-5 h-5 mr-2 text-brand-purple" />
                AI Report & Suggestions
              </h3>
              
              <ul className="space-y-4 relative z-10">
                {result.suggestions.map((sug, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-start bg-white/5 p-4 rounded-xl"
                  >
                    <div className="mt-0.5 bg-brand-purple/20 p-1 rounded-full mr-3 shrink-0">
                      <ChevronRight className="w-4 h-4 text-brand-purple" />
                    </div>
                    <span className="text-gray-200 leading-snug text-sm">{sug}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-4">Raw Extracted Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Duration</span>
                  <span className="font-mono text-white">{result.metrics.duration.toFixed(1)}s</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Detected Scene Cuts</span>
                  <span className="font-mono text-white">{result.metrics.cuts}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Avg Brightness</span>
                  <span className="font-mono text-white">{Math.round(result.metrics.avgBrightness)} / 255</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Motion Intensity (0-1)</span>
                  <span className="font-mono text-white">{result.metrics.motionIntensity.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Audio Track</span>
                  <span className="font-mono text-white">{result.metrics.hasAudio ? "Detected" : "Silent/None"}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
