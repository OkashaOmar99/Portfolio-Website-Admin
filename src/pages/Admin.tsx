import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, LogOut, Home, Image, X, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePortfolioItems, PortfolioItem } from '@/hooks/usePortfolioItems';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const { items, createItem, updateItem, deleteItem } = usePortfolioItems();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techstack: '',
    metrics: { timeSaved: '', leads: '', roi: '' },
    featured: false,
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/admin-login');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      techstack: '',
      metrics: { timeSaved: '', leads: '', roi: '' },
      featured: false,
    });
    setImageUrls([]);
    setEditingItem(null);
  };

  const openModal = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description,
        techstack: item.techstack.join(', '),
        metrics: item.metrics,
        featured: item.featured,
      });
      setImageUrls(item.images);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingImages(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file);

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: error.message,
        });
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(data.path);

      newUrls.push(urlData.publicUrl);
    }

    setImageUrls([...imageUrls, ...newUrls]);
    setUploadingImages(false);
  };

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const techstackArray = formData.techstack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingItem) {
        await updateItem(editingItem.id, {
          title: formData.title,
          description: formData.description,
          techstack: techstackArray,
          images: imageUrls,
          metrics: formData.metrics,
          featured: formData.featured,
        });
        toast({ title: 'Success', description: 'Portfolio item updated!' });
      } else {
        await createItem({
          title: formData.title,
          description: formData.description,
          techstack: techstackArray,
          images: imageUrls,
          metrics: formData.metrics,
          featured: formData.featured,
        });
        toast({ title: 'Success', description: 'Portfolio item created!' });
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (err as Error).message,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteItem(id);
      toast({ title: 'Deleted', description: 'Portfolio item removed.' });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (err as Error).message,
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-gradient">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <motion.a
              href="/"
              className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home size={20} />
            </motion.a>
            <motion.button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={18} />
              Sign Out
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Add Button */}
        <motion.button
          onClick={() => openModal()}
          className="mb-8 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-display font-bold rounded-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          Add Portfolio Item
        </motion.button>

        {/* Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card-glow rounded-2xl overflow-hidden border border-border"
            >
              {item.images[0] && (
                <div className="aspect-video bg-secondary/50">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.techstack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => openModal(item)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-secondary/50 text-foreground hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Edit2 size={16} />
                    Edit
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No portfolio items yet. Click "Add Portfolio Item" to create one.
            </p>
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-foreground">
                  {editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                    placeholder="Project title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground resize-none"
                    placeholder="Describe the project..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.techstack}
                    onChange={(e) => setFormData({ ...formData, techstack: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                    placeholder="N8N, VAPI, Python, Supabase"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Time Saved
                    </label>
                    <input
                      type="text"
                      value={formData.metrics.timeSaved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metrics: { ...formData.metrics, timeSaved: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                      placeholder="80%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Leads/Month
                    </label>
                    <input
                      type="text"
                      value={formData.metrics.leads}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metrics: { ...formData.metrics, leads: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                      placeholder="500+"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      ROI
                    </label>
                    <input
                      type="text"
                      value={formData.metrics.roi}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metrics: { ...formData.metrics, roi: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                      placeholder="3x"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Images
                  </label>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Upload ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center justify-center gap-2 py-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <Image size={20} className="text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImages}
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-border accent-primary"
                  />
                  <label htmlFor="featured" className="text-foreground">
                    Feature on homepage
                  </label>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-border rounded-lg text-foreground hover:bg-secondary/50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-display font-bold rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save size={18} />
                    {editingItem ? 'Update' : 'Create'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
