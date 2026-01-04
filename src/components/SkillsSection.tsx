import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const skillCategories = [
  {
    name: 'Automation Tools',
    skills: [
      { name: 'N8N', level: 98 },
      { name: 'Cursor', level: 92 },
      { name: 'Lovable', level: 95 },
      { name: 'AntiGravity', level: 88 },
    ],
  },
  {
    name: 'Business Skills',
    skills: [
      { name: 'Sales', level: 90 },
      { name: 'CRM', level: 94 },
      { name: 'Team Management', level: 88 },
      { name: 'Communication', level: 92 },
    ],
  },
  {
    name: 'Technical',
    skills: [
      { name: 'API Integration', level: 95 },
      { name: 'SEO', level: 85 },
      { name: 'Market Analysis', level: 88 },
      { name: 'Process Design', level: 92 },
    ],
  },
];

const SkillsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-display text-sm mb-6">
            SKILLS
          </span>
          <h2 className="section-title mb-4">
            Technical <span className="text-gradient">Expertise</span>
          </h2>
        </motion.div>

        {/* Central hub visualization */}
        <div className="relative max-w-6xl mx-auto">
          {/* Center hub */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full hidden lg:flex items-center justify-center z-10"
            style={{
              background: 'radial-gradient(circle, hsl(190 100% 50% / 0.2) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
              <span className="font-display font-bold text-primary-foreground text-lg">N8N</span>
            </div>
          </motion.div>

          {/* Skill categories in orbit */}
          <div className="grid md:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: categoryIndex * 0.2 }}
                className="card-glow rounded-2xl p-6 border border-border"
              >
                <h3 className="font-display text-lg font-bold text-primary mb-6 text-center">
                  {category.name}
                </h3>

                <div className="space-y-5">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: categoryIndex * 0.2 + skillIndex * 0.1 }}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-foreground font-medium">{skill.name}</span>
                        <span className="text-primary font-display font-bold">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: 'linear-gradient(90deg, hsl(190 100% 50%), hsl(142 76% 50%))',
                          }}
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : {}}
                          transition={{ duration: 1, delay: categoryIndex * 0.2 + skillIndex * 0.1 + 0.5 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Orbiting particles */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 2 === 0 ? 'hsl(190 100% 50%)' : 'hsl(142 76% 50%)',
                  boxShadow: `0 0 10px ${i % 2 === 0 ? 'hsl(190 100% 50% / 0.5)' : 'hsl(142 76% 50% / 0.5)'}`,
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: Math.cos((i * Math.PI * 2) / 8 + Date.now() / 2000) * 200,
                  y: Math.sin((i * Math.PI * 2) / 8 + Date.now() / 2000) * 200,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
