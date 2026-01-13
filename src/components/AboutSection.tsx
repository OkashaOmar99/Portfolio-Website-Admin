import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Mic, Bot, Settings, Volume2, BarChart3, Database, Code, User } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const skills = [
  { name: 'VAPI', icon: Mic },
  { name: 'Retell', icon: Bot },
  { name: 'Make.com', icon: Settings },
  { name: 'Elevenlabs', icon: Volume2 },
  { name: 'GoHighLevel', icon: BarChart3 },
  { name: 'Supabase', icon: Database },
  { name: 'Python', icon: Code },
  { name: 'N8N', icon: Zap },
];

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { getSetting, isLoading } = useSiteSettings();
  const profileImage = getSetting('profile_image');

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
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Okasha Omar" 
                    className="aspect-square w-full h-full object-cover"
                  />
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-secondary to-card flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      >
                        <User className="w-16 h-16 text-primary-foreground" />
                      </motion.div>
                      <span className="font-display text-xl text-primary">Upload your photo</span>
                    </div>
                  </div>
                )}

                {/* Glitch overlay */}
                <motion.div
                  className="absolute inset-0 bg-primary/10"
                  animate={{ opacity: [0, 0.1, 0] }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                />
              </div>

              {/* Floating skill badges - show first 4 on sides */}
              {skills.slice(0, 4).map((skill, index) => (
                <motion.div
                  key={skill.name}
                  className="absolute skill-orb w-14 h-14 flex flex-col items-center justify-center"
                  style={{
                    top: `${15 + index * 22}%`,
                    left: index % 2 === 0 ? '-16px' : 'auto',
                    right: index % 2 === 1 ? '-16px' : 'auto',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.2 }}
                >
                  <skill.icon className="w-5 h-5 text-primary" />
                  <span className="text-[10px] text-muted-foreground mt-1">{skill.name}</span>
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
                With hands-on experience in <span className="text-primary">VAPI</span> for voice AI, 
                <span className="text-accent"> Retell</span> for conversational agents,
                <span className="text-primary"> Make.com</span> for no-code workflows,
                <span className="text-accent"> Elevenlabs</span> for text-to-speech,
                <span className="text-primary"> GoHighLevel</span> for marketing automation,
                <span className="text-accent"> Supabase</span> for scalable backends,
                <span className="text-primary"> Postgres/MySQL</span> for database handling, and
                <span className="text-accent"> Python</span> for bespoke scripts, I transform 
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
