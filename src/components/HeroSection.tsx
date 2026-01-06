import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ParticleField from './ParticleField';

const stats = [
  { value: '2+', label: 'Years N8N' },
  { value: '100+', label: 'Workflows Built' },
  { value: '50+', label: 'Happy Clients' },
];

const HeroSection = () => {
  const titleChars = "OKASHA OMAR".split('');

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleField />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated title */}
          <motion.div className="mb-6 overflow-hidden">
            <motion.div className="flex justify-center flex-wrap gap-2 md:gap-4">
              {titleChars.map((char, index) => (
                <motion.span
                  key={index}
                  className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-gradient inline-block"
                  initial={{ y: 100, opacity: 0, rotateX: -90 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.05,
                    ease: [0.6, -0.05, 0.01, 0.99],
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Subtitle with typing effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="font-display text-lg sm:text-xl md:text-2xl text-primary glow-text mb-4">
              N8N AUTOMATION SPECIALIST
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Mastering N8N Automation: Turning Chaos into Seamless Workflows with{' '}
              <span className="text-primary">VAPI</span>,{' '}
              <span className="text-accent">Retell</span>,{' '}
              <span className="text-primary">Make.com</span>,{' '}
              <span className="text-accent">Elevenlabs</span>,{' '}
              <span className="text-primary">GoHighLevel</span>,{' '}
              <span className="text-accent">Supabase</span>,{' '}
              <span className="text-primary">Postgres/MySQL</span>, and{' '}
              <span className="text-accent">Python</span> Expertise.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex justify-center gap-8 md:gap-16 mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <div className="font-display text-3xl md:text-4xl font-bold text-primary glow-text">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              href="#contact"
              className="hero-button group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Automate Your Business
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.a>

            <motion.a
              href="#projects"
              className="px-8 py-4 font-display font-bold text-lg rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300"
              whileHover={{ scale: 1.05, borderColor: 'hsl(190 100% 50%)' }}
              whileTap={{ scale: 0.95 }}
            >
              View My Work
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
          <ChevronDown size={32} />
        </a>
      </motion.div>

      {/* Decorative node connectors */}
      <div className="absolute top-1/4 left-10 w-3 h-3 rounded-full bg-primary glow-primary animate-pulse" />
      <div className="absolute top-1/3 right-16 w-2 h-2 rounded-full bg-accent glow-accent animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-4 h-4 rounded-full bg-primary/50 glow-primary animate-float" />
    </section>
  );
};

export default HeroSection;
