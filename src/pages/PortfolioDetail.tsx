import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, TrendingUp, Zap, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortfolioItem } from '@/hooks/usePortfolioItems';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PortfolioDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Error fetching portfolio item:', error);
      } else if (data) {
        setItem({
          ...data,
          metrics: data.metrics as PortfolioItem['metrics']
        });
      }
      setIsLoading(false);
    };

    fetchItem();
  }, [slug]);

  const titleChars = item?.title.split('') || [];

  const nextImage = () => {
    if (item) {
      setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
    }
  };

  const prevImage = () => {
    if (item) {
      setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="font-display text-4xl font-bold text-foreground mb-4">
          Project Not Found
        </h1>
        <Link to="/#projects" className="text-primary hover:underline">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />

      <main className="pt-24">
        {/* Hero Section with Animated Title */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 50%, hsl(190 100% 50% / 0.2) 0%, transparent 50%),
                  radial-gradient(circle at 80% 50%, hsl(142 76% 50% / 0.2) 0%, transparent 50%)
                `,
              }}
            />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Link
                to="/#projects"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Projects
              </Link>
            </motion.div>

            {/* Animated Title */}
            <motion.div className="mb-8 overflow-hidden">
              <motion.div className="flex flex-wrap gap-2 md:gap-4">
                {titleChars.map((char, index) => (
                  <motion.span
                    key={index}
                    className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gradient inline-block"
                    initial={{ y: 100, opacity: 0, rotateX: -90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.03,
                      ease: [0.6, -0.05, 0.01, 0.99],
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6 mb-12"
            >
              <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20">
                <Clock className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-display font-bold text-primary text-xl">
                    {item.metrics.timeSaved}
                  </div>
                  <div className="text-xs text-muted-foreground">Time Saved</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-accent/10 border border-accent/20">
                <TrendingUp className="w-6 h-6 text-accent" />
                <div>
                  <div className="font-display font-bold text-accent text-xl">
                    {item.metrics.leads}
                  </div>
                  <div className="text-xs text-muted-foreground">Leads/Month</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20">
                <Zap className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-display font-bold text-primary text-xl">
                    {item.metrics.roi}
                  </div>
                  <div className="text-xs text-muted-foreground">ROI</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Image Gallery */}
        {item.images.length > 0 && (
          <section className="pb-16">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer bg-secondary/30"
                onClick={() => setIsGalleryOpen(true)}
              >
                <img
                  src={item.images[currentImageIndex]}
                  alt={`${item.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                />
                {item.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/20 transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/20 transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {item.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            i === currentImageIndex ? 'bg-primary' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </section>
        )}

        {/* Description and Tech Stack */}
        <section className="pb-24">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="lg:col-span-2"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  About This Project
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                    {item.description}
                  </p>
                </div>
              </motion.div>

              {/* Tech Stack */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Tech Stack
                </h2>
                <div className="flex flex-wrap gap-3">
                  {item.techstack.map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="group relative"
                    >
                      <div className="px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-medium hover:bg-primary/20 hover:scale-105 transition-all cursor-default">
                        {tech}
                      </div>
                      {/* Connector line animation */}
                      {index < item.techstack.length - 1 && (
                        <motion.div
                          className="absolute -right-2 top-1/2 w-4 h-0.5 bg-primary/30"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 1 + index * 0.1 }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Fullscreen Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && item.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setIsGalleryOpen(false)}
          >
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-secondary/50 text-foreground hover:bg-primary/20 transition-colors"
            >
              <X size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-secondary/50 text-foreground hover:bg-primary/20 transition-colors"
            >
              <ChevronLeft size={32} />
            </button>
            <motion.img
              key={currentImageIndex}
              src={item.images[currentImageIndex]}
              alt={`${item.title} - Image ${currentImageIndex + 1}`}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-secondary/50 text-foreground hover:bg-primary/20 transition-colors"
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioDetail;
