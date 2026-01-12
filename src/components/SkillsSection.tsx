import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useSkills } from '@/hooks/useSkills';

const SkillsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { getSkillsByCategory, isLoading } = useSkills();

  const skillCategories = getSkillsByCategory();
  const categoryNames = Object.keys(skillCategories);

  if (isLoading) {
    return (
      <section id="skills" className="py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-display text-sm mb-6">
              SKILLS
            </span>
            <h2 className="section-title mb-4">
              Technical <span className="text-gradient">Expertise</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-glow rounded-2xl p-6 border border-border animate-pulse">
                <div className="h-6 bg-secondary/50 rounded w-1/2 mx-auto mb-6" />
                <div className="space-y-5">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j}>
                      <div className="h-4 bg-secondary/50 rounded w-3/4 mb-2" />
                      <div className="h-2 bg-secondary/50 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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

        {/* Skills grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categoryNames.map((categoryName, categoryIndex) => (
            <motion.div
              key={categoryName}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.2 }}
              className="card-glow rounded-2xl p-6 border border-border"
            >
              <h3 className="font-display text-lg font-bold text-primary mb-6 text-center">
                {categoryName}
              </h3>

              <div className="space-y-5">
                {skillCategories[categoryName].map((skill, skillIndex) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: categoryIndex * 0.2 + skillIndex * 0.1 }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-foreground font-medium">{skill.name}</span>
                      <span className="text-primary font-display font-bold">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: categoryIndex * 0.2 + skillIndex * 0.1 + 0.5 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
