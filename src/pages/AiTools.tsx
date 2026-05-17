import { motion } from "framer-motion";
import { Wand2, Scissors, Music, Type, MessageSquare } from "lucide-react";

export default function AiTools() {
  const tools = [
    { name: "Auto Cut", icon: Scissors, desc: "Automatically remove silences and bad takes from your raw footage." },
    { name: "Trending Sounds", icon: Music, desc: "Discover and apply the best trending audio for your video." },
    { name: "Magic Captions", icon: Type, desc: "Generate dynamic, animated subtitles like a pro editor." },
    { name: "Hook Generator", icon: MessageSquare, desc: "AI-generated scripts to grab attention in the first 3 seconds." },
  ];

  return (
    <div className="pt-20 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-brand-purple/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-brand-purple/50"
        >
          <Wand2 className="w-10 h-10 text-brand-purple" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Editing Tools</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          Supercharge your workflow with our suite of AI-powered local tools. 
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-brand-purple/50 transition-colors cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-start gap-6 text-left">
              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-brand-purple/20 transition-colors">
                <tool.icon className="w-8 h-8 text-brand-purple" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{tool.name}</h3>
                <p className="text-gray-400 leading-relaxed">{tool.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
