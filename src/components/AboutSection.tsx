import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Target, Rocket, Code } from 'lucide-react';

const skills = [
  { name: 'N8N', icon: Zap },
  { name: 'Cursor', icon: Code },
  { name: 'Lovable', icon: Rocket },
  { name: 'AntiGravity', icon: Target },
];

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, hsl(190 100% 50% / 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, hsl(142 76% 50% / 0.1) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image with glitch effect */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Glowing border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-20 blur-xl" />
              
              {/* Main image container */}
              <div className="relative rounded-2xl overflow-hidden border border-primary/30 card-glow">
                <div className="aspect-square bg-gradient-to-br from-secondary to-card flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <span className="font-display text-4xl font-bold text-primary-foreground">
                        O
                      </span>
                    </motion.div>
                    <span className="font-display text-xl text-primary">Okasha Omar</span>
                  </div>
                </div>

                {/* Glitch overlay */}
                <motion.div
                  className="absolute inset-0 bg-primary/10"
                  animate={{ opacity: [0, 0.1, 0] }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                />
              </div>

              {/* Floating skill badges */}
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  className="absolute skill-orb w-16 h-16 flex flex-col items-center justify-center"
                  style={{
                    top: `${20 + index * 20}%`,
                    left: index % 2 === 0 ? '-20px' : 'auto',
                    right: index % 2 === 1 ? '-20px' : 'auto',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.2 }}
                >
                  <skill.icon className="w-6 h-6 text-primary" />
                  <span className="text-xs text-muted-foreground mt-1">{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-display text-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              ABOUT ME
            </motion.span>

            <h2 className="section-title mb-6">
              Transforming Ideas into
              <span className="text-gradient"> Automated Reality</span>
            </h2>

            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                As a seasoned <span className="text-primary font-semibold">N8N Automation Specialist</span>, 
                I excel in creating custom automations that integrate apps seamlessly. My passion lies 
                in turning manual, time-consuming processes into efficient, automated workflows.
              </p>
              <p>
                With hands-on experience in <span className="text-primary">Cursor</span> for AI-assisted coding, 
                <span className="text-accent"> Lovable</span> for rapid prototyping, and 
                <span className="text-primary"> AntiGravity</span> for advanced simulations, I transform 
                complex business challenges into elegant automated solutions.
              </p>
            </div>

            {/* Philosophy cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { title: 'Innovation', desc: 'Pushing boundaries' },
                { title: 'Efficiency', desc: 'Saving time & cost' },
                { title: 'Value', desc: 'Client-focused' },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="p-4 rounded-xl card-glow text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <h4 className="font-display text-primary font-bold">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
