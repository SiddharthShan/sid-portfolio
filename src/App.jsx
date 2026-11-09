import { useEffect, useRef, useState } from 'react'
import GrocerCentral from './grocer-central/GrocerCentral'

const resumeDocument = {
  previewTitle: 'Resume preview',
  filePath: '/resume.pdf',
  downloadName: 'Sid-Resume.pdf',
  downloadLabel: 'Download Resume',
}

const experienceItems = [
  {
    role: '[Current job title]',
    company: '[Second company name — current]',
    period: '[Start year – Present]',
    summary:
      '[Sample description of your responsibilities and contributions in your current role.]',
  },
  {
    role: '[Previous job title]',
    company: '[First company name — previous]',
    period: '[Start year – End year]',
    summary:
      '[Sample description of your responsibilities and contributions in your previous role.]',
  },
]

const certificationItems = [
  {
    id: 'istqb-foundation',
    category: 'ISTQB CERTIFICATION',
    title: 'Foundation Level Certificate in Software Testing',
    issuer: 'Indian Testing Board (ITB) · ISTQB',
    awardedOn: '4 June 2026',
    certificateNumber: 'ITB - CTFL-155282 India',
    filePath: '/certificates/istqb-foundation.pdf',
    downloadName: 'ISTQB-Foundation-Certificate.pdf',
  },
]

const projectItems = [
  {
    id: 'web-automation',
    number: '01',
    category: 'WEB AUTOMATION',
    title: '[Web application or feature]',
    description:
      '[Describe a real workflow you tested or automated using Java and Selenium.]',
    imagePath: '/images/web-automation.jpg',
    imageAlt: 'Static image for the web automation project',
  },
  {
    id: 'mobile-testing',
    number: '02',
    category: 'MOBILE TESTING',
    title: '[Mobile application or feature]',
    description:
      '[Describe a real mobile testing task using Appium or manual testing.]',
    imagePath: '/images/mobile-testing.jpg',
    imageAlt: 'Static image for the mobile testing project',
  },
]

const artifactItems = [
  {
    id: 'test-plan',
    type: 'TEST PLAN',
    title: 'Test Plan',
    description:
      'Describes the testing scope, objectives, approach, resources, and schedule.',
    filePath: '/project-artifacts/portfolio-qa-case-study/test-plan.xls',
    downloadName: 'test-plan.xls',
    downloadLabel: 'Download spreadsheet',
  },
  {
    id: 'test-cases',
    type: 'TEST CASES',
    title: 'Test Cases',
    description:
      'Lists test scenarios, steps, test data, and expected results.',
    filePath: '/project-artifacts/portfolio-qa-case-study/test-cases.xls',
    downloadName: 'test-cases.xls',
    downloadLabel: 'Download spreadsheet',
  },
  {
    id: 'sample-bug-report',
    type: 'BUG REPORT',
    title: 'Sample Bug Report',
    description:
      'Shows how to document a defect, including reproduction steps and expected and actual results.',
    filePath:
      '/project-artifacts/portfolio-qa-case-study/sample-bug-report.pdf',
    downloadName: 'sample-bug-report.pdf',
    downloadLabel: 'Download bug report',
    previewTitle: 'Sample Bug Report preview',
  },
]

const skillItems = [
  'Manual testing',
  'Java',
  'Selenium',
  'Appium',
  'Mobile app testing',
  'Sample skill 6',
  'Sample skill 7',
]

const contactItems = [
  {
    label: 'Email',
    value: 'siddharthshanmugamps@gmail.com',
    href: 'mailto:siddharthshanmugamps@gmail.com',
    icon: '@',
  },
  {
    label: 'Phone',
    value: '+91 95855 66551',
    href: 'tel:+919585566551',
    icon: '☎',
  },
  {
    label: 'Location',
    value: 'Coimbatore, Tamil Nadu, India',
    icon: '⌖',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/siddharthshanmugam',
    href: 'https://www.linkedin.com/in/siddharthshanmugam/',
    icon: 'in',
  },
  {
    label: 'GitHub',
    value: 'github.com/SiddharthShan',
    href: 'https://github.com/SiddharthShan',
    icon: 'GH',
  },
]

const primaryNavigation = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#projects' },
  { label: 'Contact', href: '#contact' },
  { label: 'Bug Hunt', href: '#bug-hunt' },
]

const additionalNavigation = [
  { label: 'Certifications', href: '#certifications' },
  { label: 'QA samples', href: '#qa-artifacts' },
  { label: 'Skills', href: '#skills' },
]

