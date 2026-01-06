import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Sparkles, X, Code, Zap, GripVertical } from 'lucide-react';

const tools = [
  { id: 'n8n', name: 'N8N', color: 'hsl(190 100% 50%)' },
  { id: 'vapi', name: 'VAPI', color: 'hsl(280 100% 60%)' },
  { id: 'retell', name: 'Retell', color: 'hsl(340 80% 55%)' },
  { id: 'make', name: 'Make.com', color: 'hsl(200 90% 50%)' },
  { id: 'elevenlabs', name: 'ElevenLabs', color: 'hsl(45 100% 50%)' },
  { id: 'ghl', name: 'GoHighLevel', color: 'hsl(120 70% 45%)' },
  { id: 'supabase', name: 'Supabase', color: 'hsl(153 60% 53%)' },
  { id: 'python', name: 'Python', color: 'hsl(210 70% 55%)' },
];

const codeSnippets: Record<string, string> = {
  'n8n-vapi': `# N8N + VAPI Voice Workflow
workflow.on('voice_call', async (call) => {
  const response = await vapi.transcribe(call.audio);
  return n8n.trigger('process_voice', response);
});`,
  'vapi-retell': `# VAPI + Retell AI Agent
agent = RetellAgent(voice=vapi.voice)
agent.on_conversation(lambda msg:
    vapi.synthesize(agent.respond(msg))
)`,
  'make-supabase': `# Make.com + Supabase Sync
scenario.watch('new_lead')
  .insert_to(supabase.table('leads'))
  .notify_slack()`,
  'ghl-python': `# GoHighLevel + Python CRM Sync
import ghl_api
for contact in ghl.get_contacts():
    enriched = enrich_lead(contact)
    ghl.update_contact(contact.id, enriched)`,
  'elevenlabs-n8n': `# ElevenLabs + N8N TTS Pipeline
n8n.on('content_ready', async (text) => {
  audio = await elevenlabs.synthesize(text)
  return upload_to_cdn(audio)
})`,
};

const tips = [
  "💡 Tip: Use N8N webhooks to trigger real-time voice responses with VAPI!",
  "🔥 Pro tip: Chain Retell AI with ElevenLabs for natural conversation flows.",
  "⚡ Power move: Sync GoHighLevel contacts to Supabase for custom analytics.",
  "🚀 Secret: Python scripts in N8N unlock unlimited automation possibilities!",
  "✨ Quantum insight: Voice AI + CRM automation = 10x lead conversion.",
];

const AutomationOracle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDocked, setIsDocked] = useState(true);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [showEntanglement, setShowEntanglement] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const handleToolClick = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter((t) => t !== toolId));
    } else if (selectedTools.length < 2) {
      const newSelection = [...selectedTools, toolId];
      setSelectedTools(newSelection);

      if (newSelection.length === 2) {
        // Generate code and trigger entanglement effect
        const key = `${newSelection[0]}-${newSelection[1]}`;
        const reverseKey = `${newSelection[1]}-${newSelection[0]}`;
        const snippet = codeSnippets[key] || codeSnippets[reverseKey] || generateGenericCode(newSelection);
        
        setShowEntanglement(true);
        setTimeout(() => {
          setGeneratedCode(snippet);
          setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
          setShowEntanglement(false);
        }, 1500);
      }
    }
  };

  const generateGenericCode = (tools: string[]) => {
    const toolNames = tools.map((t) => t.toUpperCase()).join(' + ');
    return `# ${toolNames} Integration
# Custom workflow combining these powerful tools

workflow = create_automation()
workflow.connect(${tools.map((t) => `'${t}'`).join(', ')})
workflow.on_trigger(lambda data:
    process_and_respond(data)
)
workflow.deploy()`;
  };

  const resetOracle = () => {
    setSelectedTools([]);
    setGeneratedCode(null);
    setCurrentTip('');
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
        style={{ boxShadow: '0 0 30px hsl(190 100% 50% / 0.4)' }}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
      >
        {isOpen ? <X className="text-primary-foreground" /> : <Sparkles className="text-primary-foreground" />}
      </motion.button>

      {/* Oracle Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            drag={!isDocked}
            dragControls={dragControls}
            dragMomentum={false}
            className={`fixed z-40 w-80 bg-card/95 backdrop-blur-xl rounded-2xl border border-border shadow-2xl overflow-hidden ${
              isDocked ? 'bottom-24 right-6' : ''
            }`}
          >
            {/* Header */}
            <div
              className="p-4 border-b border-border flex items-center justify-between cursor-move"
              onPointerDown={(e) => !isDocked && dragControls.start(e)}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-display font-bold text-foreground">Automation Oracle</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDocked(!isDocked)}
                  className="p-1 rounded hover:bg-secondary/50 transition-colors"
                  title={isDocked ? 'Undock' : 'Dock'}
                >
                  <GripVertical size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-3">
                Select 2 tools to generate an integration:
              </p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {tools.map((tool) => (
                  <motion.button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className={`p-2 rounded-lg border text-center text-xs font-medium transition-all ${
                      selectedTools.includes(tool.id)
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      boxShadow: selectedTools.includes(tool.id)
                        ? `0 0 15px ${tool.color}40`
                        : 'none',
                    }}
                  >
                    {tool.name}
                  </motion.button>
                ))}
              </div>

              {selectedTools.length > 0 && (
                <button
                  onClick={resetOracle}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors mb-4"
                >
                  Clear selection
                </button>
              )}
            </div>

            {/* Entanglement Effect */}
            <AnimatePresence>
              {showEntanglement && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                >
                  <div className="relative">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          background: `hsl(${190 + i * 10} 100% 50%)`,
                          boxShadow: `0 0 10px hsl(${190 + i * 10} 100% 50%)`,
                        }}
                        initial={{ x: 0, y: 0, scale: 0 }}
                        animate={{
                          x: Math.cos((i * Math.PI * 2) / 20) * 60,
                          y: Math.sin((i * Math.PI * 2) / 20) * 60,
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.05,
                          ease: 'easeOut',
                        }}
                      />
                    ))}
                    <motion.div
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent"
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, ease: 'easeInOut' }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generated Code */}
            <AnimatePresence>
              {generatedCode && !showEntanglement && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="px-4 pb-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Generated Integration</span>
                  </div>
                  <pre className="p-3 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground overflow-x-auto font-mono">
                    {generatedCode}
                  </pre>
                  {currentTip && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 p-3 rounded-lg bg-accent/10 border border-accent/20 text-xs text-accent"
                    >
                      {currentTip}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AutomationOracle;
