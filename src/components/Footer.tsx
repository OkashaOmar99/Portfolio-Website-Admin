import { motion } from 'framer-motion';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Github, Linkedin, Mail, Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
    const { getSetting } = useSiteSettings();
    const ownerName = getSetting('owner_name') || "Okasha Omar"; // Capitalized for text content
    // For the logo part, maybe uppercase just the first name or full name? 
    // The previous design had just "OKASHA". Let's use first name uppercase.
    const logoName = (ownerName.split(' ')[0] || "OKASHA").toUpperCase();
    
    const linkedinUrl = getSetting('linkedin_url');
    const twitterUrl = getSetting('twitter_url');
    const githubUrl = getSetting('github_url');
    const instagramUrl = getSetting('instagram_url');
    const facebookUrl = getSetting('facebook_url');
    const email = getSetting('email');

  return (
    <footer className="py-8 border-t border-border relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="font-display text-xl font-bold text-gradient">{logoName}</span>
          </motion.div>

          <motion.p
            className="text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            © {new Date().getFullYear()} {ownerName}. Crafted with passion for automation.
          </motion.p>

          <motion.div
            className="flex items-center gap-4 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    <Linkedin size={20} />
                </a>
            )}
            {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    <Github size={20} />
                </a>
            )}
            {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    <Twitter size={20} />
                </a>
            )}
            {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    <Instagram size={20} />
                </a>
            )}
            {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    <Facebook size={20} />
                </a>
            )}
             {email && (
                <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                    <Mail size={20} />
                </a>
            )}
            
            <div className="flex items-center gap-2 ml-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Available for projects</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative line */}

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </footer>
  );
};

export default Footer;
