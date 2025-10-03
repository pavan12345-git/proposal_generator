/**
 * Regenerate executive summary using Claude API
 * @param {Object} requirements - Business requirements data
 * @returns {Promise<string>} - New executive summary content
 */
export async function regenerateExecutiveSummary(requirements) {
  try {
    const response = await fetch('/api/process-requirements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requirements),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to regenerate executive summary')
    }

    const result = await response.json()
    return result.data.sections['executive-summary'].content
  } catch (error) {
    console.error('Error regenerating executive summary:', error)
    throw error
  }
}

/**
 * Regenerate project overview using Claude API
 * @param {Object} requirements - Business requirements data
 * @returns {Promise<string>} - New project overview content
 */
export async function regenerateProjectOverview(requirements) {
  try {
    const response = await fetch('/api/process-requirements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requirements),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to regenerate project overview')
    }

    const result = await response.json()
    return result.data.sections['project-overview'].content
  } catch (error) {
    console.error('Error regenerating project overview:', error)
    throw error
  }
}

/**
 * Regenerate "The Problem" section using Claude API
 * @param {Object} requirements - Business requirements data
 * @returns {Promise<string>} - New problem statement content
 */
export async function regenerateTheProblem(requirements) {
  try {
    const response = await fetch('/api/process-requirements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requirements),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to regenerate problem statement')
    }

    const result = await response.json()
    return result.data.sections['the-problem'].content
  } catch (error) {
    console.error('Error regenerating problem statement:', error)
    throw error
  }
}

/**
 * Regenerate "Our Solution" section using Claude API
 * @param {Object} requirements - Business requirements data
 * @returns {Promise<string>} - New solution statement content
 */
export async function regenerateOurSolution(requirements) {
  try {
    const response = await fetch('/api/process-requirements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requirements),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to regenerate solution statement')
    }

    const result = await response.json()
    return result.data.sections['our-solution'].content
  } catch (error) {
    console.error('Error regenerating solution statement:', error)
    throw error
  }
}

/**
 * Regenerate "Key Value Propositions" section using Claude API
 * @param {Object} requirements - Business requirements data
 * @returns {Promise<string>} - New key value propositions content
 */
export async function regenerateKeyValuePropositions(requirements) {
  try {
    const response = await fetch('/api/process-requirements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requirements),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to regenerate key value propositions')
    }

    const result = await response.json()
    return result.data.sections['key-value-propositions'].content
  } catch (error) {
    console.error('Error regenerating key value propositions:', error)
    throw error
  }
}

/**
 * Parse content with asterisks and convert to HTML bullet points
 * @param {string} content - Raw content with asterisk bullet points
 * @returns {string} - HTML string with proper <ul><li> structure
 */
export function parseBulletPoints(content) {
  if (!content) return content
  
  console.log('🔍 Parsing bullet points for content:', content)
  
  // Check if content is a single paragraph without asterisks (like your example)
  const lines = content.split('\n')
  const hasAsterisks = lines.some(line => line.trim().startsWith('*'))
  
  if (!hasAsterisks && lines.length === 1) {
    // Content is a single paragraph, try to split it into logical bullet points
    console.log('🔍 Content appears to be a single paragraph, attempting to split into bullet points')
    
    // Try to split on common sentence patterns
    const sentences = content.split(/\.\s+(?=[A-Z])/).filter(s => s.trim())
    console.log('🔍 Split sentences:', sentences)
    
    if (sentences.length > 1) {
      // Create bullet points from sentences
      let html = '<ul class="proposal-bullets">'
      sentences.forEach(sentence => {
        const cleanSentence = sentence.trim().replace(/\.$/, '') + '.'
        html += `<li>${cleanSentence}</li>`
        console.log(`🔍 Added sentence as bullet: "${cleanSentence}"`)
      })
      html += '</ul>'
      console.log('🔍 Final HTML from sentence splitting:', html)
      return html
    }
  }
  
  // Original parsing logic for content with asterisks
  let html = ''
  let inList = false
  let inNumberedList = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    console.log(`🔍 Processing line ${i}: "${line}"`)
    
    if (line.startsWith('*')) {
      // Start list if not already in one
      if (!inList) {
        html += '<ul class="proposal-bullets">'
        inList = true
        console.log('🔍 Started bullet list')
      }
      // Remove the asterisk and add as list item
      const text = line.substring(1).trim()
      html += `<li>${text}</li>`
      console.log(`🔍 Added bullet item: "${text}"`)
    } else if (line.match(/^\d+\./)) {
      // Numbered list item (e.g., "1. Title")
      if (inList) {
        html += '</ul>'
        inList = false
        console.log('🔍 Closed bullet list for numbered item')
      }
      if (!inNumberedList) {
        html += '<ol class="proposal-numbered">'
        inNumberedList = true
        console.log('🔍 Started numbered list')
      }
      // Remove the number and add as list item
      const text = line.replace(/^\d+\.\s*/, '')
      html += `<li>${text}</li>`
      console.log(`🔍 Added numbered item: "${text}"`)
    } else if (line === '') {
      // Empty line - close lists if open
      if (inList) {
        html += '</ul>'
        inList = false
        console.log('🔍 Closed bullet list (empty line)')
      }
      if (inNumberedList) {
        html += '</ol>'
        inNumberedList = false
        console.log('🔍 Closed numbered list (empty line)')
      }
      continue
    } else {
      // Non-bullet content
      if (inList) {
        html += '</ul>'
        inList = false
        console.log('🔍 Closed bullet list (non-bullet content)')
      }
      if (inNumberedList) {
        html += '</ol>'
        inNumberedList = false
        console.log('🔍 Closed numbered list (non-bullet content)')
      }
      html += `<p>${line}</p>`
      console.log(`🔍 Added paragraph: "${line}"`)
    }
  }
  
  // Close lists if still open
  if (inList) {
    html += '</ul>'
    console.log('🔍 Final close of bullet list')
  }
  if (inNumberedList) {
    html += '</ol>'
    console.log('🔍 Final close of numbered list')
  }
  
  console.log('🔍 Final HTML output:', html)
  return html
}

