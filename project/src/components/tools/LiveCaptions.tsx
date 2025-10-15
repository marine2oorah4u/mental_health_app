import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Download, Trash2, Copy, MessageSquare } from 'lucide-react';

interface Caption {
  id: string;
  text: string;
  timestamp: Date;
  speaker?: string;
}

export function LiveCaptions() {
  const [isListening, setIsListening] = useState(false);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [currentCaption, setCurrentCaption] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [speaker, setSpeaker] = useState('');
  const recognitionRef = useRef<any>(null);
  const captionsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          const newCaption: Caption = {
            id: Date.now().toString(),
            text: finalTranscript.trim(),
            timestamp: new Date(),
            speaker: speaker || undefined,
          };
          setCaptions(prev => [...prev, newCaption]);
          setCurrentCaption('');
        } else {
          setCurrentCaption(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          return;
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [speaker, isListening]);

  useEffect(() => {
    captionsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [captions, currentCaption]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setCurrentCaption('');
    }
  };

  const clearCaptions = () => {
    setCaptions([]);
    setCurrentCaption('');
  };

  const exportCaptions = () => {
    const text = captions.map(cap => {
      const time = cap.timestamp.toLocaleTimeString();
      const speakerText = cap.speaker ? `[${cap.speaker}] ` : '';
      return `${time} - ${speakerText}${cap.text}`;
    }).join('\n\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `captions-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyCaptions = async () => {
    const text = captions.map(cap => cap.text).join(' ');
    try {
      await navigator.clipboard.writeText(text);
      alert('Captions copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isSupported) {
    return (
      <div className="tool-interactive">
        <div className="tool-header">
          <MessageSquare size={24} />
          <h2>Live Captions</h2>
        </div>
        <div className="live-captions-unsupported">
          <Mic size={48} />
          <h3>Speech Recognition Not Available</h3>
          <p>
            Live captions require speech recognition support. Try using Chrome or Edge
            on desktop, or Chrome on Android.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <MessageSquare size={24} />
        <h2>Live Captions / Meeting Notes</h2>
      </div>

      <div className="live-captions-intro">
        <p>
          Real-time speech-to-text captions for meetings, activities, or conversations.
          Perfect for Deaf/Hard of Hearing scouts or taking meeting notes.
        </p>
      </div>

      <div className="live-captions-controls">
        <div className="live-captions-speaker">
          <label>
            <strong>Speaker Name (Optional):</strong>
            <input
              type="text"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              placeholder="Who is speaking?"
              className="live-captions-speaker-input"
              disabled={isListening}
            />
          </label>
        </div>

        <div className="live-captions-buttons">
          {!isListening ? (
            <button onClick={startListening} className="btn btn-primary live-captions-main-button">
              <Mic size={24} />
              Start Listening
            </button>
          ) : (
            <button onClick={stopListening} className="btn btn-danger live-captions-main-button">
              <MicOff size={24} />
              Stop Listening
            </button>
          )}

          {captions.length > 0 && (
            <>
              <button onClick={copyCaptions} className="btn btn-secondary">
                <Copy size={18} />
                Copy Text
              </button>
              <button onClick={exportCaptions} className="btn btn-secondary">
                <Download size={18} />
                Export
              </button>
              <button onClick={clearCaptions} className="btn btn-secondary">
                <Trash2 size={18} />
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {isListening && (
        <div className="live-captions-listening-indicator">
          <div className="listening-animation">
            <div className="listening-pulse"></div>
            <Mic size={24} />
          </div>
          <span>Listening...</span>
        </div>
      )}

      <div className="live-captions-display">
        <div className="live-captions-viewport">
          {captions.length === 0 && !currentCaption && (
            <div className="live-captions-empty">
              <MessageSquare size={64} />
              <p>Captions will appear here as people speak</p>
              <small>Press "Start Listening" to begin</small>
            </div>
          )}

          {captions.map((caption) => (
            <div key={caption.id} className="caption-item">
              <div className="caption-meta">
                <span className="caption-time">
                  {caption.timestamp.toLocaleTimeString()}
                </span>
                {caption.speaker && (
                  <span className="caption-speaker">{caption.speaker}</span>
                )}
              </div>
              <p className="caption-text">{caption.text}</p>
            </div>
          ))}

          {currentCaption && (
            <div className="caption-item interim">
              <div className="caption-meta">
                <span className="caption-time">Now</span>
                {speaker && <span className="caption-speaker">{speaker}</span>}
              </div>
              <p className="caption-text">{currentCaption}</p>
            </div>
          )}

          <div ref={captionsEndRef} />
        </div>
      </div>

      <div className="tool-info">
        <h3>How to Use:</h3>
        <ul>
          <li><strong>Position Microphone:</strong> Place device close to speaker</li>
          <li><strong>Quiet Background:</strong> Works best in quiet environments</li>
          <li><strong>Clear Speech:</strong> Speak clearly and at normal pace</li>
          <li><strong>Speaker Labels:</strong> Enter name before they speak</li>
          <li><strong>Export Notes:</strong> Save captions as text file</li>
        </ul>
        <h3>Perfect For:</h3>
        <ul>
          <li><strong>Deaf Scouts:</strong> Follow along in real-time</li>
          <li><strong>Hard of Hearing:</strong> Supplement hearing aids</li>
          <li><strong>Meeting Notes:</strong> Automatic transcription</li>
          <li><strong>Learning:</strong> Visual reinforcement of spoken info</li>
          <li><strong>Language Learners:</strong> See spelling of new words</li>
          <li><strong>Noisy Environments:</strong> Read what was said</li>
        </ul>
        <h3>Tips:</h3>
        <ul>
          <li>Works best with Chrome or Edge browser</li>
          <li>Requires microphone permissions</li>
          <li>Accuracy improves in quiet spaces</li>
          <li>May miss words in fast conversations</li>
          <li>Review and edit exported text for accuracy</li>
        </ul>
        <h3>Privacy:</h3>
        <ul>
          <li>Captions are not stored or sent anywhere</li>
          <li>All processing happens on your device</li>
          <li>Clear captions when done for privacy</li>
          <li>Inform others when recording/captioning</li>
        </ul>
      </div>
    </div>
  );
}
