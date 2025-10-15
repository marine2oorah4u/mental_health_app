import React from 'react';
import { BookOpen, ExternalLink, FileText, Video, Users, Award } from 'lucide-react';

export function AutismResources() {
  const scoutingResources = [
    {
      title: 'Guide to Advancement - Section 10',
      description: 'Official Scouting America guidance on accommodations and alternate requirements',
      url: 'https://www.scouting.org/resources/guide-to-advancement/',
      type: 'guide',
      icon: Award,
    },
    {
      title: 'Inclusion Toolbox',
      description: 'Resources for creating inclusive Scouting units',
      url: 'https://www.scouting.org/programs/',
      type: 'guide',
      icon: BookOpen,
    },
    {
      title: 'Medical Forms & Health Information',
      description: 'Required health forms including special needs documentation',
      url: 'https://www.scouting.org/health-and-safety/ahmr/',
      type: 'form',
      icon: FileText,
    },
  ];

  const autismOrganizations = [
    {
      name: 'Autism Speaks',
      description: 'Autism Response Team, resources, and family support',
      website: 'https://www.autismspeaks.org',
      phone: '888-288-4762',
      category: 'Autism',
    },
    {
      name: 'Autism Society of America',
      description: 'Local chapters, support groups, and community resources',
      website: 'https://autismsociety.org',
      phone: '800-328-8476',
      category: 'Autism',
    },
    {
      name: 'ASAN (Autistic Self Advocacy Network)',
      description: 'Autism advocacy organization run by and for autistic people',
      website: 'https://autisticadvocacy.org',
      phone: null,
      category: 'Autism',
    },
    {
      name: 'CHADD (Children and Adults with ADHD)',
      description: 'National resource on ADHD with chapters, support groups, and education',
      website: 'https://chadd.org',
      phone: '301-306-7070',
      category: 'ADHD',
    },
    {
      name: 'Learning Disabilities Association of America',
      description: 'Support for learning disabilities including dyslexia, dysgraphia, and more',
      website: 'https://ldaamerica.org',
      phone: '412-341-1515',
      category: 'Learning Disabilities',
    },
    {
      name: 'National Down Syndrome Society',
      description: 'Advocacy, resources, and community for people with Down syndrome',
      website: 'https://www.ndss.org',
      phone: '800-221-4602',
      category: 'Down Syndrome',
    },
    {
      name: 'Anxiety and Depression Association of America',
      description: 'Resources for anxiety, depression, and related disorders',
      website: 'https://adaa.org',
      phone: null,
      category: 'Mental Health',
    },
    {
      name: 'SPD Foundation (Sensory Processing Disorder)',
      description: 'Education and support for sensory processing challenges',
      website: 'https://www.spdfoundation.net',
      phone: null,
      category: 'Sensory Processing',
    },
  ];

  const learningResources = [
    {
      title: 'Understanding Autism Spectrum Disorder',
      description: 'Video series on autism basics, communication, and behavior',
      type: 'video',
      source: 'CDC',
    },
    {
      title: 'ADHD in Youth: Strategies for Success',
      description: 'Understanding ADHD and implementing effective accommodations',
      type: 'article',
      source: 'CHADD',
    },
    {
      title: 'Visual Supports for All Learners',
      description: 'How to create and use visual schedules, social stories, and communication boards',
      type: 'article',
      source: 'Special Needs Resources',
    },
    {
      title: 'Sensory Processing Differences',
      description: 'Understanding sensory sensitivities and creating sensory-friendly environments',
      type: 'article',
      source: 'SPD Foundation',
    },
    {
      title: 'Supporting Scouts with Special Needs in Outdoor Settings',
      description: 'Practical strategies for camping, hiking, and outdoor activities for all abilities',
      type: 'guide',
      source: 'Scout Inclusion Platform',
    },
    {
      title: 'Inclusive Communication Strategies',
      description: 'Effective communication techniques for diverse learning styles and abilities',
      type: 'guide',
      source: 'Scouting America',
    },
  ];

  return (
    <div className="autism-resources">
      <div className="builder-header">
        <h2 className="section-title">Special Needs Resources & Education</h2>
        <p className="hero-description">
          Curated resources for parents, leaders, and Scouts to better understand various special needs
          and create inclusive Scouting experiences for all.
        </p>
      </div>

      <div className="section">
        <h3 className="subsection-title">Official Scouting America Resources</h3>
        <div className="resource-cards">
          {scoutingResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-card"
              >
                <div className="resource-icon">
                  <Icon size={24} />
                </div>
                <div className="resource-content">
                  <h4 className="resource-title">{resource.title}</h4>
                  <p className="resource-description">{resource.description}</p>
                </div>
                <ExternalLink size={20} className="resource-link-icon" />
              </a>
            );
          })}
        </div>
      </div>

      <div className="section">
        <h3 className="subsection-title">Special Needs Organizations</h3>
        <div className="organization-list">
          {autismOrganizations.map((org, index) => (
            <div key={index} className="organization-card">
              <div className="organization-header">
                <Users size={24} />
                <div>
                  <h4 className="organization-name">{org.name}</h4>
                  <p className="organization-description">{org.description}</p>
                </div>
              </div>
              <div className="organization-contact">
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="organization-link"
                >
                  <ExternalLink size={16} />
                  {org.website}
                </a>
                {org.phone && (
                  <a href={`tel:${org.phone}`} className="organization-phone">
                    {org.phone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h3 className="subsection-title">Learning Resources</h3>
        <div className="learning-grid">
          {learningResources.map((resource, index) => (
            <div key={index} className="learning-card">
              <div className="learning-type">
                {resource.type === 'video' && <Video size={20} />}
                {resource.type === 'article' && <FileText size={20} />}
                {resource.type === 'guide' && <BookOpen size={20} />}
                <span>{resource.type}</span>
              </div>
              <h4 className="learning-title">{resource.title}</h4>
              <p className="learning-description">{resource.description}</p>
              <div className="learning-source">Source: {resource.source}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="info-card">
          <h3 className="info-card-title">Books We Recommend</h3>
          <ul className="book-list">
            <li>
              <strong>"Uniquely Human: A Different Way of Seeing Autism"</strong> by Barry Prizant (Autism)
            </li>
            <li>
              <strong>"The Reason I Jump"</strong> by Naoki Higashida (Autism)
            </li>
            <li>
              <strong>"Smart but Scattered"</strong> by Peg Dawson (ADHD & Executive Function)
            </li>
            <li>
              <strong>"The Out-of-Sync Child"</strong> by Carol Kranowitz (Sensory Processing)
            </li>
            <li>
              <strong>"Different, Not Less"</strong> by Temple Grandin (Neurodiversity)
            </li>
            <li>
              <strong>"The Whole-Brain Child"</strong> by Daniel Siegel (All learners)
            </li>
            <li>
              <strong>"Parenting Children with ADHD"</strong> by Vincent Monastra (ADHD)
            </li>
            <li>
              <strong>"No More Meltdowns"</strong> by Jed Baker (Behavior & Emotional Regulation)
            </li>
          </ul>
        </div>
      </div>

      <div className="section">
        <div className="alert-box alert-info">
          <BookOpen size={24} />
          <div>
            <strong>Looking for more resources?</strong> Visit the{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>
              Resources & Forms
            </a>{' '}
            section for additional Scouting America materials, local council contacts, and printable
            forms.
          </div>
        </div>
      </div>
    </div>
  );
}
