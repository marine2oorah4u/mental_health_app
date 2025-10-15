import React from 'react';
import {
  ArrowLeft,
  Printer,
  Download,
  FileText,
  CheckSquare,
  AlertCircle,
} from 'lucide-react';

interface Form {
  id: string;
  title: string;
  description: string;
  category: string;
  isPrintable: boolean;
}

interface FormPreviewProps {
  form: Form;
  onBack: () => void;
}

export function FormPreview({ form, onBack }: FormPreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      medical: 'bg-red-100 text-red-800',
      advancement: 'bg-blue-100 text-blue-800',
      accommodation: 'bg-green-100 text-green-800',
      activity: 'bg-yellow-100 text-yellow-800',
      emergency: 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const renderFormContent = () => {
    switch (form.id) {
      case 'calm-plan':
        return (
          <div className="form-template">
            <h3 className="form-section-title">Scout Information</h3>
            <div className="form-field-group">
              <div className="form-field">
                <label>Scout Name:</label>
                <div className="form-blank-line"></div>
              </div>
              <div className="form-field">
                <label>Unit Number:</label>
                <div className="form-blank-line"></div>
              </div>
              <div className="form-field">
                <label>Date:</label>
                <div className="form-blank-line"></div>
              </div>
            </div>

            <h3 className="form-section-title">Triggers & Warning Signs</h3>
            <p className="form-instruction">
              List situations, sensations, or changes that may cause stress or overwhelm:
            </p>
            <div className="form-checklist">
              <label className="form-checkbox">
                <input type="checkbox" /> Loud noises
              </label>
              <label className="form-checkbox">
                <input type="checkbox" /> Crowded spaces
              </label>
              <label className="form-checkbox">
                <input type="checkbox" /> Unexpected changes
              </label>
              <label className="form-checkbox">
                <input type="checkbox" /> Strong smells
              </label>
              <label className="form-checkbox">
                <input type="checkbox" /> Bright lights
              </label>
              <label className="form-checkbox">
                <input type="checkbox" /> Physical touch
              </label>
              <label className="form-checkbox">
                <input type="checkbox" /> Time pressure
              </label>
              <label className="form-checkbox">
                <input type="checkbox" /> Transitions between activities
              </label>
            </div>
            <div className="form-textarea-space">
              <label>Other triggers:</label>
              <div className="form-lines">
                <div className="form-line"></div>
                <div className="form-line"></div>
                <div className="form-line"></div>
              </div>
            </div>

            <h3 className="form-section-title">Calm-Down Strategies</h3>
            <p className="form-instruction">
              What helps this Scout calm down when feeling overwhelmed?
            </p>
            <div className="form-checklist">
              <label className="form-checkbox">
                <input type="checkbox" /> Deep breathing exercises
              </label>
              <label className="form-checkbox">
                <input type="checkbox" /> Quiet break area
              </label>
              <label className="form-checkbox">
                <input type="checkbox" /> Fidget tools
              </label>
              <label className="form-checkbox">
                <input type="checkbox" /> Headphones/ear protection
              </label>
              <label className="form-checkbox">
                <input type="checkbox" /> Visual timer
              </label>
              <label className="form-checkbox">
                <input type="checkbox" /> Weighted blanket/vest
              </label>
              <label className="form-checkbox">
                <input type="checkbox" /> Physical movement
              </label>
              <label className="form-checkbox">
                <input type="checkbox" /> Listen to music
              </label>
            </div>
            <div className="form-textarea-space">
              <label>Other strategies:</label>
              <div className="form-lines">
                <div className="form-line"></div>
                <div className="form-line"></div>
                <div className="form-line"></div>
              </div>
            </div>

            <h3 className="form-section-title">Communication & Support</h3>
            <div className="form-textarea-space">
              <label>How does this Scout communicate when upset?</label>
              <div className="form-lines">
                <div className="form-line"></div>
                <div className="form-line"></div>
              </div>
            </div>
            <div className="form-textarea-space">
              <label>Sensory accommodations needed:</label>
              <div className="form-lines">
                <div className="form-line"></div>
                <div className="form-line"></div>
              </div>
            </div>

            <h3 className="form-section-title">Emergency Contacts</h3>
            <div className="form-field-group">
              <div className="form-field">
                <label>Primary Contact:</label>
                <div className="form-blank-line"></div>
              </div>
              <div className="form-field">
                <label>Phone:</label>
                <div className="form-blank-line"></div>
              </div>
            </div>

            <div className="form-textarea-space">
              <label>Additional notes for leaders:</label>
              <div className="form-lines">
                <div className="form-line"></div>
                <div className="form-line"></div>
                <div className="form-line"></div>
              </div>
            </div>
          </div>
        );

      case 'sensory-checklist':
        return (
          <div className="form-template">
            <h3 className="form-section-title">Scout Information</h3>
            <div className="form-field-group">
              <div className="form-field">
                <label>Scout Name:</label>
                <div className="form-blank-line"></div>
              </div>
              <div className="form-field">
                <label>Date:</label>
                <div className="form-blank-line"></div>
              </div>
            </div>

            <h3 className="form-section-title">Sensory Preferences</h3>
            <p className="form-instruction">Check all that apply for each category:</p>

            <div className="sensory-category">
              <h4>Visual (Sight)</h4>
              <div className="form-checklist">
                <label className="form-checkbox">
                  <input type="checkbox" /> Sensitive to bright lights
                </label>
                <label className="form-checkbox">
                  <input type="checkbox" /> Prefers dim lighting
                </label>
                <label className="form-checkbox">
                  <input type="checkbox" /> Needs sunglasses outdoors
                </label>
                <label className="form-checkbox">
                  <input type="checkbox" /> Avoids flashing lights
                </label>
              </div>
            </div>

            <div className="sensory-category">
              <h4>Auditory (Sound)</h4>
              <div className="form-checklist">
                <label className="form-checkbox">
                  <input type="checkbox" /> Sensitive to loud noises
                </label>
                <label className="form-checkbox">
                  <input type="checkbox" /> Needs noise-canceling headphones
                </label>
                <label className="form-checkbox">
                  <input type="checkbox" /> Prefers quiet environments
                </label>
                <label className="form-checkbox">
                  <input type="checkbox" /> Needs advance warning of loud activities
                </label>
              </div>
            </div>

            <div className="sensory-category">
              <h4>Tactile (Touch)</h4>
              <div className="form-checklist">
                <label className="form-checkbox">
                  <input type="checkbox" /> Avoids certain textures
                </label>
                <label className="form-checkbox">
                  <input type="checkbox" /> Dislikes physical touch
                </label>
                <label className="form-checkbox">
                  <input type="checkbox" /> Prefers loose clothing
                </label>
                <label className="form-checkbox">
                  <input type="checkbox" /> Seeks deep pressure
                </label>
              </div>
            </div>

            <div className="form-textarea-space">
              <label>Accommodations needed at meetings/events:</label>
              <div className="form-lines">
                <div className="form-line"></div>
                <div className="form-line"></div>
                <div className="form-line"></div>
                <div className="form-line"></div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="form-template">
            <h3 className="form-section-title">Form Preview</h3>
            <p className="form-instruction">
              This is a fillable form template. You can print this page and fill it out by hand,
              or use a PDF editor to fill it digitally.
            </p>
            <div className="form-placeholder">
              <FileText size={48} />
              <p>Form template preview will be displayed here</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="preview-page">
      <div className="preview-header no-print">
        <button onClick={onBack} className="btn-back">
          <ArrowLeft size={20} />
          Back to Forms
        </button>

        <div className="preview-actions">
          <button onClick={handleDownload} className="btn btn-secondary btn-small">
            <Download size={16} />
            Download PDF
          </button>
          <button onClick={handlePrint} className="btn btn-primary btn-small">
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      <div className="preview-content">
        <div className="preview-title-section">
          <h1 className="preview-title">{form.title}</h1>
          <p className="preview-description">{form.description}</p>

          <div className="preview-meta">
            <span className={`preview-badge ${getCategoryColor(form.category)}`}>
              {form.category.replace('-', ' ')}
            </span>
          </div>
        </div>

        <div className="preview-sections">
          <div className="form-alert">
            <AlertCircle size={20} />
            <div>
              <strong>How to use this form:</strong>
              <p>
                Print this page and fill it out by hand, or save as PDF to fill digitally. Keep
                completed forms with your Scout's records and share copies with relevant leaders.
              </p>
            </div>
          </div>

          {renderFormContent()}
        </div>

        <div className="preview-footer">
          <div className="preview-tip">
            <strong>Privacy Note:</strong> This form contains personal health information. Share
            only with leaders who need to know to support your Scout. Store securely and update
            regularly.
          </div>
        </div>
      </div>
    </div>
  );
}
