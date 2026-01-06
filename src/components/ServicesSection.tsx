import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Workflow, Mic, BarChart3, Database, Bot, Volume2 } from 'lucide-react';

const services = [
  {
    icon: Workflow,
    title: 'N8N Workflow Automation',
    description: 'Transform repetitive tasks into seamless automated workflows that save time and reduce errors.',
    color: 'primary',
  },
  {
    icon: Mic,
    title: 'Voice AI with VAPI & Elevenlabs',
    description: 'Build intelligent voice agents and text-to-speech solutions for customer interactions.',
    color: 'accent',
  },
  {
    icon: Bot,
    title: 'Conversational AI with Retell',
    description: 'Create smart AI agents that handle customer conversations naturally and efficiently.',
    color: 'primary',
  },
  {
    icon: BarChart3,
    title: 'GoHighLevel Marketing Automation',
    description: 'Automate your marketing with powerful CRM, email campaigns, and lead generation.',
    color: 'accent',
  },
  {
    icon: Database,
    title: 'Database Solutions',
    description: 'Build scalable backends with Supabase, Postgres, and MySQL for robust data management.',
    color: 'primary',
  },
  {
    icon: Workflow,
    title: 'Make.com & Python Scripts',
    description: 'No-code automation with Make.com combined with custom Python scripts for complex logic.',
    color: 'accent',
  },
];

const ServicesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background nodes animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="hsl(190 100% 50%)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-display text-sm mb-6">
            SERVICES
          </span>
          <h2 className="section-title mb-4">
            What I <span className="text-gradient">Offer</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive automation solutions designed to transform your business operations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full card-glow rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-500">
                {/* Icon with animation */}
                <motion.div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                    service.color === 'primary' ? 'bg-primary/10' : 'bg-accent/10'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <service.icon
                    className={`w-8 h-8 ${
                      service.color === 'primary' ? 'text-primary' : 'text-accent'
                    }`}
                  />
                </motion.div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>

                {/* Hover effect line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent rounded-b-2xl"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />

                {/* Node connector dots */}
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-accent/30 group-hover:bg-accent transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection lines between cards (decorative) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible opacity-20">
          <motion.path
            d="M 200 200 Q 400 100 600 200"
            stroke="hsl(190 100% 50%)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 2, delay: 1 }}
          />
        </svg>
      </div>
    </section>
  );
};

export default ServicesSection;
