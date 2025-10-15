import { useState, useEffect } from 'react';
import { Filter, ChevronDown, Download, ExternalLink, Package, Heart, Eye, Brain, MessageSquare, Move, Smile, Play, Book, Search } from 'lucide-react';
import { accessibilityTools } from '../data/accessibilityTools';
import { VisualTimer } from '../components/tools/VisualTimer';
import { BreathingExercise } from '../components/tools/BreathingExercise';
import { FeelingsCheckIn } from '../components/tools/FeelingsCheckIn';
import { CommunicationBoard } from '../components/tools/CommunicationBoard';
import { CalmDownSpace } from '../components/tools/CalmDownSpace';
import { MovementBreaks } from '../components/tools/MovementBreaks';
import { ZonesOfRegulation } from '../components/tools/ZonesOfRegulation';
import { FirstThenBoard } from '../components/tools/FirstThenBoard';
import { RewardSystem } from '../components/tools/RewardSystem';
import { SensoryTracker } from '../components/tools/SensoryTracker';
import { VisualScheduleBuilder } from '../components/tools/VisualScheduleBuilder';
import { SocialStoryBuilder } from '../components/tools/SocialStoryBuilder';
import { TaskChecklist } from '../components/tools/TaskChecklist';
import { EmergencyCard } from '../components/tools/EmergencyCard';
import { NoiseGenerator } from '../components/tools/NoiseGenerator';
import { AmbientSounds } from '../components/tools/AmbientSounds';
import { FlashlightTool } from '../components/tools/FlashlightTool';
import { VibrationTool } from '../components/tools/VibrationTool';
import { ScreenDimmer } from '../components/tools/ScreenDimmer';
import { GroundingExercise } from '../components/tools/GroundingExercise';
import { QuickCards } from '../components/tools/QuickCards';
import { PanicButton } from '../components/tools/PanicButton';
import { SignLanguageGuide } from '../components/tools/SignLanguageGuide';
import { VisualAlertSystem } from '../components/tools/VisualAlertSystem';
import { LiveCaptions } from '../components/tools/LiveCaptions';
import { SoundLevelMeter } from '../components/tools/SoundLevelMeter';
import { WorryBox } from '../components/tools/WorryBox';
import { FidgetToolkit } from '../components/tools/FidgetToolkit';
import { ChoiceBoard } from '../components/tools/ChoiceBoard';
import { BuddySystem } from '../components/tools/BuddySystem';
import { SensoryKit } from '../components/tools/SensoryKit';
import { WeightedTools } from '../components/tools/WeightedTools';
import { NoiseReduction } from '../components/tools/NoiseReduction';
import { MultiSensoryLearning } from '../components/tools/MultiSensoryLearning';
import { VisualSchedule } from '../components/tools/VisualSchedule';
import { SocialStories } from '../components/tools/SocialStories';
import { SimplifiedInstructions } from '../components/tools/SimplifiedInstructions';
import { ReadingSupports } from '../components/tools/ReadingSupports';
import { RepetitionReinforcement } from '../components/tools/RepetitionReinforcement';
import { ClearCommunication } from '../components/tools/ClearCommunication';
import { AccessibleSpaces } from '../components/tools/AccessibleSpaces';
import { AdaptiveEquipment } from '../components/tools/AdaptiveEquipment';
import { FatigueManagement } from '../components/tools/FatigueManagement';
import { AudioDescription } from '../components/tools/AudioDescription';
import { TactileMaterials } from '../components/tools/TactileMaterials';
import { VisualSupportsHearing } from '../components/tools/VisualSupportsHearing';
import { GestureSigns } from '../components/tools/GestureSigns';