/**
 * Format Project Overview content as clean bullet points
 * @param {string} content - Raw content from Claude API
 * @returns {string} - Formatted content with bullet points
 */
export function formatProjectOverviewContent(content) {
  if (!content) return content
  
  console.log('🔍 Formatting Project Overview content:', content)
  
  // Split content by lines and filter out empty lines
  const lines = content.split('\n').filter(line => line.trim())
  console.log('🔍 Lines found:', lines)
  
  // Format each line as a bullet point
  const formattedLines = lines.map(line => {
    const trimmedLine = line.trim()
    // If line already starts with •, keep it as is
    if (trimmedLine.startsWith('•')) {
      console.log('🔍 Line already has round bullet:', trimmedLine)
      return trimmedLine
    }
    // If line starts with *, convert to round bullet
    if (trimmedLine.startsWith('*')) {
      const converted = `•${trimmedLine.substring(1)}`
      console.log('🔍 Converted asterisk to round bullet:', converted)
      return converted
    }
    // Otherwise, add • prefix
    const formatted = `• ${trimmedLine}`
    console.log('🔍 Added round bullet to line:', formatted)
    return formatted
  })
  
  const result = formattedLines.join('\n')
  console.log('🔍 Final formatted content:', result)
  return result
}

/**
 * Format Benefits & ROI content with plain headings and optimized spacing
 * @param {string} content - Raw content from Claude API
 * @returns {string} - Formatted content with plain headings and clean spacing
 */
export function formatBenefitsAndROIContent(content) {
  if (!content) return content
  
  // Split content by lines
  const lines = content.split('\n')
  const formattedLines = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Skip empty lines
    if (!line) {
      formattedLines.push('')
      continue
    }
    
    // Check if this is a section heading (Revenue Impact, Cost Savings, Competitive Advantages)
    if (line === 'Revenue Impact:' || line === 'Cost Savings:' || line === 'Competitive Advantages:') {
      // Add minimal spacing before section (only if not first section)
      if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] !== '') {
        formattedLines.push('') // Single line before section
      }
      formattedLines.push(line) // Plain heading without bold formatting
    }
    // Check if this is a bullet point (starts with •)
    else if (line.startsWith('•')) {
      formattedLines.push(line) // Keep bullet point as is
    }
    // Handle any other content
    else {
      formattedLines.push(line)
    }
  }
  
  // Join with line breaks for clean presentation
  return formattedLines.join('\n')
}

/**
 * Format Key Value Propositions content with plain headings and optimized spacing
 * @param {string} content - Raw content from Claude API
 * @returns {string} - Formatted content with plain headings and clean spacing
 */
export function formatKeyValuePropositionsContent(content) {
  if (!content) return content
  
  // Split content by lines
  const lines = content.split('\n')
  const formattedLines = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Skip empty lines
    if (!line) {
      formattedLines.push('')
      continue
    }
    
    // Check if this is a section heading (Enhanced Efficiency, Improved User Experience, Competitive Advantages)
    if (line === 'Enhanced Efficiency:' || line === 'Improved User Experience:' || line === 'Competitive Advantages:') {
      // Add minimal spacing before section (only if not first section)
      if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] !== '') {
        formattedLines.push('') // Single line before section
      }
      formattedLines.push(line) // Plain heading without bold formatting
    }
    // Check if this is a bullet point (starts with •)
    else if (line.startsWith('•')) {
      formattedLines.push(line) // Keep bullet point as is
    }
    // Handle any other content
    else {
      formattedLines.push(line)
    }
  }
  
  // Join with line breaks for clean presentation
  return formattedLines.join('\n')
}

