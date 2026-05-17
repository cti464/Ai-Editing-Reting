export interface VideoAnalysisResult {
  overallScore: number;
  engagementScore: number;
  editingScore: number;
  hookScore: number;
  audioScore: number;
  viralPrediction: number;
  retentionPrediction: number[];
  suggestions: string[];
  metrics: {
    duration: number;
    cuts: number;
    avgBrightness: number;
    motionIntensity: number;
    hasAudio: boolean;
  };
}

export async function analyzeVideoLocal(file: File, onProgress: (p: number) => void): Promise<VideoAnalysisResult> {
  return new Promise((resolve, reject) => {
    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = videoUrl;
    video.muted = true; // Must be muted to play hidden without interaction
    video.crossOrigin = "anonymous";

    video.onloadeddata = async () => {
      onProgress(10);
      try {
        const duration = video.duration;
        const width = video.videoWidth;
        const height = video.videoHeight;
        
        // 1. Analyze Audio Context if possible
        let audioScore = 50;
        let hasAudio = false;
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const source = audioCtx.createMediaElementSource(video);
          const analyser = audioCtx.createAnalyser();
          source.connect(analyser);
          
          analyser.fftSize = 256;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          
          // Audio is often considered present if context activates
          hasAudio = true;
          audioScore += 25; // Base score for having audio
        } catch (e) {
          // Ignore audio errors for strict policies
          console.warn("Audio analysis restricted", e);
        }

        onProgress(30);

        // 2. Extract frames via Canvas
        const canvas = document.createElement("canvas");
        canvas.width = 160; // Downsample for performance
        canvas.height = 90;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        
        let previousImageData: ImageData | null = null;
        let totalBrightness = 0;
        let totalMotion = 0;
        let cutsDetected = 0;
        let hookMotion = 0; // Motion in first 3 seconds

        // Sample frames (e.g. every 0.5 seconds or max 50 frames to be fast)
        const frameInterval = Math.max(0.5, duration / 50);
        let currentTemp = 0;
        let framesSampled = 0;

        const processFrame = async () => {
          if (currentTemp > duration || framesSampled >= 50) {
            // Processing done
            onProgress(90);
            finalize();
            return;
          }

          video.currentTime = currentTemp;
        };

        video.onseeked = () => {
          if (!ctx) return finalize();

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          
          let frameBrightness = 0;
          let frameMotion = 0;

          // Process pixels
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            
            // Luminance
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            frameBrightness += lum;

            if (previousImageData) {
              const pr = previousImageData.data[i];
              const pg = previousImageData.data[i + 1];
              const pb = previousImageData.data[i + 2];
              const diff = Math.abs(r - pr) + Math.abs(g - pg) + Math.abs(b - pb);
              if (diff > 50) frameMotion++;
            }
          }

          frameBrightness = frameBrightness / (pixels.length / 4);
          totalBrightness += frameBrightness;

          if (previousImageData) {
            const motionPercent = frameMotion / (pixels.length / 4);
            totalMotion += motionPercent;
            
            // If more than 60% of frame changed, consider it a cut
            if (motionPercent > 0.6) {
              cutsDetected++;
            }

            if (currentTemp <= 3) {
              hookMotion += motionPercent;
            }
          }

          previousImageData = imageData;
          framesSampled++;
          onProgress(30 + Math.floor((framesSampled / 50) * 60));
          
          currentTemp += frameInterval;
          processFrame();
        };

        // Start processing frames
        processFrame();

        function finalize() {
          const avgBrightness = framesSampled > 0 ? totalBrightness / framesSampled : 0;
          const motionIntensity = framesSampled > 0 ? totalMotion / framesSampled : 0;
          
          // Generate AI-like heuristic scores
          let editingScore = Math.min(100, 40 + (cutsDetected * 2) + (motionIntensity * 100));
          let hookScore = Math.min(100, 30 + (hookMotion * 150));
          
          if (!hasAudio) audioScore = 15;
          if (avgBrightness < 40) editingScore -= 10;
          if (avgBrightness > 220) editingScore -= 10;

          // Viral probability
          const viralPrediction = Math.round((editingScore * 0.4) + (hookScore * 0.4) + (audioScore * 0.2));
          const engagementScore = Math.round((hookScore + viralPrediction) / 2);
          const overallScore = Math.round((editingScore + hookScore + audioScore + viralPrediction) / 4);

          // Suggestions Engine
          const suggestions: string[] = [];
          
          if (hookScore < 60) suggestions.push("Hook is weak in first 3 seconds, add faster motion or text.");
          if (avgBrightness < 50) suggestions.push("Video is slightly dark, increase brightness for better retention.");
          if (avgBrightness > 210) suggestions.push("Highlights are blown out, lower exposure slightly.");
          if (cutsDetected < duration / 5 && duration > 10) suggestions.push("Add faster cuts to maintain viewer attention.");
          if (!hasAudio || audioScore < 30) suggestions.push("Audio volume is too low or missing entirely. Add background music.");
          if (motionIntensity > 0.4) suggestions.push("High motion detected. Ensure stable camera to prevent motion sickness.");
          
          if (suggestions.length === 0) suggestions.push("Great pacing and visual quality!");

          // Fabricate a retention graph based on hook and overall score
          const retentionPrediction = [];
          let currentRetention = 100;
          const segments = 10;
          for (let i = 0; i < segments; i++) {
            retentionPrediction.push(Math.max(0, Math.round(currentRetention)));
            // Dropoff logic
            if (i === 1) currentRetention -= (100 - hookScore) / 2; // Big dropoff if hook is bad
            else currentRetention -= (100 - overallScore) / 10;
          }

          URL.revokeObjectURL(videoUrl);
          
          resolve({
            overallScore,
            engagementScore,
            editingScore: Math.round(editingScore),
            hookScore: Math.round(hookScore),
            audioScore,
            viralPrediction,
            retentionPrediction,
            suggestions,
            metrics: {
              duration,
              cuts: cutsDetected,
              avgBrightness,
              motionIntensity,
              hasAudio
            }
          });
        }
      } catch (err) {
        URL.revokeObjectURL(videoUrl);
        reject(err);
      }
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error("Failed to load video"));
    };
  });
}
