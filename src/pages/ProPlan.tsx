import { motion } from "framer-motion";
import { CheckCircle, Star } from "lucide-react";
import { useState } from "react";

export default function ProPlan() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="pt-20 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-brand-purple/30 bg-brand-purple/10 mb-6 text-sm font-medium text-purple-300">
          <Star className="w-4 h-4 text-brand-purple" />
          <span>Go Pro</span>
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Unlock Unlimited Analytics
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Upgrade to the Pro Plan for unlimited video analyses, advanced insights, and detailed AI feedback.
        </p>

        <div className="flex items-center justify-center space-x-4 mb-12">
          <span className={`text-sm font-medium ${!isAnnual ? "text-white" : "text-gray-400"}`}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 rounded-full bg-white/10 relative border border-white/20 transition-colors"
          >
            <div className={`w-6 h-6 rounded-full bg-brand-purple absolute top-1 transition-transform ${isAnnual ? "translate-x-7" : "translate-x-1"}`} />
          </button>
          <span className={`text-sm font-medium flex items-center ${isAnnual ? "text-white" : "text-gray-400"}`}>
            Annually <span className="ml-2 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">Save 20%</span>
          </span>
        </div>

        <div className="max-w-md mx-auto">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-brand-purple/50 relative overflow-hidden text-left">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-purple to-brand-blue" />
            
            <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
            <p className="text-gray-400 mb-6">For serious creators & editors.</p>
            
            <div className="mb-8">
              <span className="text-5xl font-extrabold tracking-tight">
                {isAnnual ? "₹799" : "₹999"}
              </span>
              <span className="text-gray-500 font-medium">/mo</span>
              {isAnnual && <p className="text-sm text-gray-400 mt-2">Billed ₹9,588 yearly</p>}
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Unlimited daily video analyses",
                "Advanced audience retention graphs",
                "Detailed scene-by-scene breakdown",
                "No watermarks on PDF reports",
                "Priority email support"
              ].map(feature => (
                 <li key={feature} className="flex items-start text-gray-300">
                   <CheckCircle className="w-5 h-5 text-brand-purple mr-3 shrink-0 mt-0.5" /> 
                   <span>{feature}</span>
                 </li>
              ))}
            </ul>

            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:opacity-90 neon-shadow transition-all hover:scale-[1.02]">
              Subscribe Now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
