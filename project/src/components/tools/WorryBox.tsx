import { useState } from 'react';
import { Heart, Trash2, Archive, Plus, AlertCircle } from 'lucide-react';

interface Worry {
  id: string;
  text: string;
  timestamp: Date;
  archived: boolean;
}

export function WorryBox() {
  const [worries, setWorries] = useState<Worry[]>([]);
  const [newWorry, setNewWorry] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const addWorry = () => {
    if (!newWorry.trim()) return;

    const worry: Worry = {
      id: Date.now().toString(),
      text: newWorry,
      timestamp: new Date(),
      archived: false,
    };

    setWorries(prev => [worry, ...prev]);
    setNewWorry('');
  };

  const archiveWorry = (id: string) => {
    setWorries(prev => prev.map(w => w.id === id ? { ...w, archived: true } : w));
  };

  const deleteWorry = (id: string) => {
    setWorries(prev => prev.filter(w => w.id !== id));
  };

  const clearArchived = () => {
    setWorries(prev => prev.filter(w => !w.archived));
  };

  const activeWorries = worries.filter(w => !w.archived);
  const archivedWorries = worries.filter(w => w.archived);

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Heart size={24} />
        <h2>Digital Worry Box</h2>
      </div>

      <div className="worry-box-intro">
        <p>
          Write down your worries and put them in the worry box. This helps get them out of your head
          so you can focus on what you're doing. You can look at them later or let them go.
        </p>
      </div>

      <div className="worry-box-input">
        <div className="worry-input-container">
          <AlertCircle size={20} />
          <input
            type="text"
            value={newWorry}
            onChange={(e) => setNewWorry(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addWorry()}
            placeholder="What's worrying you?"
            className="worry-input"
          />
        </div>
        <button
          onClick={addWorry}
          disabled={!newWorry.trim()}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Add to Box
        </button>
      </div>

      <div className="worry-box-stats">
        <div className="worry-stat">
          <strong>{activeWorries.length}</strong>
          <span>Active Worries</span>
        </div>
        <div className="worry-stat">
          <strong>{archivedWorries.length}</strong>
          <span>Let Go</span>
        </div>
      </div>

      <div className="worry-box-toggle">
        <button
          onClick={() => setShowArchived(false)}
          className={`worry-toggle-button ${!showArchived ? 'active' : ''}`}
        >
          Current Worries
        </button>
        <button
          onClick={() => setShowArchived(true)}
          className={`worry-toggle-button ${showArchived ? 'active' : ''}`}
        >
          Let Go ({archivedWorries.length})
        </button>
      </div>

      {!showArchived ? (
        <div className="worry-box-list">
          {activeWorries.length === 0 ? (
            <div className="worry-box-empty">
              <Heart size={64} />
              <h3>No worries in your box</h3>
              <p>When something worries you, write it down and put it here.</p>
            </div>
          ) : (
            <div className="worry-items">
              {activeWorries.map((worry) => (
                <div key={worry.id} className="worry-item active">
                  <div className="worry-content">
                    <p className="worry-text">{worry.text}</p>
                    <span className="worry-time">
                      {worry.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <div className="worry-actions">
                    <button
                      onClick={() => archiveWorry(worry.id)}
                      className="btn btn-secondary btn-small"
                      title="Let this worry go"
                    >
                      <Archive size={18} />
                      Let Go
                    </button>
                    <button
                      onClick={() => deleteWorry(worry.id)}
                      className="btn btn-danger btn-small"
                      title="Delete worry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="worry-box-list">
          {archivedWorries.length === 0 ? (
            <div className="worry-box-empty">
              <Archive size={64} />
              <h3>No archived worries</h3>
              <p>When you let go of a worry, it will appear here.</p>
            </div>
          ) : (
            <>
              <div className="worry-archived-header">
                <p>These worries have been let go. You can delete them permanently or just leave them here.</p>
                <button onClick={clearArchived} className="btn btn-danger btn-small">
                  <Trash2 size={18} />
                  Clear All Archived
                </button>
              </div>
              <div className="worry-items">
                {archivedWorries.map((worry) => (
                  <div key={worry.id} className="worry-item archived">
                    <div className="worry-content">
                      <p className="worry-text">{worry.text}</p>
                      <span className="worry-time">
                        {worry.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <div className="worry-actions">
                      <button
                        onClick={() => deleteWorry(worry.id)}
                        className="btn btn-danger btn-small"
                        title="Delete permanently"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="worry-box-coping">
        <h3>When Worries Feel Big:</h3>
        <div className="coping-strategies">
          <div className="coping-card">
            <h4>🫁 Take Deep Breaths</h4>
            <p>Breathe in for 4, hold for 4, out for 4</p>
          </div>
          <div className="coping-card">
            <h4>💬 Talk to Someone</h4>
            <p>Share your worry with a trusted adult</p>
          </div>
          <div className="coping-card">
            <h4>🎨 Do Something Fun</h4>
            <p>Distract yourself with an activity you enjoy</p>
          </div>
          <div className="coping-card">
            <h4>🧘 Use Grounding</h4>
            <p>Try the 5-4-3-2-1 grounding exercise</p>
          </div>
          <div className="coping-card">
            <h4>📝 Write It Down</h4>
            <p>Put all your thoughts on paper</p>
          </div>
          <div className="coping-card">
            <h4>🏃 Move Your Body</h4>
            <p>Physical activity helps reduce worry</p>
          </div>
        </div>
      </div>

      <div className="tool-info">
        <h3>How the Worry Box Works:</h3>
        <ul>
          <li><strong>Write It Down:</strong> Getting worries out of your head onto paper (or screen) helps reduce their power</li>
          <li><strong>Put It Away:</strong> Once written, you don't need to keep thinking about it</li>
          <li><strong>Let It Go:</strong> When you're ready, archive the worry to symbolically release it</li>
          <li><strong>Not Ignoring:</strong> This isn't about pretending worries don't exist - it's about managing them</li>
          <li><strong>Check Back:</strong> You can always look at old worries and see how many resolved on their own</li>
        </ul>
        <h3>Who Benefits:</h3>
        <ul>
          <li><strong>Anxiety:</strong> Reduces rumination and overthinking</li>
          <li><strong>ADHD:</strong> Clears mental clutter</li>
          <li><strong>Autism:</strong> Provides structure for managing emotions</li>
          <li><strong>All Scouts:</strong> Healthy coping strategy for everyone</li>
        </ul>
        <h3>When to Use:</h3>
        <ul>
          <li>Before bed when worries keep you awake</li>
          <li>Before activities that cause anxiety</li>
          <li>During scout meetings when worries come up</li>
          <li>Anytime something feels too big to handle</li>
        </ul>
      </div>
    </div>
  );
}
