import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UploadCloud, Zap, Shield, CheckCircle, Star } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [dailyAnalyses, setDailyAnalyses] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const storageData = localStorage.getItem('ai_editing_reting_usage');
    if (storageData) {
      try {
        const parsed = JSON.parse(storageData);
        if (parsed.date === today) {
          setDailyAnalyses(parsed.count);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const remaining = Math.max(0, 3 - dailyAnalyses);
  const strokeDashoffset = 282.7 - (remaining / 3) * 282.7;

  return (
    <div className="pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8 text-sm font-medium text-purple-300">
            <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
            <span>100% Local & Private Processing</span>
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 sm:mb-8">
            Rate Your Video.<br />
            <span className="text-gradient">Predict the Viral.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed px-2">
            Upload your reel or shorts. Our browser-based AI analyzes pacing, lighting, audio, and motion to score your video's viral potential instantly—without leaving your device.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 w-full max-w-sm sm:max-w-none mx-auto">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:from-purple-500 hover:to-blue-500 transition-all neon-shadow transform hover:scale-105 text-center"
            >
              Analyze Video Free
            </Link>
            <Link 
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all text-center flex items-center justify-center gap-2"
            >
              Try Demo
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-16 sm:mt-24 p-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent"
        >
          <div className="glass-panel aspect-[4/3] sm:aspect-video rounded-xl flex flex-col items-center justify-center p-6 sm:p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80" 
              alt="Dashboard Preview" 
              className="absolute inset-0 object-cover w-full h-full opacity-50 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-20 text-center">
              <div className="w-20 h-20 rounded-full bg-brand-purple/20 border border-brand-purple/50 flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                <UploadCloud className="w-10 h-10 text-brand-purple" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Drop your video here</h3>
              <p className="text-gray-300">Supports MP4, WebM up to 500MB</p>
            </div>
          </div>
        </motion.div>

        {/* Features Sector */}
        <div className="mt-20 sm:mt-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-left">
          {[
            {
              icon: Zap,
              title: "Instant Scoring",
              desc: "Get instant scores for Hook, Editing, Audio, and Viral Potential in seconds using browser-side processing."
            },
            {
               icon: Shield,
               title: "100% Private",
               desc: "No server uploads. Your video is analyzed directly in your browser using local canvas and audio APIs."
            },
            {
               icon: Star,
               title: "Actionable Feedback",
               desc: "Receive smart tips on how to improve your reel's pacing, lighting, or audio before you post."
            }
          ].map((feature, i) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-panel p-8 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <feature.icon className="w-10 h-10 text-brand-blue mb-6" />
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Credit System */}
        <div className="mt-20 sm:mt-40">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Daily Upload Limits</h2>
          <div className="glass-panel max-w-3xl mx-auto p-6 sm:p-10 rounded-2xl flex flex-col md:flex-row items-center gap-6 sm:gap-8 text-center md:text-left border border-white/10">
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                <circle cx="50" cy="50" r="45" stroke="#a855f7" strokeWidth="8" fill="transparent" strokeDasharray="282.7" strokeDashoffset={strokeDashoffset} className="drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{remaining}</span>
                <span className="text-xs text-brand-purple font-medium">/ 3</span>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Free Daily Credits</h3>
              <p className="text-gray-400 mb-6">
                Every user gets <strong className="text-white">3 free video analyses</strong> per day. The limit resets at midnight.
              </p>
              <Link 
                to="/pro"
                className="inline-flex px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold transition-colors"
              >
                Use Your Credits
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
