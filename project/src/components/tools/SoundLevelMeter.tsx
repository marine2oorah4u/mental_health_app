import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Activity, AlertTriangle } from 'lucide-react';

export function SoundLevelMeter() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [soundLevel, setSoundLevel] = useState(0);
  const [peakLevel, setPeakLevel] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState(70);
  const [isOverThreshold, setIsOverThreshold] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const hasMedia = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    setIsSupported(hasMedia);

    return () => {
      stopMonitoring();
    };
  }, []);

  useEffect(() => {
    setIsOverThreshold(soundLevel > alertThreshold);
  }, [soundLevel, alertThreshold]);

  const startMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;

      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);

      setIsMonitoring(true);
      updateSoundLevel();
    } catch (error) {
      console.error('Microphone access error:', error);
      alert('Unable to access microphone. Please grant permission and try again.');
    }
  };

  const stopMonitoring = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    analyserRef.current = null;
    setIsMonitoring(false);
    setSoundLevel(0);
    setPeakLevel(0);
  };

  const updateSoundLevel = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    const level = Math.min(100, Math.round((average / 255) * 100));

    setSoundLevel(level);
    setPeakLevel(prev => Math.max(prev, level));

    animationFrameRef.current = requestAnimationFrame(updateSoundLevel);
  };

  const getSoundLevelColor = (level: number) => {
    if (level < 30) return '#10B981';
    if (level < 60) return '#F59E0B';
    return '#EF4444';
  };

  const getSoundLevelLabel = (level: number) => {
    if (level < 20) return 'Very Quiet';
    if (level < 40) return 'Quiet';
    if (level < 60) return 'Moderate';
    if (level < 80) return 'Loud';
    return 'Very Loud';
  };

  const getSoundLevelDescription = (level: number) => {
    if (level < 20) return 'Library, whisper';
    if (level < 40) return 'Normal conversation';
    if (level < 60) return 'Office, restaurant';
    if (level < 80) return 'Busy street, alarm';
    return 'Concert, machinery';
  };

  if (!isSupported) {
    return (
      <div className="tool-interactive">
        <div className="tool-header">
          <Volume2 size={24} />
          <h2>Sound Level Meter</h2>
        </div>
        <div className="sound-meter-unsupported">
          <VolumeX size={48} />
          <h3>Microphone Not Available</h3>
          <p>
            This tool requires microphone access. Make sure you're using a modern browser
            and have granted microphone permissions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Volume2 size={24} />
        <h2>Sound Level Meter</h2>
      </div>

      <div className="sound-meter-intro">
        <p>
          Visual indicator of ambient noise levels. Helps Deaf/Hard of Hearing scouts
          understand the noise environment and identify when it's too loud for conversation.
        </p>
      </div>

      <div className="sound-meter-display">
        <div className="sound-meter-circle" style={{
          borderColor: getSoundLevelColor(soundLevel),
          boxShadow: isMonitoring ? `0 0 40px ${getSoundLevelColor(soundLevel)}` : 'none',
        }}>
          <div className="sound-meter-level" style={{ color: getSoundLevelColor(soundLevel) }}>
            {soundLevel}
            <span className="sound-meter-unit">dB</span>
          </div>
          <div className="sound-meter-label">{getSoundLevelLabel(soundLevel)}</div>
          <div className="sound-meter-description">{getSoundLevelDescription(soundLevel)}</div>
        </div>

        {isMonitoring && (
          <div className="sound-meter-visualizer">
            <div className="sound-bars">
              {[...Array(20)].map((_, i) => {
                const barHeight = Math.max(0, soundLevel - (i * 5));
                return (
                  <div
                    key={i}
                    className="sound-bar"
                    style={{
                      height: `${barHeight}%`,
                      backgroundColor: getSoundLevelColor(i * 5),
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="sound-meter-stats">
        <div className="sound-stat">
          <Activity size={20} />
          <div>
            <strong>Current Level</strong>
            <p>{soundLevel} dB</p>
          </div>
        </div>
        <div className="sound-stat">
          <Volume2 size={20} />
          <div>
            <strong>Peak Level</strong>
            <p>{peakLevel} dB</p>
          </div>
        </div>
        <div className="sound-stat">
          <AlertTriangle size={20} />
          <div>
            <strong>Alert Threshold</strong>
            <p>{alertThreshold} dB</p>
          </div>
        </div>
      </div>

      {isOverThreshold && isMonitoring && (
        <div className="sound-meter-alert">
          <AlertTriangle size={24} />
          <div>
            <strong>Too Loud!</strong>
            <p>Sound level is above your threshold ({alertThreshold} dB)</p>
          </div>
        </div>
      )}

      <div className="sound-meter-controls">
        {!isMonitoring ? (
          <button onClick={startMonitoring} className="btn btn-primary sound-meter-main-button">
            <Volume2 size={24} />
            Start Monitoring
          </button>
        ) : (
          <button onClick={stopMonitoring} className="btn btn-danger sound-meter-main-button">
            <VolumeX size={24} />
            Stop Monitoring
          </button>
        )}
      </div>

      <div className="sound-meter-threshold">
        <label>
          <strong>Alert Threshold: {alertThreshold} dB</strong>
          <p className="sound-meter-threshold-help">
            You'll be alerted when sound exceeds this level
          </p>
        </label>
        <input
          type="range"
          min="30"
          max="90"
          step="5"
          value={alertThreshold}
          onChange={(e) => setAlertThreshold(Number(e.target.value))}
          className="sound-meter-threshold-slider"
        />
        <div className="sound-meter-threshold-labels">
          <span>30 dB<br/><small>Quiet</small></span>
          <span>60 dB<br/><small>Moderate</small></span>
          <span>90 dB<br/><small>Loud</small></span>
        </div>
      </div>

      <div className="sound-meter-reference">
        <h3>Sound Level Reference:</h3>
        <div className="sound-level-examples">
          <div className="sound-example quiet">
            <div className="sound-example-bar"></div>
            <div>
              <strong>0-30 dB</strong>
              <p>Whisper, library, quiet room</p>
            </div>
          </div>
          <div className="sound-example moderate">
            <div className="sound-example-bar"></div>
            <div>
              <strong>30-60 dB</strong>
              <p>Normal conversation, office</p>
            </div>
          </div>
          <div className="sound-example loud">
            <div className="sound-example-bar"></div>
            <div>
              <strong>60-80 dB</strong>
              <p>Busy traffic, restaurant, TV</p>
            </div>
          </div>
          <div className="sound-example very-loud">
            <div className="sound-example-bar"></div>
            <div>
              <strong>80+ dB</strong>
              <p>Concerts, power tools, shouting</p>
            </div>
          </div>
        </div>
      </div>

      <div className="tool-info">
        <h3>How to Use:</h3>
        <ul>
          <li><strong>Grant Microphone Access:</strong> Allow permission when prompted</li>
          <li><strong>Position Device:</strong> Place in center of area to monitor</li>
          <li><strong>Set Threshold:</strong> Choose comfort level for alerts</li>
          <li><strong>Visual Feedback:</strong> Color changes with noise level</li>
        </ul>
        <h3>Who Benefits:</h3>
        <ul>
          <li><strong>Deaf Scouts:</strong> See noise levels they can't hear</li>
          <li><strong>Hard of Hearing:</strong> Know when environment is too noisy</li>
          <li><strong>Sensory Sensitive:</strong> Monitor noise for overwhelm</li>
          <li><strong>All Scouts:</strong> Learn about sound awareness</li>
          <li><strong>Leaders:</strong> Manage group noise levels</li>
        </ul>
        <h3>Use Cases:</h3>
        <ul>
          <li>Check if room is quiet enough for conversation</li>
          <li>Monitor campfire noise levels</li>
          <li>Alert when environment becomes too loud</li>
          <li>Teach scouts about hearing protection</li>
          <li>Find quieter spaces during activities</li>
        </ul>
        <h3>Note:</h3>
        <ul>
          <li>Readings are approximate, not professional grade</li>
          <li>Different devices may show different readings</li>
          <li>Use as a general guide, not medical advice</li>
          <li>Prolonged exposure to 85+ dB can damage hearing</li>
        </ul>
      </div>
    </div>
  );
}
