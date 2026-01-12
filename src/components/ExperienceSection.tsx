import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Briefcase, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { useExperiences } from '@/hooks/useExperiences';

const ExperienceSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const { experiences, isLoading } = useExperiences();

  if (isLoading) {
    return (
      <section id="experience" className="py-24 md:py-32 relative overflow-hidden bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-display text-sm mb-6">
              EXPERIENCE
            </span>
            <h2 className="section-title">
              Professional <span className="text-gradient">Journey</span>
            </h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-glow rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-secondary/50 rounded w-1/3 mb-2" />
                <div className="h-4 bg-secondary/50 rounded w-1/4 mb-4" />
                <div className="h-3 bg-secondary/50 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-24 md:py-32 relative overflow-hidden bg-secondary/20">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-display text-sm mb-6">
            EXPERIENCE
          </span>
          <h2 className="section-title">
            Professional <span className="text-gradient">Journey</span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative pl-8 pb-12 last:pb-0"
            >
              {/* Timeline line */}
              {index < experiences.length - 1 && (
                <div className="timeline-line" />
              )}

              {/* Timeline node */}
              <motion.div
                className="timeline-node absolute left-0 top-1"
                whileHover={{ scale: 1.5 }}
                animate={expandedIndex === index ? { scale: 1.3 } : {}}
              />

              {/* Content card */}
              <motion.div
                className={`card-glow rounded-xl p-6 cursor-pointer transition-all duration-300 border ${
                  expandedIndex === index ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                whileHover={{ x: 10 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">{exp.title}</h3>
                    <p className="text-primary font-medium flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {exp.company}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {exp.location}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs">
                      {exp.type}
                    </span>
                  </div>
                </div>

                {/* Expandable content */}
                <motion.div
                  initial={false}
                  animate={{ height: expandedIndex === index ? 'auto' : 0, opacity: expandedIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-muted-foreground mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-2 mt-4 text-primary text-sm"
                  animate={{ opacity: expandedIndex === index ? 0 : 1 }}
                >
                  <span>View details</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