function ProjectImage({ src, alt }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="project-image-fallback" role="img" aria-label={alt}>
        <span aria-hidden="true">▣</span>
        <p>Image coming soon</p>
      </div>
    )
  }

  return (
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
  )
}

function App() {
  const [activeDocument, setActiveDocument] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [contactFormStatus, setContactFormStatus] = useState('')
  const [contactFormState, setContactFormState] = useState('idle')
  const [isGrocerCentralOpen, setIsGrocerCentralOpen] = useState(false)
  const heroRef = useRef(null)
  const documentDialogRef = useRef(null)
  const contactDialogRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current

    if (!hero) {
      return undefined
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let animationFrame = 0

    function updateHeroAnimation() {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }

      animationFrame = window.requestAnimationFrame(() => {
        const scrollDistance = hero.offsetHeight - window.innerHeight
        const rawProgress =
          scrollDistance > 0
            ? -hero.getBoundingClientRect().top / scrollDistance
            : 0
        const progress = Math.min(1, Math.max(0, rawProgress))
        const elementProgress = reduceMotion ? 0 : progress

        hero.style.setProperty(
          '--element-progress',
          elementProgress.toFixed(3),
        )
        hero.style.setProperty(
          '--element-y',
          `${Math.round(-68 * elementProgress)}px`,
        )
        hero.style.setProperty(
          '--element-opacity',
          (1 - elementProgress).toFixed(3),
        )
        hero.style.setProperty(
          '--grid-opacity',
          (0.16 + progress * 0.08).toFixed(3),
        )

        animationFrame = 0
      })
    }

    updateHeroAnimation()
    window.addEventListener('scroll', updateHeroAnimation, { passive: true })
    window.addEventListener('resize', updateHeroAnimation)

    return () => {
      window.removeEventListener('scroll', updateHeroAnimation)
      window.removeEventListener('resize', updateHeroAnimation)

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  useEffect(() => {
    const dialog = documentDialogRef.current

    if (!dialog) {
      return
    }

    if (activeDocument && !dialog.open) {
      dialog.showModal()
    } else if (!activeDocument && dialog.open) {
      dialog.close()
    }
  }, [activeDocument])

  useEffect(() => {
    const dialog = contactDialogRef.current

    if (!dialog) {
      return
    }

    if (contactDialogOpen && !dialog.open) {
      dialog.showModal()
    } else if (!contactDialogOpen && dialog.open) {
      dialog.close()
    }
  }, [contactDialogOpen])

  function openContactDialog() {
    setContactFormStatus('')
    setContactFormState('idle')
    setContactDialogOpen(true)
  }

  async function handleContactFormSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

    if (!accessKey) {
      setContactFormState('error')
      setContactFormStatus(
        'The contact form is not configured yet. Add VITE_WEB3FORMS_ACCESS_KEY to your environment.',
      )
      return
    }

    setContactFormState('sending')
    setContactFormStatus('Sending your message…')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.get('name'),
          email: formData.get('email'),
          topic: formData.get('topic') || 'Not specified',
          message: formData.get('message'),
          subject: `Portfolio message from ${formData.get('name')}`,
          from_name: 'Sid Portfolio',
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'The message could not be sent.')
      }

      form.reset()
      setContactFormState('success')
      setContactFormStatus(
        'Thanks — your message is on its way. I’ll get back to you soon.',
      )
    } catch (error) {
      setContactFormState('error')
      setContactFormStatus(
        error instanceof Error && error.message
          ? `Sorry, something went wrong: ${error.message}`
          : 'Sorry, something went wrong. Please try again or email me directly.',
      )
    }
  }

  function openCertificatePreview(certificate) {
    setActiveDocument({
      previewTitle: `${certificate.title} preview`,
      filePath: certificate.filePath,
      downloadName: certificate.downloadName,
      downloadLabel: 'Download certificate',
    })
  }

  function openArtifactPreview(artifact) {
    setActiveDocument({
      previewTitle: artifact.previewTitle,
      filePath: artifact.filePath,
      downloadName: artifact.downloadName,
      downloadLabel: artifact.downloadLabel,
    })
  }

  return (
    <main className="portfolio">
      <section className="hero-scroll" id="home" ref={heroRef}>
        <div className="hero-viewport">
          <div className="hero-grid" aria-hidden="true" />

          <header className="hero-header">
            <a className="hero-brand" href="#home" aria-label="Sid, home">
              Sid<span>.</span>
            </a>

            <nav className="primary-navigation" aria-label="Main navigation">
              {primaryNavigation.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>

            <button
              className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
              type="button"
              aria-label={menuOpen ? 'Close section menu' : 'Open section menu'}
              aria-expanded={menuOpen}
              aria-controls="section-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
            </button>
          </header>

          {menuOpen && (
            <nav
              className="section-menu"
              id="section-menu"
              aria-label="All portfolio sections"
            >
              {[...primaryNavigation, ...additionalNavigation].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          )}

          <p className="hero-ghost" aria-hidden="true">
            SID
          </p>

          <div className="hero-intro">
            <p className="hero-eyebrow">BUILDING TRUST IN EVERY RELEASE</p>
            <p>
              I build confidence in software through thoughtful testing.
            </p>
          </div>

          <img
            className="hero-portrait"
            src="/sid-hero-portrait.webp"
            alt="Portrait of Sid"
            fetchPriority="high"
          />

          <div className="hero-name">
            <p className="hero-overline">EXPERIMENTS · EXECUTION · IMPACT</p>
            <h1 aria-label="SID.">
              <span className="hero-name-typed" aria-hidden="true">
                SID
              </span>
              <span className="hero-name-dot" aria-hidden="true">
                .
              </span>
            </h1>
            <button
              className="hero-resume-link"
              type="button"
              onClick={() => setActiveDocument(resumeDocument)}
            >
              View Resume <span aria-hidden="true">↗</span>
            </button>
          </div>

          <a className="hero-project-tile" href="#qa-artifacts">
            <span className="project-tile-art" aria-hidden="true">
              <span className="tile-check">✓</span>
              <span className="tile-line tile-line-one" />
              <span className="tile-check">✓</span>
              <span className="tile-line tile-line-two" />
              <span className="tile-check">✓</span>
              <span className="tile-line tile-line-three" />
            </span>
            <span className="project-tile-caption">
              <strong>QA CASE STUDY</strong>
              <span>Explore the process</span>
            </span>
          </a>

          <button
            className="hero-contact-tile"
            type="button"
            aria-haspopup="dialog"
            onClick={openContactDialog}
          >
            <img src="/sid-contact-thumbnail.webp" alt="" />
            <span className="contact-tile-copy">
              <span>LET’S TALK</span>
              <strong>Sid</strong>
              <span>Ideas, collaborations & conversations.</span>
            </span>
            <span className="contact-tile-arrow" aria-hidden="true">
              ↗
            </span>
          </button>

          <a className="scroll-cue" href="#about">
            <span>SCROLL TO EXPLORE</span>
            <span className="scroll-cue-line" aria-hidden="true" />
          </a>
        </div>
      </section>

      <div className="content-page">

        <section
          className="content-section"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="section-index">
            <span>01</span>
            <span>ABOUT</span>
          </div>

          <div className="section-content about-content">
            <p className="section-kicker">ABOUT ME</p>
            <h2 id="about-title">I help make software reliable.</h2>
            <p className="section-description">
              I have nearly four years of experience testing web and mobile
              apps. I enjoy finding issues and helping teams deliver a better
              experience.
            </p>
            <p className="about-detail">
              I work across manual and automation testing, with experience in
              Java, Selenium, and Appium.
            </p>
          </div>
        </section>

        <section
          className="content-section"
          id="experience"
          aria-labelledby="experience-title"
        >
          <div className="section-index">
            <span>02</span>
            <span>EXPERIENCE</span>
          </div>

          <div className="section-content">
            <p className="section-kicker">CAREER</p>
            <h2 id="experience-title">Experience</h2>

            <div className="experience-list">
              {experienceItems.map((item) => (
                <article
                  className="experience-row"
                  key={`${item.role}-${item.company}`}
                >
                  <div className="experience-heading">
                    <div>
                      <h3>{item.role}</h3>
                      <p className="experience-company">{item.company}</p>
                    </div>
                    <span className="experience-period">{item.period}</span>
                  </div>
                  <p className="experience-summary">{item.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="content-section"
          id="projects"
          aria-labelledby="projects-title"
        >
          <div className="section-index">
            <span>03</span>
            <span>SELECTED WORK</span>
          </div>

          <div className="section-content">
            <p className="section-kicker">PROJECTS</p>
            <h2 id="projects-title">Selected QA work</h2>

            <div className="project-list">
              {projectItems.map((project) => (
                <article className="project-row" key={project.id}>
                  <div className="project-copy">
                    <p className="project-category">
                      <span>{project.number}</span>
                      {project.category}
                    </p>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>

                  <figure className="project-image">
                    <ProjectImage
                      src={project.imagePath}
                      alt={project.imageAlt}
                    />
                  </figure>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="content-section"
          id="certifications"
          aria-labelledby="certifications-title"
        >
          <div className="section-index">
            <span>04</span>
            <span>CERTIFICATION</span>
          </div>

          <div className="section-content">
            <p className="section-kicker">CREDENTIALS</p>
            <h2 id="certifications-title">Certification</h2>

            {certificationItems.map((certificate) => (
              <article className="certification-row" key={certificate.id}>
                <div className="certification-main">
                  <p className="certification-category">
                    {certificate.category}
                  </p>
                  <h3>{certificate.title}</h3>
                  <p className="certification-issuer">{certificate.issuer}</p>
                </div>

                <dl className="certification-details">
                  <div>
                    <dt>Awarded</dt>
                    <dd>{certificate.awardedOn}</dd>
                  </div>
                  <div>
                    <dt>Certificate number</dt>
                    <dd>{certificate.certificateNumber}</dd>
                  </div>
                </dl>

                <button
                  className="text-action"
                  type="button"
                  onClick={() => openCertificatePreview(certificate)}
                >
                  View certificate <span aria-hidden="true">↗</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section
          className="content-section"
          id="qa-artifacts"
          aria-labelledby="artifacts-title"
        >
          <div className="section-index">
            <span>05</span>
            <span>QA SAMPLES</span>
          </div>

          <div className="section-content">
            <p className="section-kicker">PORTFOLIO CASE STUDY</p>
            <h2 id="artifacts-title">Testing artifacts</h2>
            <p className="section-description">
              Sample testing documents for a portfolio QA case study.
            </p>

            <div className="artifact-list">
              {artifactItems.map((artifact, index) => (
                <article className="artifact-row" key={artifact.id}>
                  <span className="artifact-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="artifact-copy">
                    <p className="artifact-type">{artifact.type}</p>
                    <h3>{artifact.title}</h3>
                    <p>{artifact.description}</p>
                  </div>

                  {artifact.previewTitle ? (
                    <button
                      className="text-action"
                      type="button"
                      onClick={() => openArtifactPreview(artifact)}
                    >
                      View sample <span aria-hidden="true">↗</span>
                    </button>
                  ) : (
                    <a
                      className="text-action"
                      href={artifact.filePath}
                      download={artifact.downloadName}
                    >
                      Download <span aria-hidden="true">↓</span>
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="content-section"
          id="skills"
          aria-labelledby="skills-title"
        >
          <div className="section-index">
            <span>06</span>
            <span>SKILLS</span>
          </div>

          <div className="section-content">
            <p className="section-kicker">TOOLS & METHODS</p>
            <h2 id="skills-title">Skills</h2>

            <ul className="skill-list">
              {skillItems.map((skill, index) => (
                <li key={skill}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="content-section bug-hunt-section"
          id="bug-hunt"
          aria-labelledby="bug-hunt-title"
        >
          <div className="section-index">
            <span>07</span>
            <span>BUG HUNT</span>
          </div>

          <div className="section-content">
            <p className="section-kicker">INTERACTIVE QA CHALLENGE</p>
            <h2 id="bug-hunt-title">Can you spot what slipped through?</h2>
            <p className="section-description">
              A fictional online store is almost ready to ship. Explore its
              shopping flow, note the issues you find, then reveal the bugs you
              missed at the end.
            </p>

            <div className="bug-hunt-preview">
              <div className="bug-hunt-preview-heading">
                <span className="bug-hunt-indicator" aria-hidden="true" />
                <p>GROCER CENTRAL <span>·</span> RELEASE HUNT</p>
              </div>

              <p className="bug-hunt-preview-title">
                One checkout. Plenty to uncover.
              </p>

              <div className="bug-hunt-steps" aria-label="Challenge steps">
                <span><b>01</b> Explore the flow</span>
                <span><b>02</b> Record what you find</span>
                <span><b>03</b> Reveal the full list</span>
              </div>

              <p className="bug-hunt-preview-note">
                THE INTERACTIVE CHALLENGE IS LIVE
              </p>
              <button
                className="bug-hunt-launch-button"
                type="button"
                onClick={() => setIsGrocerCentralOpen(true)}
              >
                Enter Grocer Central <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>

        <section
          className="content-section contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="section-index">
            <span>08</span>
            <span>CONTACT</span>
          </div>

          <div className="section-content">
            <p className="section-kicker">GET IN TOUCH</p>
            <h2 id="contact-title">Contact</h2>
            <p className="section-description">
              Open to QA roles, collaborations and conversations about testing.
            </p>

            <div className="contact-list">
              {contactItems.map((item, index) => (
                <article className="contact-row" key={item.label}>
                  <span className="contact-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="contact-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <div className="contact-copy">
                    <h3>{item.label}</h3>
                    {item.href ? (
                      <a href={item.href}>{item.value}</a>
                    ) : (
                      <p>{item.value}</p>
                    )}
                  </div>
                  {item.href && (
                    <span className="contact-arrow" aria-hidden="true">
                      ↗
                    </span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <a href="#home">SID.</a>
          <p>© Sid · Portfolio in progress</p>
          <a href="#home">Back to top ↑</a>
        </footer>
      </div>

      <dialog
        className="contact-dialog"
        ref={contactDialogRef}
        aria-labelledby="contact-dialog-title"
        aria-describedby="contact-dialog-description"
        onClose={() => setContactDialogOpen(false)}
        onClick={(event) => {
          if (event.target === contactDialogRef.current) {
            setContactDialogOpen(false)
          }
        }}
      >
        <div className="contact-dialog-content">
          <header className="contact-dialog-header">
            <div>
              <p className="contact-dialog-kicker">LET’S TALK</p>
              <h2 id="contact-dialog-title">Start a conversation</h2>
              <p id="contact-dialog-description">
                Share a little about what you’d like to discuss.
              </p>
            </div>
            <button
              className="contact-dialog-close"
              type="button"
              aria-label="Close message form"
              onClick={() => setContactDialogOpen(false)}
            >
              ×
            </button>
          </header>

          <form className="contact-form" onSubmit={handleContactFormSubmit}>
            <div className="contact-form-fields">
              <label className="contact-field">
                <span>Name <span aria-hidden="true">*</span></span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                />
              </label>

              <label className="contact-field">
                <span>Email <span aria-hidden="true">*</span></span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="contact-field contact-field-wide">
                <span>Topic <span className="contact-field-optional">(optional)</span></span>
                <select name="topic" defaultValue="">
                  <option value="">Choose a topic</option>
                  <option value="job-opportunity">Job opportunity</option>
                  <option value="qa-collaboration">QA collaboration</option>
                  <option value="general-question">General question</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="contact-field contact-field-wide">
                <span>Message <span aria-hidden="true">*</span></span>
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Tell me what you’d like to discuss..."
                  required
                />
              </label>
            </div>

            {contactFormStatus && (
              <p
                className={`contact-form-status is-${contactFormState}`}
                role="status"
              >
                {contactFormStatus}
              </p>
            )}

            <div className="contact-form-actions">
              <p>* Required fields</p>
              <button
                className="contact-submit"
                type="submit"
                disabled={contactFormState === 'sending'}
              >
                {contactFormState === 'sending' ? 'Sending…' : 'Send message'}{' '}
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <dialog
        className="document-dialog"
        ref={documentDialogRef}
        aria-labelledby="document-dialog-title"
        onClose={() => setActiveDocument(null)}
        onClick={(event) => {
          if (event.target === documentDialogRef.current) {
            setActiveDocument(null)
          }
        }}
      >
        <div className="document-dialog-content">
          <header className="document-dialog-header">
            <h2 id="document-dialog-title">
              {activeDocument?.previewTitle}
            </h2>
            <button
              className="document-close"
              type="button"
              onClick={() => setActiveDocument(null)}
            >
              Close
            </button>
          </header>

          <div className="document-preview">
            {activeDocument && (
              <iframe
                title={activeDocument.previewTitle}
                src={activeDocument.filePath}
              >
                <p>
                  Your browser can’t preview this PDF.{' '}
                  <a href={activeDocument.filePath}>Open the document</a>.
                </p>
              </iframe>
            )}
          </div>

          <footer className="document-dialog-footer">
            {activeDocument && (
              <>
                <a
                  className="document-open"
                  href={activeDocument.filePath}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in new tab <span aria-hidden="true">↗</span>
                </a>
                <a
                  className="document-download"
                  href={activeDocument.filePath}
                  download={activeDocument.downloadName}
                >
                  {activeDocument.downloadLabel || 'Download'}
                </a>
              </>
            )}
          </footer>
        </div>
      </dialog>
      {isGrocerCentralOpen && (
        <GrocerCentral
          onExit={() => setIsGrocerCentralOpen(false)}
        />
      )}
    </main>
  )
}

export default App