/**
 * Update proposal data in localStorage
 * @param {Object} proposalData - Updated proposal data
 */
export function updateProposalData(proposalData) {
  try {
    localStorage.setItem('currentProposal', JSON.stringify(proposalData))
  } catch (error) {
    console.error('Error updating proposal data:', error)
  }
}

/**
 * Get current proposal data from localStorage
 * @returns {Object|null} - Current proposal data or null
 */
export function getCurrentProposal() {
  try {
    const stored = localStorage.getItem('currentProposal')
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Error getting current proposal:', error)
    return null
  }
}

/**
 * Parse markdown table and convert to HTML table
 * @param {string} content - Content that may contain markdown table
 * @returns {string} - Content with markdown tables converted to HTML tables
 */
export function parseMarkdownTable(content) {
  if (!content) return content
  
  // Regular expression to match markdown tables
  const tableRegex = /(\|.*\|[\r\n]+\|[\s\-\|]*\|[\r\n]+(?:\|.*\|[\r\n]*)*)/g
  
  return content.replace(tableRegex, (match) => {
    const lines = match.trim().split('\n').filter(line => line.trim())
    
    if (lines.length < 2) return match // Need at least header and separator
    
    // Parse header row
    const headerRow = lines[0].split('|').map(cell => cell.trim()).filter(cell => cell)
    
    // Skip separator row (lines[1])
    const dataRows = lines.slice(2).filter(line => line.trim())
    
    // Determine table type based on headers
    const isOperationalTable = headerRow.includes('Service') && headerRow.includes('Estimated Cost') && headerRow.includes('Notes')
    const isAdditionalFeaturesTable = headerRow.includes('Component') && headerRow.includes('Description') && headerRow.includes('Estimate')
    const isTotalInvestmentTable = headerRow.includes('Pricing Component') && headerRow.includes('Amount') && headerRow.includes('Notes')
    const isTimelineTable = headerRow.includes('Phase') && headerRow.includes('Duration') && headerRow.includes('Activities')
    
    // Build HTML table with appropriate classes
    let tableClass = 'proposal-table table-border'
    if (isOperationalTable) {
      tableClass += ' operational-table'
    } else if (isAdditionalFeaturesTable) {
      tableClass += ' additional-features-table'
    } else if (isTotalInvestmentTable) {
      tableClass += ' total-investment-table'
    } else if (isTimelineTable) {
      tableClass += ' timeline-table'
    }
    
    let htmlTable = `<div class="table-container">\n<table class="${tableClass}">\n<thead>\n<tr>\n`
    
    // Add header cells
    headerRow.forEach(header => {
      htmlTable += `<th>${header}</th>\n`
    })
    
    htmlTable += '</tr>\n</thead>\n<tbody>\n'
    
    // Add data rows
    dataRows.forEach(row => {
      const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell)
      if (cells.length > 0) {
        htmlTable += '<tr>\n'
        cells.forEach(cell => {
          htmlTable += `<td>${cell}</td>\n`
        })
        htmlTable += '</tr>\n'
      }
    })
    
    htmlTable += '</tbody>\n</table>\n</div>'
    
    return htmlTable
  })
}

/**
 * Update a specific section in the current proposal
 * @param {string} sectionKey - Section key to update
 * @param {Object} sectionData - New section data
 */
export function updateProposalSection(sectionKey, sectionData) {
  try {
    const proposal = getCurrentProposal()
    if (proposal) {
      proposal.sections[sectionKey] = {
        ...proposal.sections[sectionKey],
        ...sectionData,
        updatedAt: new Date().toISOString()
      }
      updateProposalData(proposal)
    }
  } catch (error) {
    console.error('Error updating proposal section:', error)
  }
}

/**
 * Extract tech stack content from Technical Architecture content, excluding Mermaid diagrams
 * @param {string} content - Full Technical Architecture content
 * @returns {string} - Tech stack content only
 */