type InteractiveTool = 'visual-timer' | 'breathing-techniques' | 'feelings-chart' | 'aac-system' | 'quiet-space' | 'movement-breaks' | 'zones-of-regulation' | 'first-then' | 'reward-system' | 'sensory-tracker' | 'visual-schedule-builder' | 'social-story-builder' | 'task-checklist' | 'emergency-card' | 'noise-generator' | 'ambient-sounds' | 'flashlight-tool' | 'vibration-tool' | 'screen-dimmer' | 'grounding-exercise' | 'quick-cards' | 'panic-button' | 'sign-language-guide' | 'visual-alert-system' | 'live-captions' | 'sound-level-meter' | 'worry-management' | 'fidget-toolkit' | 'choice-boards' | 'peer-buddy-system' | 'sensory-kit' | 'weighted-tools' | 'noise-reduction' | 'multi-sensory-learning' | 'visual-schedule' | 'social-stories' | 'simplified-instructions' | 'reading-supports' | 'repetition-reinforcement' | 'clear-communication' | 'accessible-spaces' | 'adaptive-equipment' | 'fatigue-management' | 'audio-description' | 'tactile-materials' | 'visual-supports-hearing' | 'gesture-signs' | null;

export function AccessibilityTools() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [showNeedsModal, setShowNeedsModal] = useState(false);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<InteractiveTool>(null);
  const [searchText, setSearchText] = useState('');

  const categories = [
    { id: 'all', label: 'All Tools', icon: Package },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'sensory', label: 'Sensory', icon: Heart },
    { id: 'visual', label: 'Visual', icon: Eye },
    { id: 'cognitive', label: 'Cognitive', icon: Brain },
    { id: 'mobility', label: 'Mobility', icon: Move },
    { id: 'emotional', label: 'Emotional', icon: Smile },
  ];

  const specialNeeds = [
    { id: 'Autism', label: 'Autism' },
    { id: 'ADHD', label: 'ADHD' },
    { id: 'Anxiety', label: 'Anxiety' },
    { id: 'Sensory', label: 'Sensory Processing' },
    { id: 'Learning', label: 'Learning Disabilities' },
    { id: 'Down', label: 'Down Syndrome' },
    { id: 'Mobility', label: 'Mobility' },
    { id: 'Vision', label: 'Vision/Hearing' },
    { id: 'Nonverbal', label: 'Nonverbal/Communication' },
  ];

  useEffect(() => {
    if (activeTool) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTool]);

  const filteredTools = accessibilityTools.filter((tool) => {
    const categoryMatch = selectedCategory === 'all' || tool.category === selectedCategory;

    const searchMatch = searchText === '' ||
      tool.title.toLowerCase().includes(searchText.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchText.toLowerCase());

    if (selectedNeeds.length === 0) {
      return categoryMatch && searchMatch;
    }

    return categoryMatch && searchMatch && selectedNeeds.some(need =>
      tool.specialNeeds.some(sn => sn.toLowerCase().includes(need.toLowerCase()))
    );
  });

  const toggleNeed = (needId: string) => {
    setSelectedNeeds(prev =>
      prev.includes(needId)
        ? prev.filter(id => id !== needId)
        : [...prev, needId]
    );
  };

  const clearAllNeeds = () => {
    setSelectedNeeds([]);
  };

  const getToolCount = (needId: string) => {
    return accessibilityTools.filter(t =>
      t.specialNeeds.some(sn => sn.toLowerCase().includes(needId.toLowerCase()))
    ).length;
  };

  const toggleExpanded = (id: string) => {
    setExpandedTool(expandedTool === id ? null : id);
  };

  const getInteractiveToolId = (toolId: string): InteractiveTool => {
    const toolMap: Record<string, InteractiveTool> = {
      'visual-timer': 'visual-timer',
      'breathing-techniques': 'breathing-techniques',
      'feelings-chart': 'feelings-chart',
      'aac-system': 'aac-system',
      'ambient-sounds': 'ambient-sounds',
      'quiet-space': 'quiet-space',
      'movement-breaks': 'movement-breaks',
      'zones-of-regulation': 'zones-of-regulation',
      'first-then': 'first-then',
      'reward-system': 'reward-system',
      'sensory-tracker': 'sensory-tracker',
      'visual-schedule-builder': 'visual-schedule-builder',
      'social-story-builder': 'social-story-builder',
      'task-checklist': 'task-checklist',
      'emergency-card': 'emergency-card',
      'noise-generator': 'noise-generator',
      'flashlight-tool': 'flashlight-tool',
      'vibration-tool': 'vibration-tool',
      'screen-dimmer': 'screen-dimmer',
      'grounding-exercise': 'grounding-exercise',
      'quick-cards': 'quick-cards',
      'panic-button': 'panic-button',
      'sign-language-guide': 'sign-language-guide',
      'visual-alert-system': 'visual-alert-system',
      'live-captions': 'live-captions',
      'sound-level-meter': 'sound-level-meter',
      'worry-management': 'worry-management',
      'fidget-toolkit': 'fidget-toolkit',
      'choice-boards': 'choice-boards',
      'peer-buddy-system': 'peer-buddy-system',
      'sensory-kit': 'sensory-kit',
      'weighted-tools': 'weighted-tools',
      'noise-reduction': 'noise-reduction',
      'multi-sensory-learning': 'multi-sensory-learning',
      'visual-schedule': 'visual-schedule',
      'social-stories': 'social-stories',
      'simplified-instructions': 'simplified-instructions',
      'reading-supports': 'reading-supports',
      'repetition-reinforcement': 'repetition-reinforcement',
      'clear-communication': 'clear-communication',
      'accessible-spaces': 'accessible-spaces',
      'adaptive-equipment': 'adaptive-equipment',
      'fatigue-management': 'fatigue-management',
      'audio-description': 'audio-description',
      'tactile-materials': 'tactile-materials',
      'visual-supports-hearing': 'visual-supports-hearing',
      'gesture-signs': 'gesture-signs',
    };
    return toolMap[toolId] || null;
  };

  const hasInteractiveTool = (toolId: string) => {
    return ['visual-timer', 'breathing-techniques', 'feelings-chart', 'aac-system', 'ambient-sounds', 'quiet-space', 'movement-breaks', 'zones-of-regulation', 'first-then', 'reward-system', 'sensory-tracker', 'visual-schedule-builder', 'social-story-builder', 'task-checklist', 'emergency-card', 'noise-generator', 'flashlight-tool', 'vibration-tool', 'screen-dimmer', 'grounding-exercise', 'quick-cards', 'panic-button', 'sign-language-guide', 'visual-alert-system', 'live-captions', 'sound-level-meter', 'worry-management', 'fidget-toolkit', 'choice-boards', 'peer-buddy-system', 'sensory-kit', 'weighted-tools', 'noise-reduction', 'multi-sensory-learning', 'visual-schedule', 'social-stories', 'simplified-instructions', 'reading-supports', 'repetition-reinforcement', 'clear-communication', 'accessible-spaces', 'adaptive-equipment', 'fatigue-management', 'audio-description', 'tactile-materials', 'visual-supports-hearing', 'gesture-signs'].includes(toolId);
  };

  if (activeTool) {
    return (
      <div className="page-container">
        <div className="section">
          <button
            onClick={() => setActiveTool(null)}
            className="btn btn-secondary"
            style={{ marginBottom: 'var(--space-lg)' }}
          >
            ← Back to Tools
          </button>
          {activeTool === 'visual-timer' && <VisualTimer />}
          {activeTool === 'breathing-techniques' && <BreathingExercise />}
          {activeTool === 'feelings-chart' && <FeelingsCheckIn />}
          {activeTool === 'aac-system' && <CommunicationBoard />}
          {activeTool === 'quiet-space' && <CalmDownSpace />}
          {activeTool === 'movement-breaks' && <MovementBreaks />}
          {activeTool === 'zones-of-regulation' && <ZonesOfRegulation />}
          {activeTool === 'first-then' && <FirstThenBoard />}
          {activeTool === 'reward-system' && <RewardSystem />}
          {activeTool === 'sensory-tracker' && <SensoryTracker />}
          {activeTool === 'visual-schedule-builder' && <VisualScheduleBuilder />}
          {activeTool === 'social-story-builder' && <SocialStoryBuilder />}
          {activeTool === 'task-checklist' && <TaskChecklist />}
          {activeTool === 'emergency-card' && <EmergencyCard />}
          {activeTool === 'noise-generator' && <NoiseGenerator />}
          {activeTool === 'ambient-sounds' && <AmbientSounds />}
          {activeTool === 'flashlight-tool' && <FlashlightTool />}
          {activeTool === 'vibration-tool' && <VibrationTool />}
          {activeTool === 'screen-dimmer' && <ScreenDimmer />}
          {activeTool === 'grounding-exercise' && <GroundingExercise />}
          {activeTool === 'quick-cards' && <QuickCards />}
          {activeTool === 'panic-button' && <PanicButton />}
          {activeTool === 'sign-language-guide' && <SignLanguageGuide />}
          {activeTool === 'visual-alert-system' && <VisualAlertSystem />}
          {activeTool === 'live-captions' && <LiveCaptions />}
          {activeTool === 'sound-level-meter' && <SoundLevelMeter />}
          {activeTool === 'worry-management' && <WorryBox />}
          {activeTool === 'fidget-toolkit' && <FidgetToolkit />}
          {activeTool === 'choice-boards' && <ChoiceBoard />}
          {activeTool === 'peer-buddy-system' && <BuddySystem />}
          {activeTool === 'sensory-kit' && <SensoryKit />}
          {activeTool === 'weighted-tools' && <WeightedTools />}
          {activeTool === 'noise-reduction' && <NoiseReduction />}
          {activeTool === 'multi-sensory-learning' && <MultiSensoryLearning />}
          {activeTool === 'visual-schedule' && <VisualSchedule />}
          {activeTool === 'social-stories' && <SocialStories />}
          {activeTool === 'simplified-instructions' && <SimplifiedInstructions />}
          {activeTool === 'reading-supports' && <ReadingSupports />}
          {activeTool === 'repetition-reinforcement' && <RepetitionReinforcement />}
          {activeTool === 'clear-communication' && <ClearCommunication />}
          {activeTool === 'accessible-spaces' && <AccessibleSpaces />}
          {activeTool === 'adaptive-equipment' && <AdaptiveEquipment />}
          {activeTool === 'fatigue-management' && <FatigueManagement />}
          {activeTool === 'audio-description' && <AudioDescription />}
          {activeTool === 'tactile-materials' && <TactileMaterials />}
          {activeTool === 'visual-supports-hearing' && <VisualSupportsHearing />}
          {activeTool === 'gesture-signs' && <GestureSigns />}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-highlight">Accessibility Tools</span>
            <br />& Resources
          </h1>
          <p className="hero-description">
            Practical tools and strategies to support every Scout. Filter by special need or category
            to find exactly what you need.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="filters-container">
          <div className="filter-group">
            <h3 className="filter-group-title">Search Tools</h3>
            <div style={{position: 'relative', marginBottom: 'var(--space-xl)'}}>
              <Search size={20} style={{position: 'absolute', left: 'var(--space-md)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-textMuted)'}} />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Type to filter tools (e.g., visual, timer, breathing)..."
                style={{
                  width: '100%',
                  padding: 'var(--space-md) var(--space-md) var(--space-md) 48px',
                  fontSize: '1rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  backgroundColor: 'white',
                  color: '#1F2937'
                }}
              />
              {searchText && (
                <button
                  onClick={() => setSearchText('')}
                  style={{
                    position: 'absolute',
                    right: 'var(--space-md)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-textMuted)',
                    fontSize: '1.25rem'
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-group-title">Tool Category</h3>
            <div className="category-filters">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`filter-button ${selectedCategory === cat.id ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-group-title">Filter by Special Need</h3>
            <button
              className="special-needs-trigger"
              onClick={() => setShowNeedsModal(true)}
            >
              <Filter size={18} />
              <span className="trigger-text">
                {selectedNeeds.length === 0
                  ? 'All Special Needs'
                  : selectedNeeds.length === 1
                  ? specialNeeds.find(n => n.id === selectedNeeds[0])?.label
                  : `${selectedNeeds.length} selected`}
              </span>
              <span className="trigger-count">
                {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
              </span>
              <ChevronDown size={18} />
            </button>
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <h3>No tools found</h3>
            <p>Try adjusting your filters or selecting a different category.</p>
          </div>
        ) : (
          <div className="tools-grid">
            {filteredTools.map((tool) => {
              const isExpanded = expandedTool === tool.id;

              return (
                <div key={tool.id} className="tool-card">
                  {tool.heroImageUrl && (
                    <div className="tool-card-image">
                      <img src={tool.heroImageUrl} alt={tool.title} />
                    </div>
                  )}
                  <div className="tool-card-content">
                    <h3 className="tool-card-title">{tool.title}</h3>
                    <p className="tool-card-description">{tool.description}</p>

                    <div className="tool-card-badges">
                      {tool.type === 'interactive' ? (
                        <span className="badge badge-interactive">
                          <Play size={14} />
                          Interactive Tool
                        </span>
                      ) : (
                        <span className="badge badge-guide">
                          <Book size={14} />
                          Reference Guide
                        </span>
                      )}
                      <span className="badge badge-category">{tool.category}</span>
                      {tool.printableResources && (
                        <span className="badge badge-printable">
                          <Download size={14} />
                          Printable
                        </span>
                      )}
                    </div>

                    <div className="tool-card-needs">
                      <strong>Supports:</strong>{' '}
                      {tool.specialNeeds.join(', ')}
                    </div>

                    {hasInteractiveTool(tool.id) ? (
                      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                        <button
                          onClick={() => setActiveTool(getInteractiveToolId(tool.id))}
                          className="btn btn-primary"
                          style={{ flex: 1 }}
                        >
                          <Play size={18} />
                          Launch Tool
                        </button>
                        <button
                          onClick={() => toggleExpanded(tool.id)}
                          className="btn btn-secondary"
                        >
                          {isExpanded ? 'Hide' : 'Info'}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleExpanded(tool.id)}
                        className="btn btn-secondary btn-block"
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                      </button>
                    )}

                    {isExpanded && (
                      <div className="tool-card-details">
                        <div className="detail-section">
                          <h4>How to Use:</h4>
                          <ul>
                            {tool.howToUse.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ul>
                        </div>

                        {tool.materials && tool.materials.length > 0 && (
                          <div className="detail-section">
                            <h4>Materials Needed:</h4>
                            <ul>
                              {tool.materials.map((material, idx) => (
                                <li key={idx}>{material}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {tool.digitalTools && tool.digitalTools.length > 0 && (
                          <div className="detail-section">
                            <h4>
                              <ExternalLink size={16} />
                              Digital Tools:
                            </h4>
                            <ul>
                              {tool.digitalTools.map((dtool, idx) => (
                                <li key={idx}>{dtool}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showNeedsModal && (
        <div className="modal-overlay" onClick={() => setShowNeedsModal(false)}>
          <div className="modal-content special-needs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <Filter size={24} />
                Select Special Needs
              </h2>
              <div className="modal-header-actions">
                {selectedNeeds.length > 0 && (
                  <button
                    className="btn-text"
                    onClick={clearAllNeeds}
                  >
                    Clear All
                  </button>
                )}
                <button
                  className="modal-close"
                  onClick={() => setShowNeedsModal(false)}
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="modal-body">
              <div className="special-needs-grid">
                {specialNeeds.map((need) => {
                  const count = getToolCount(need.id);
                  const isSelected = selectedNeeds.includes(need.id);
                  return (
                    <button
                      key={need.id}
                      onClick={() => toggleNeed(need.id)}
                      className={`need-option ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="need-option-header">
                        <span className="need-option-label">{need.label}</span>
                        <span className="need-option-count">{count}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => setShowNeedsModal(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
