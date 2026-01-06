import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, TrendingUp, Clock, Zap } from 'lucide-react';
import { usePortfolioItems } from '@/hooks/usePortfolioItems';

// Fallback static projects when no dynamic data
const staticProjects = [
  {
    title: 'Voice AI Customer Service',
    slug: 'voice-ai-customer-service',
    description: 'N8N-powered voice automation using VAPI and Elevenlabs for 24/7 customer support.',
    metrics: { timeSaved: '85%', leads: '500+', roi: '4x' },
    tags: ['N8N', 'VAPI', 'Elevenlabs'],
    gradient: 'from-primary to-cyan-400',
  },
  {
    title: 'Retell AI Sales Agent',
    slug: 'retell-ai-sales-agent',
    description: 'Conversational AI agent handling lead qualification and appointment scheduling.',
    metrics: { timeSaved: '90%', leads: '1000+', roi: '6x' },
    tags: ['Retell', 'GoHighLevel', 'Python'],
    gradient: 'from-orange-500 to-accent',
  },
  {
    title: 'Database Automation Suite',
    slug: 'database-automation-suite',
    description: 'Supabase and Postgres integration for real-time data sync across platforms.',
    metrics: { timeSaved: '70%', leads: '300+', roi: '5x' },
    tags: ['Supabase', 'Postgres', 'N8N'],
    gradient: 'from-accent to-emerald-400',
  },
  {
    title: 'Make.com Marketing Hub',
    slug: 'make-marketing-hub',
    description: 'No-code marketing automation combining Make.com with Python custom scripts.',
    metrics: { timeSaved: '75%', leads: '800+', roi: '7x' },
    tags: ['Make.com', 'Python', 'GoHighLevel'],
    gradient: 'from-purple-500 to-primary',
  },
];

const gradients = [
  'from-primary to-cyan-400',
  'from-orange-500 to-accent',
  'from-accent to-emerald-400',
  'from-purple-500 to-primary',
];

const ProjectsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { items: dynamicItems, isLoading } = usePortfolioItems();

  // Merge dynamic items with static projects, prioritizing dynamic
  const projects = dynamicItems.length > 0 
    ? dynamicItems.map((item, index) => ({
        ...item,
        tags: item.techstack,
        gradient: gradients[index % gradients.length],
      }))
    : staticProjects;

  return (
    <section id="projects" className="py-24 md:py-32 relative overflow-hidden bg-secondary/20">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-display text-sm mb-6">
            PORTFOLIO
          </span>
          <h2 className="section-title mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real automation solutions that delivered measurable results
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.slice(0, 4).map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link to={`/portfolio/${project.slug}`} className="block">
                <div className="relative h-full rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500">
                  {/* Gradient background */}
                  <div
                    className={`absolute inset-0 opacity-10 bg-gradient-to-br ${project.gradient}`}
                  />

                  {/* Content */}
                  <div className="relative p-8 card-glow h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <h3 className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        className="p-2 rounded-lg bg-primary/10 text-primary"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </motion.div>
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 rounded-lg bg-background/50">
                        <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                        <div className="font-display font-bold text-primary">{project.metrics.timeSaved}</div>
                        <div className="text-xs text-muted-foreground">Time Saved</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-background/50">
                        <TrendingUp className="w-5 h-5 text-accent mx-auto mb-1" />
                        <div className="font-display font-bold text-accent">{project.metrics.leads}</div>
                        <div className="text-xs text-muted-foreground">Leads/Month</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-background/50">
                        <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
                        <div className="font-display font-bold text-primary">{project.metrics.roi}</div>
                        <div className="text-xs text-muted-foreground">ROI</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Animated nodes */}
                    <motion.div
                      className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary"
                      animate={hoveredIndex === index ? { scale: [1, 1.5, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{ boxShadow: '0 0 10px hsl(190 100% 50% / 0.5)' }}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