export function extractTechStackContent(content) {
  if (!content) return ""
  
  // Split content by sections
  const sections = content.split(/## /)
  
  // Find the Technical Stack section
  const techStackSection = sections.find(section => 
    section.toLowerCase().includes('technical stack') || 
    section.toLowerCase().includes('tech stack')
  )
  
  if (techStackSection) {
    // Return the tech stack section with proper heading
    return `## Technical Stack\n${techStackSection.replace(/^technical stack\s*/i, '')}`
  }
  
  // If no explicit tech stack section found, try to extract content after mermaid blocks
  const lines = content.split('\n')
  let techStackLines = []
  let inTechStack = false
  let foundMermaidBlocks = false
  let foundCopyInstructions = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Skip mermaid code blocks
    if (line.includes('```mermaid') || line.includes('```')) {
      foundMermaidBlocks = true
      // Skip until we find the end of the mermaid block
      while (i < lines.length && !lines[i].includes('```')) {
        i++
      }
      continue
    }
    
    // Skip system architecture and component architecture sections
    if (line.includes('## System Architecture') || line.includes('## Component Architecture')) {
      continue
    }
    
    // Track copy instructions
    if (line.includes('Copy this code to https://mermaid.live')) {
      foundCopyInstructions = true
      continue
    }
    
    // Start collecting tech stack content
    if (line.includes('## Technical Stack') || line.includes('## Tech Stack')) {
      inTechStack = true
      techStackLines.push(line)
      continue
    }
    
    // If we're in tech stack section, collect the content
    if (inTechStack) {
      techStackLines.push(line)
    }
    
    // If we've found mermaid blocks and copy instructions but no explicit tech stack section,
    // collect any content that looks like technical specifications
    if (foundMermaidBlocks && foundCopyInstructions && !inTechStack && !line.includes('##')) {
      // Look for content that might be technical specifications
      if (line.trim() && !line.includes('Copy this code') && !line.includes('```') && line.trim().length > 3) {
        techStackLines.push(line)
      }
    }
  }
  
  const result = techStackLines.join('\n').trim()
  
  // If we found some content but no explicit heading, add one
  if (result && !result.includes('## Technical Stack')) {
    return `## Technical Stack\n${result}`
  }
  
  return result
}

/**
 * Format Technical Stack content into presentable HTML with blue headings and bullet lists
 * - Headings: Lines starting with '## ' or ending with ':' become section headings
 * - Bullets: Lines starting with '-', '*', or '•' become list items
 * - Other lines become paragraphs
 * The resulting HTML uses classes compatible with existing proposal styles.
 * @param {string} content - Full Technical Architecture content
 * @returns {string} - HTML string
 */
export function formatTechStackContent(content) {
  const techOnly = extractTechStackContent(content || '')
  if (!techOnly) return ''

  const lines = techOnly.split(/\r?\n/)
  let html = ''
  let openUl = false
  let openOl = false
  let headingCounter = 0

  const flushUl = () => { if (openUl) { html += '</ul>'; openUl = false } }
  const flushOl = () => { if (openOl) { html += '</ol>'; openOl = false } }
  const flushLists = () => { flushUl(); flushOl() }

  const sanitizeHeading = (text) => {
    let t = text
      .replace(/^##\s+/, '')
      .replace(/^[-*•🔷\s]+/, '')
      .replace(/\*\*/g, '') // Remove all ** markers
      .replace(/:\s*$/, '')
      .replace(/^\s+/, '') // Remove diamond symbol
    return t.trim()
  }

  const isMainHeading = (text) => {
    const cleanText = text.toLowerCase().trim()
    return cleanText === 'technical stack' || cleanText === 'tech stack'
  }

  for (let raw of lines) {
    const line = raw.trim()
    if (!line) { flushLists(); continue }

    // Main headings: '## X', 'X:', '🔷 **X**', lines ending with '**', or lines starting with diamond symbol
    if (line.startsWith('## ') || line.endsWith(':') || /^🔷\s+/.test(line) || line.endsWith('**') || /^\s+/.test(line)) {
      flushLists()
      const heading = sanitizeHeading(line)
      if (heading) {
        if (isMainHeading(heading)) {
          // Main heading - no numbering
          html += `<div class="mt-4 mb-2 font-semibold text-lg">${escapeHtml(heading)}</div>`
        } else {
          // Sub-heading - with numbering
          headingCounter++
          html += `<div class="mt-4 mb-2 font-semibold">${headingCounter}. ${escapeHtml(heading)}</div>`
        }
      }
      continue
    }

    // All content items should be bullets, not numbered
    // Bulleted items: '-', '*', '•', or any other content
    if (/^[-*•]\s+/.test(line)) {
      flushOl()
      if (!openUl) { html += '<ul class="proposal-bullets">'; openUl = true }
      const item = line.replace(/^[-*•]\s+/, '')
      html += `<li>${escapeHtml(item)}</li>`
      continue
    }

    // Fallback: treat all content as bullet points
    flushOl()
    if (!openUl) { html += '<ul class="proposal-bullets">'; openUl = true }
    html += `<li>${escapeHtml(line)}</li>`
  }

  flushLists()
  return html
}

// Minimal HTML escaper to avoid injecting raw content in HTML
function escapeHtml(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
