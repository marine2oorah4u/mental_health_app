import React, { useState, useEffect } from 'react';
import { Lightbulb, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  context: string;
  disability_types: string[];
  priority: number;
}

interface TipsPanelProps {
  category?: string;
  context?: string;
  disabilityTypes?: string[];
}

export function TipsPanel({ category, context, disabilityTypes = [] }: TipsPanelProps) {
  const [tips, setTips] = useState<Tip[]>([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTips();
  }, [category, context, disabilityTypes]);

  const fetchTips = async () => {
    setLoading(true);
    try {
      let query = supabase.from('tips').select('*').order('priority', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      if (context) {
        query = query.eq('context', context);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;

      if (data) {
        const filteredTips = data.filter((tip) => {
          if (disabilityTypes.length === 0) return true;
          if (tip.disability_types.includes('all')) return true;
          return tip.disability_types.some((type: string) => disabilityTypes.includes(type));
        });
        setTips(filteredTips);
      }
    } catch (error) {
      console.error('Error fetching tips:', error);
      setTips([]);
    } finally {
      setLoading(false);
    }
  };

  const nextTip = () => {
    if (currentTipIndex < tips.length - 1) {
      setCurrentTipIndex(currentTipIndex + 1);
    }
  };

  const prevTip = () => {
    if (currentTipIndex > 0) {
      setCurrentTipIndex(currentTipIndex - 1);
    }
  };

  if (loading || tips.length === 0) {
    return null;
  }

  if (isMinimized) {
    return (
      <button onClick={() => setIsMinimized(false)} className="tips-button-minimized">
        <Lightbulb size={24} />
        <span className="tips-count">{tips.length}</span>
      </button>
    );
  }

  const currentTip = tips[currentTipIndex];

  return (
    <div className={`tips-panel ${isExpanded ? 'tips-panel-expanded' : ''}`}>
      <div className="tips-panel-header">
        <div className="tips-panel-title">
          <Lightbulb size={20} />
          <span>Leader Tip</span>
        </div>
        <div className="tips-panel-actions">
          <button onClick={() => setIsMinimized(true)} className="tips-btn" title="Minimize">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="tips-panel-content">
        <h4 className="tips-title">{currentTip.title}</h4>
        <p className="tips-text">{currentTip.content}</p>
      </div>

      {tips.length > 1 && (
        <div className="tips-panel-footer">
          <button
            onClick={prevTip}
            disabled={currentTipIndex === 0}
            className="tips-nav-btn"
            title="Previous tip"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="tips-counter">
            {currentTipIndex + 1} of {tips.length}
          </span>
          <button
            onClick={nextTip}
            disabled={currentTipIndex === tips.length - 1}
            className="tips-nav-btn"
            title="Next tip"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
