import { useState, useRef, useEffect } from 'react';
import { Flashlight, AlertTriangle, Radio } from 'lucide-react';

export function FlashlightTool() {
  const [isSupported, setIsSupported] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [isStrobing, setIsStrobing] = useState(false);
  const [isSOS, setIsSOS] = useState(false);
  const [brightness, setBrightness] = useState(1);

  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    checkFlashlightSupport();
    return () => {
      turnOff();
    };
  }, []);

  const checkFlashlightSupport = () => {
    const hasMediaDevices = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
    setIsSupported(hasMediaDevices);
  };

  const turnOn = async () => {
    try {
      if (streamRef.current) {
        turnOff();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          advanced: [{ torch: true } as any],
        },
      });

      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any;

      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: true } as any],
        });
      }

      streamRef.current = stream;
      setIsOn(true);
    } catch (error) {
      console.error('Flashlight error:', error);
      alert('Unable to access flashlight. This feature requires camera permissions and may not work on all devices.');
    }
  };

  const turnOff = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    setIsOn(false);
    setIsStrobing(false);
    setIsSOS(false);
  };

  const toggleFlashlight = () => {
    if (isOn) {
      turnOff();
    } else {
      turnOn();
    }
  };

  const startStrobe = () => {
    if (!isOn) {
      turnOn();
    }

    setIsStrobing(true);
    setIsSOS(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      if (streamRef.current) {
        const track = streamRef.current.getVideoTracks()[0];
        const isCurrentlyOn = (track.getConstraints() as any).advanced?.[0]?.torch;
        track.applyConstraints({
          advanced: [{ torch: !isCurrentlyOn } as any],
        });
      }
    }, 100);
  };

  const startSOS = () => {
    if (!isOn) {
      turnOn();
    }

    setIsSOS(true);
    setIsStrobing(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const sosPattern = [
      200, 200, 200, 200, 200, 600,
      600, 200, 600, 200, 600, 600,
      200, 200, 200, 200, 200, 1400,
    ];

    let patternIndex = 0;

    const flashSOS = () => {
      if (!streamRef.current) return;

      const track = streamRef.current.getVideoTracks()[0];
      const duration = sosPattern[patternIndex];
      const isFlash = patternIndex % 2 === 0;

      track.applyConstraints({
        advanced: [{ torch: isFlash } as any],
      });

      patternIndex = (patternIndex + 1) % sosPattern.length;

      intervalRef.current = window.setTimeout(flashSOS, duration);
    };

    flashSOS();
  };

  const stopPattern = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsStrobing(false);
    setIsSOS(false);

    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      track.applyConstraints({
        advanced: [{ torch: true } as any],
      });
    }
  };

  if (!isSupported) {
    return (
      <div className="tool-interactive">
        <div className="tool-header">
          <Flashlight size={24} />
          <h2>Flashlight Tool</h2>
        </div>
        <div className="flashlight-unsupported">
          <AlertTriangle size={48} />
          <h3>Flashlight Not Available</h3>
          <p>
            This feature requires a device with a camera flash and may not be available
            in all browsers. Try opening this app in Chrome or Safari on a mobile device.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-interactive">
      <div className="tool-header">
        <Flashlight size={24} />
        <h2>Flashlight Tool</h2>
      </div>

      <div className="flashlight-intro">
        <p>
          Control your device's flashlight for safety, signaling, or finding items in the dark.
          Includes SOS morse code for emergencies.
        </p>
      </div>

      <div className={`flashlight-display ${isOn ? 'on' : 'off'}`}>
        <div className="flashlight-icon-wrapper">
          <Flashlight size={80} className={isOn ? 'flashlight-active' : ''} />
          {isOn && <div className="flashlight-glow"></div>}
        </div>
        <div className="flashlight-status">
          {isSOS && <div className="flashlight-mode-badge sos">SOS MODE</div>}
          {isStrobing && !isSOS && <div className="flashlight-mode-badge strobe">STROBE MODE</div>}
          {isOn && !isStrobing && !isSOS && <div className="flashlight-mode-badge on">FLASHLIGHT ON</div>}
          {!isOn && <div className="flashlight-mode-badge off">OFF</div>}
        </div>
      </div>

      <div className="flashlight-controls">
        <button
          onClick={toggleFlashlight}
          className={`btn ${isOn ? 'btn-danger' : 'btn-primary'} flashlight-main-button`}
        >
          <Flashlight size={24} />
          {isOn ? 'Turn Off' : 'Turn On'}
        </button>
      </div>

      {isOn && (
        <div className="flashlight-modes">
          <h3>Special Modes:</h3>
          <div className="flashlight-modes-grid">
            <button
              onClick={startStrobe}
              disabled={isStrobing}
              className={`flashlight-mode-button ${isStrobing ? 'active' : ''}`}
            >
              <Radio size={24} />
              <span>Strobe</span>
              <small>Fast flashing</small>
            </button>

            <button
              onClick={startSOS}
              disabled={isSOS}
              className={`flashlight-mode-button ${isSOS ? 'active' : ''}`}
            >
              <AlertTriangle size={24} />
              <span>SOS Signal</span>
              <small>Emergency morse code</small>
            </button>

            {(isStrobing || isSOS) && (
              <button
                onClick={stopPattern}
                className="flashlight-mode-button stop"
              >
                <Flashlight size={24} />
                <span>Steady Light</span>
                <small>Stop pattern</small>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="tool-info">
        <h3>When to Use:</h3>
        <ul>
          <li><strong>Finding Items:</strong> Lost items in dark spaces</li>
          <li><strong>Night Activities:</strong> Camping, night hikes, outdoor meetings</li>
          <li><strong>Getting Attention:</strong> Signal leaders or buddies</li>
          <li><strong>Emergency SOS:</strong> Morse code distress signal (... --- ...)</li>
          <li><strong>Safety:</strong> Walking in dark areas, finding your way</li>
        </ul>
        <h3>Safety Tips:</h3>
        <ul>
          <li>Don't shine directly in anyone's eyes</li>
          <li>Avoid strobe mode if you or others have epilepsy</li>
          <li>SOS pattern is internationally recognized for emergencies</li>
          <li>Save battery - turn off when not needed</li>
        </ul>
      </div>
    </div>
  );
}
