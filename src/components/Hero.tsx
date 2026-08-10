import React from 'react';
import { motion } from 'framer-motion';

const snowParticles = Array.from({ length: 44 }, (_, i) => ({
  left: 2 + ((i * 13) % 96),
  delay: (i % 12) * 0.42,
  duration: 8 + (i % 6) * 1.1,
  size: 2 + (i % 4),
  drift: -18 + (i % 9) * 5,
  opacity: 0.34 + (i % 5) * 0.08,
}));

const leafDrops = Array.from({ length: 16 }, (_, i) => ({
  left: 4 + ((i * 19) % 92),
  delay: (i % 8) * 1.15,
  duration: 9 + (i % 5) * 1.4,
  size: 12 + (i % 5) * 3,
  drift: -30 + (i % 7) * 12,
  rotation: 140 + (i % 6) * 55,
}));

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center">
      <style>{`
        @keyframes emorevColorCycle {
          0%, 18% {
            background-image: linear-gradient(90deg, #ff1f3d, #ff6a00, #ff1f3d);
            text-shadow: 0 0 18px rgba(239, 68, 68, 0.72), 0 0 44px rgba(239, 68, 68, 0.36);
          }
          20%, 38% {
            background-image: linear-gradient(90deg, #1d4ed8, #38bdf8, #2563eb);
            text-shadow: 0 0 18px rgba(59, 130, 246, 0.72), 0 0 44px rgba(56, 189, 248, 0.34);
          }
          40%, 58% {
            background-image: linear-gradient(90deg, #f59e0b, #fde047, #f97316);
            text-shadow: 0 0 18px rgba(250, 204, 21, 0.65), 0 0 44px rgba(245, 158, 11, 0.32);
          }
          60%, 78% {
            background-image: linear-gradient(90deg, #7c3aed, #c084fc, #9333ea);
            text-shadow: 0 0 18px rgba(168, 85, 247, 0.7), 0 0 44px rgba(192, 132, 252, 0.34);
          }
          80%, 98% {
            background-image: linear-gradient(90deg, #db2777, #fb7185, #ec4899);
            text-shadow: 0 0 18px rgba(236, 72, 153, 0.72), 0 0 44px rgba(251, 113, 133, 0.34);
          }
          100% {
            background-image: linear-gradient(90deg, #ff1f3d, #ff6a00, #ff1f3d);
            text-shadow: 0 0 18px rgba(239, 68, 68, 0.72), 0 0 44px rgba(239, 68, 68, 0.36);
          }
        }

        @keyframes snowParticleFall {
          0% { transform: translate3d(0, -12vh, 0); opacity: 0; }
          12% { opacity: var(--snow-opacity); }
          88% { opacity: var(--snow-opacity); }
          100% { transform: translate3d(var(--snow-drift), 108vh, 0); opacity: 0; }
        }

        @keyframes leafDrop {
          0% { transform: translate3d(0, -14vh, 0) rotate(0deg); opacity: 0; }
          12% { opacity: 0.82; }
          45% { transform: translate3d(calc(var(--leaf-drift) * 0.42), 43vh, 0) rotate(calc(var(--leaf-rotation) * 0.42)); }
          100% { transform: translate3d(var(--leaf-drift), 108vh, 0) rotate(var(--leaf-rotation)); opacity: 0; }
        }

        .emorev-cycle {
          animation: emorevColorCycle 50s ease-in-out infinite;
          background-size: 220% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .snow-particle {
          animation-name: snowParticleFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }

        .leaf-drop {
          animation-name: leafDrop;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden">
        <div
          className="hero-waterfall-bg absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/27623550/pexels-photo-27623550.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/34 to-black/78" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_18%_20%,rgba(249,115,22,0.18),transparent_28%),radial-gradient(circle_at_84%_32%,rgba(239,68,68,0.14),transparent_30%)]" />

        <div className="absolute inset-0 pointer-events-none">
          {snowParticles.map((particle, i) => (
            <span
              key={i}
              className="snow-particle absolute top-0 rounded-full bg-white/80 blur-[0.5px]"
              style={{
                left: `${particle.left}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                ['--snow-drift' as string]: `${particle.drift}px`,
                ['--snow-opacity' as string]: particle.opacity,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {leafDrops.map((leaf, i) => (
            <span
              key={i}
              className="leaf-drop absolute top-0 block bg-gradient-to-br from-amber-300 via-orange-500 to-red-800 shadow-lg shadow-orange-900/20"
              style={{
                left: `${leaf.left}%`,
                width: `${leaf.size}px`,
                height: `${leaf.size * 0.72}px`,
                borderRadius: '80% 8% 80% 8%',
                animationDelay: `${leaf.delay}s`,
                animationDuration: `${leaf.duration}s`,
                ['--leaf-drift' as string]: `${leaf.drift}px`,
                ['--leaf-rotation' as string]: `${leaf.rotation}deg`,
              }}
            />
          ))}
        </div>

        <div className="absolute left-[-10%] right-[-10%] bottom-0 h-52 bg-gradient-to-t from-white/14 via-white/7 to-transparent blur-2xl" />
      </div>

      <div className="relative z-10 w-full px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="mx-auto max-w-5xl"
        >
          <motion.p
            className="mb-5 text-xs md:text-sm tracking-[0.45em] uppercase text-orange-300/90 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            Premium fashion in motion
          </motion.p>

          <motion.h1
            className="relative text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.08em] leading-[0.92]"
            style={{ fontFamily: "'Orbitron', 'Arial Black', sans-serif" }}
            initial={{ opacity: 0, scale: 0.82, filter: 'blur(18px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
          >
            <span className="emorev-cycle inline-block">EMOREV</span>
            <span className="mt-2 block text-white drop-shadow-[0_0_26px_rgba(255,255,255,0.32)] md:mt-3">
              STORE
            </span>
          </motion.h1>

          <motion.div
            className="mx-auto mt-7 h-px max-w-xl bg-gradient-to-r from-transparent via-orange-400/80 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.9, ease: 'easeOut' }}
          />

          <motion.p
            className="mx-auto mt-7 max-w-2xl text-sm md:text-lg leading-relaxed text-gray-200/90"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            Luxury fashion with a calm, cinematic waterfall backdrop and a bold EMOREV color cycle.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.75 }}
          >
            <motion.button
              className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full text-sm tracking-wider uppercase hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/30"
              whileHover={{ scale: 1.05, boxShadow: '0 0 42px rgba(249, 115, 22, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('store')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Now
            </motion.button>
            <motion.button
              className="px-10 py-4 border border-orange-500/60 text-orange-300 font-bold rounded-full text-sm tracking-wider uppercase hover:bg-orange-500/10 transition-all backdrop-blur-sm"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(249, 115, 22, 0.28)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('sale')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Sale
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-12 border-2 border-orange-500/50 rounded-full flex justify-center backdrop-blur-sm">
          <motion.div
            className="w-1.5 h-4 bg-gradient-to-b from-orange-400 to-red-500 rounded-full mt-2"
            animate={{ y: [0, 14, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ boxShadow: '0 0 10px rgba(249, 115, 22, 0.6)' }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;