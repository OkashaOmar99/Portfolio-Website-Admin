import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, LogOut, Home, Image, X, GripVertical, ChevronUp, ChevronDown, Briefcase, Zap, Settings, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePortfolioItems, PortfolioItem } from '@/hooks/usePortfolioItems';
import { useSkills, Skill } from '@/hooks/useSkills';
import { useExperiences, Experience } from '@/hooks/useExperiences';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Admin = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const { items, createItem, updateItem, deleteItem, reorderItems } = usePortfolioItems();
  const { skills, createSkill, updateSkill, deleteSkill, getCategories } = useSkills();
  const { experiences, createExperience, updateExperience, deleteExperience, reorderExperiences } = useExperiences();
  const { getSetting, updateSetting } = useSiteSettings();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Portfolio state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techstack: '',
    metrics: [] as { key: string; value: string }[],
    featured: false,
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Skills state
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillFormData, setSkillFormData] = useState({
    category: '',
    name: '',
    level: 80,
    sort_order: 0,
  });

  // Experience state
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expFormData, setExpFormData] = useState({
    title: '',
    company: '',
    period: '',
    duration: '',
    location: '',
    type: 'Hybrid',
    description: '',
    skills: '',
    sort_order: 0,
  });

  // Site settings state
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const profileImage = getSetting('profile_image');

  // Define settings state
  const [settingsFormData, setSettingsFormData] = useState({
    owner_name: '',
    site_title: '',
    linkedin_url: '',
    email: '',
    twitter_url: '',
    instagram_url: '',
    facebook_url: '',
    github_url: '',
  });

  // Load settings when getSetting returns values
  useEffect(() => {
    setSettingsFormData({
      owner_name: getSetting('owner_name') || '',
      site_title: getSetting('site_title') || '',
      linkedin_url: getSetting('linkedin_url') || '',
      email: getSetting('email') || '',
      twitter_url: getSetting('twitter_url') || '',
      instagram_url: getSetting('instagram_url') || '',
      facebook_url: getSetting('facebook_url') || '',
      github_url: getSetting('github_url') || '',
    });
  }, [getSetting('owner_name'), getSetting('site_title')]); // Depend on a few key settings to trigger reload

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettingsFormData({
      ...settingsFormData,
      [e.target.name]: e.target.value,
    });
  };

  const saveSettings = async () => {
    try {
      await Promise.all([
        updateSetting('owner_name', settingsFormData.owner_name),
        updateSetting('site_title', settingsFormData.site_title),
        updateSetting('linkedin_url', settingsFormData.linkedin_url),
        updateSetting('email', settingsFormData.email),
        updateSetting('twitter_url', settingsFormData.twitter_url),
        updateSetting('instagram_url', settingsFormData.instagram_url),
        updateSetting('facebook_url', settingsFormData.facebook_url),
        updateSetting('github_url', settingsFormData.github_url),
      ]);
      toast({ title: 'Success', description: 'Settings updated!' });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update settings',
      });
    }
  };

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/admin-login');
    }
  }, [user, isAdmin, isLoading, navigate]);

  // Portfolio functions
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      techstack: '',
      metrics: [],
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
        metrics: item.metrics
          ? Object.entries(item.metrics as Record<string, string>).map(([key, value]) => ({ key, value }))
          : [],
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

    const metricsObject = formData.metrics.reduce((acc, curr) => {
      if (curr.key && curr.value) acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    try {
      if (editingItem) {
        await updateItem(editingItem.id, {
          title: formData.title,
          description: formData.description,
          techstack: techstackArray,
          images: imageUrls,
          metrics: metricsObject,
          featured: formData.featured,
        });
        toast({ title: 'Success', description: 'Portfolio item updated!' });
      } else {
        await createItem({
          title: formData.title,
          description: formData.description,
          techstack: techstackArray,
          images: imageUrls,
          metrics: metricsObject,
          featured: formData.featured,
          sort_order: items.length + 1,
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

  const movePortfolioItem = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newItems.length) return;
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    await reorderItems(newItems.map((item) => item.id));
    toast({ title: 'Reordered', description: 'Portfolio order updated.' });
  };

  // Skills functions
  const resetSkillForm = () => {
    setSkillFormData({ category: '', name: '', level: 80, sort_order: 0 });
    setEditingSkill(null);
  };

  const openSkillModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillFormData({
        category: skill.category,
        name: skill.name,
        level: skill.level,
        sort_order: skill.sort_order,
      });
    } else {
      resetSkillForm();
    }
    setIsSkillModalOpen(true);
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, skillFormData);
        toast({ title: 'Success', description: 'Skill updated!' });
      } else {
        await createSkill({
          ...skillFormData,
          sort_order: skills.filter((s) => s.category === skillFormData.category).length + 1,
        });
        toast({ title: 'Success', description: 'Skill created!' });
      }
      setIsSkillModalOpen(false);
      resetSkillForm();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: (err as Error).message });
    }
  };

  const handleSkillDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await deleteSkill(id);
      toast({ title: 'Deleted', description: 'Skill removed.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: (err as Error).message });
    }
  };

  // Experience functions
  const resetExpForm = () => {
    setExpFormData({
      title: '',
      company: '',
      period: '',
      duration: '',
      location: '',
      type: 'Hybrid',
      description: '',
      skills: '',
      sort_order: 0,
    });
    setEditingExp(null);
  };

  const openExpModal = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      setExpFormData({
        title: exp.title,
        company: exp.company,
        period: exp.period,
        duration: exp.duration || '',
        location: exp.location,
        type: exp.type,
        description: exp.description,
        skills: exp.skills.join(', '),
        sort_order: exp.sort_order,
      });
    } else {
      resetExpForm();
    }
    setIsExpModalOpen(true);
  };

  const handleExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = expFormData.skills.split(',').map((s) => s.trim()).filter(Boolean);
    try {
      if (editingExp) {
        await updateExperience(editingExp.id, {
          ...expFormData,
          skills: skillsArray,
        });
        toast({ title: 'Success', description: 'Experience updated!' });
      } else {
        await createExperience({
          ...expFormData,
          skills: skillsArray,
          sort_order: experiences.length + 1,
        });
        toast({ title: 'Success', description: 'Experience created!' });
      }
      setIsExpModalOpen(false);
      resetExpForm();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: (err as Error).message });
    }
  };

  const handleExpDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      await deleteExperience(id);
      toast({ title: 'Deleted', description: 'Experience removed.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: (err as Error).message });
    }
  };

  const moveExperience = async (index: number, direction: 'up' | 'down') => {
    const newExps = [...experiences];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newExps.length) return;
    [newExps[index], newExps[newIndex]] = [newExps[newIndex], newExps[index]];
    await reorderExperiences(newExps.map((exp) => exp.id));
    toast({ title: 'Reordered', description: 'Experience order updated.' });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Profile image upload handler
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProfileImage(true);
    try {
      const fileName = `profile-${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(data.path);

      await updateSetting('profile_image', urlData.publicUrl);
      toast({ title: 'Success', description: 'Profile image updated!' });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: (err as Error).message,
      });
    }
    setUploadingProfileImage(false);
  };

  const handleRemoveProfileImage = async () => {
    try {
      await updateSetting('profile_image', null);
      toast({ title: 'Removed', description: 'Profile image removed.' });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (err as Error).message,
      });
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

  const categories = getCategories();

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
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Image size={16} />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Zap size={16} />
              Skills
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase size={16} />
              Experience
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <motion.button
              onClick={() => openModal()}
              className="mb-8 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-display font-bold rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={20} />
              Add Portfolio Item
            </motion.button>

            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card-glow rounded-xl p-4 border border-border flex items-center gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => movePortfolioItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-secondary/50 disabled:opacity-30"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <GripVertical size={16} className="text-muted-foreground" />
                    <button
                      onClick={() => movePortfolioItem(index, 'down')}
                      disabled={index === items.length - 1}
                      className="p-1 rounded hover:bg-secondary/50 disabled:opacity-30"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  {item.images[0] && (
                    <img src={item.images[0]} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                  )}

                  <div className="flex-1">
                    <h3 className="font-display font-bold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-1">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.techstack.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => openModal(item)}
                      className="p-2 rounded-lg bg-secondary/50 text-foreground hover:bg-primary/20"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Edit2 size={16} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {items.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No portfolio items yet. Click "Add Portfolio Item" to create one.</p>
              </div>
            )}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <motion.button
              onClick={() => openSkillModal()}
              className="mb-8 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-display font-bold rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={20} />
              Add Skill
            </motion.button>

            {categories.map((category) => (
              <div key={category} className="mb-8">
                <h3 className="font-display text-lg font-bold text-primary mb-4">{category}</h3>
                <div className="space-y-2">
                  {skills
                    .filter((s) => s.category === category)
                    .map((skill) => (
                      <motion.div
                        key={skill.id}
                        className="card-glow rounded-lg p-4 border border-border flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-foreground">{skill.name}</span>
                            <span className="text-primary font-bold">{skill.level}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <motion.button
                            onClick={() => openSkillModal(skill)}
                            className="p-2 rounded-lg bg-secondary/50 hover:bg-primary/20"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Edit2 size={14} />
                          </motion.button>
                          <motion.button
                            onClick={() => handleSkillDelete(skill.id)}
                            className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}

            {skills.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No skills yet. Click "Add Skill" to create one.</p>
              </div>
            )}
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <motion.button
              onClick={() => openExpModal()}
              className="mb-8 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-display font-bold rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={20} />
              Add Experience
            </motion.button>

            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  layout
                  className="card-glow rounded-xl p-4 border border-border flex items-start gap-4"
                >
                  <div className="flex flex-col gap-1 pt-2">
                    <button
                      onClick={() => moveExperience(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-secondary/50 disabled:opacity-30"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <GripVertical size={16} className="text-muted-foreground" />
                    <button
                      onClick={() => moveExperience(index, 'down')}
                      disabled={index === experiences.length - 1}
                      className="p-1 rounded hover:bg-secondary/50 disabled:opacity-30"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display font-bold text-foreground">{exp.title}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                    <p className="text-muted-foreground text-sm">{exp.period} • {exp.location}</p>
                    <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{exp.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exp.skills.slice(0, 4).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => openExpModal(exp)}
                      className="p-2 rounded-lg bg-secondary/50 hover:bg-primary/20"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Edit2 size={16} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleExpDelete(exp.id)}
                      className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {experiences.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No experiences yet. Click "Add Experience" to create one.</p>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="max-w-2xl">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">Site Settings</h2>

              {/* Profile Image Upload */}
              <div className="card-glow rounded-xl p-6 border border-border mb-6">
                <h3 className="font-display font-bold text-foreground mb-4">Profile Image</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  This image will appear in the About section of your portfolio.
                </p>

                <div className="flex items-start gap-6">
                  {/* Current Image Preview */}
                  <div className="w-40 h-40 rounded-xl border border-border overflow-hidden bg-secondary/50 flex items-center justify-center">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Upload size={32} className="mx-auto mb-2 opacity-50" />
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-4">
                    <label className="flex items-center justify-center gap-2 py-4 px-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <Upload size={20} className="text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {uploadingProfileImage ? 'Uploading...' : 'Upload new image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        className="hidden"
                        disabled={uploadingProfileImage}
                      />
                    </label>

                    {profileImage && (
                      <motion.button
                        type="button"
                        onClick={handleRemoveProfileImage}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Trash2 size={16} />
                        Remove Image
                      </motion.button>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Recommended: Square image, at least 400x400 pixels. JPG or PNG format.
                    </p>
                  </div>
                </div>
              </div>

              {/* General Settings */}
              <div className="card-glow rounded-xl p-6 border border-border mb-6">
                <h3 className="font-display font-bold text-foreground mb-4">General Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Portfolio Owner Name</label>
                    <input
                      type="text"
                      name="owner_name"
                      value={settingsFormData.owner_name}
                      onChange={handleSettingChange}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                      placeholder="e.g. Okasha Omar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Website Title</label>
                    <input
                      type="text"
                      name="site_title"
                      value={settingsFormData.site_title}
                      onChange={handleSettingChange}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                      placeholder="e.g. Okasha Omar | N8N Automation Specialist"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="card-glow rounded-xl p-6 border border-border mb-6">
                <h3 className="font-display font-bold text-foreground mb-4">Contact & Social Links</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={settingsFormData.email}
                      onChange={handleSettingChange}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                      placeholder="e.g. okasha@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                    <input
                      type="text"
                      name="linkedin_url"
                      value={settingsFormData.linkedin_url}
                      onChange={handleSettingChange}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub URL</label>
                    <input
                      type="text"
                      name="github_url"
                      value={settingsFormData.github_url}
                      onChange={handleSettingChange}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Twitter/X URL</label>
                    <input
                      type="text"
                      name="twitter_url"
                      value={settingsFormData.twitter_url}
                      onChange={handleSettingChange}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Instagram URL</label>
                    <input
                      type="text"
                      name="instagram_url"
                      value={settingsFormData.instagram_url}
                      onChange={handleSettingChange}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Facebook URL</label>
                    <input
                      type="text"
                      name="facebook_url"
                      value={settingsFormData.facebook_url}
                      onChange={handleSettingChange}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                </div>
              </div>

              <motion.button
                onClick={saveSettings}
                className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-display font-bold rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Save Settings
              </motion.button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Portfolio Modal */}
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
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-secondary/50">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground"
                    placeholder="Project title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground resize-none"
                    placeholder="Describe the project..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.techstack}
                    onChange={(e) => setFormData({ ...formData, techstack: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground"
                    placeholder="N8N, VAPI, Python, Supabase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Metrics</label>
                  <div className="space-y-3">
                    {formData.metrics.map((metric, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Key (e.g., Time Saved)"
                          list="metric-suggestions"
                          className="flex-1 px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none"
                          value={metric.key}
                          onChange={(e) => {
                            const newMetrics = [...formData.metrics];
                            newMetrics[index].key = e.target.value;
                            setFormData({ ...formData, metrics: newMetrics });
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g., 50%)"
                          className="flex-1 px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none"
                          value={metric.value}
                          onChange={(e) => {
                            const newMetrics = [...formData.metrics];
                            newMetrics[index].value = e.target.value;
                            setFormData({ ...formData, metrics: newMetrics });
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newMetrics = formData.metrics.filter((_, i) => i !== index);
                            setFormData({ ...formData, metrics: newMetrics });
                          }}
                          className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, metrics: [...formData.metrics, { key: '', value: '' }] })}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Metric
                    </button>

                    <datalist id="metric-suggestions">
                      <option value="Time Saved" />
                      <option value="Leads Generated" />
                      <option value="ROI" />
                      <option value="Revenue Increase" />
                      <option value="Cost Reduction" />
                      <option value="Process Efficiency" />
                      <option value="Tasks Automated" />
                      <option value="Error Rate Reduction" />
                      <option value="Conversion Rate" />
                      <option value="Customer Satisfaction" />
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Images</label>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Upload ${index + 1}`} className="w-24 h-24 object-cover rounded-lg" />
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
                    <span className="text-muted-foreground">{uploadingImages ? 'Uploading...' : 'Click to upload images'}</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImages} />
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
                  <label htmlFor="featured" className="text-foreground">Feature on homepage</label>
                </div>

                <motion.button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-display font-bold rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {editingItem ? 'Update Item' : 'Create Item'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )
        }
      </AnimatePresence >

      {/* Skill Modal */}
      <AnimatePresence>
        {
          isSkillModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsSkillModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold">{editingSkill ? 'Edit Skill' : 'Add Skill'}</h2>
                  <button onClick={() => setIsSkillModalOpen(false)} className="p-2 rounded-lg hover:bg-secondary/50">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSkillSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <input
                      type="text"
                      value={skillFormData.category}
                      onChange={(e) => setSkillFormData({ ...skillFormData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                      placeholder="Automation Tools"
                      list="categories"
                      required
                    />
                    <datalist id="categories">
                      {categories.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={skillFormData.name}
                      onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                      placeholder="N8N"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Level ({skillFormData.level}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skillFormData.level}
                      onChange={(e) => setSkillFormData({ ...skillFormData, level: parseInt(e.target.value) })}
                      className="w-full accent-primary"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-display font-bold rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingSkill ? 'Update Skill' : 'Create Skill'}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence >

      {/* Experience Modal */}
      <AnimatePresence>
        {
          isExpModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsExpModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-border shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold">{editingExp ? 'Edit Experience' : 'Add Experience'}</h2>
                  <button onClick={() => setIsExpModalOpen(false)} className="p-2 rounded-lg hover:bg-secondary/50">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleExpSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={expFormData.title}
                        onChange={(e) => setExpFormData({ ...expFormData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                        placeholder="Team Lead Manager"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <input
                        type="text"
                        value={expFormData.company}
                        onChange={(e) => setExpFormData({ ...expFormData, company: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                        placeholder="Alqaim Technology"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Period</label>
                      <input
                        type="text"
                        value={expFormData.period}
                        onChange={(e) => setExpFormData({ ...expFormData, period: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                        placeholder="Jun 2024 - Present"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration</label>
                      <input
                        type="text"
                        value={expFormData.duration}
                        onChange={(e) => setExpFormData({ ...expFormData, duration: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                        placeholder="8 months"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <input
                        type="text"
                        value={expFormData.location}
                        onChange={(e) => setExpFormData({ ...expFormData, location: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                        placeholder="Punjab, Pakistan"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select
                        value={expFormData.type}
                        onChange={(e) => setExpFormData({ ...expFormData, type: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                      >
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={expFormData.description}
                      onChange={(e) => setExpFormData({ ...expFormData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground resize-none"
                      placeholder="Describe your role..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={expFormData.skills}
                      onChange={(e) => setExpFormData({ ...expFormData, skills: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:border-primary outline-none text-foreground"
                      placeholder="Sales, CRM, Automation"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-display font-bold rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingExp ? 'Update Experience' : 'Create Experience'}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence >
    </div >
  );
};

export default Admin;
