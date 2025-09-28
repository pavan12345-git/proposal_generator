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
 * Format Project Overview content as clean bullet points
 * @param {string} content - Raw content from Claude API
 * @returns {string} - Formatted content with bullet points
 */
export function formatProjectOverviewContent(content) {
  if (!content) return content
  
  // Split content by lines and filter out empty lines
  const lines = content.split('\n').filter(line => line.trim())
  
  // Format each line as a bullet point
  const formattedLines = lines.map(line => {
    const trimmedLine = line.trim()
    // If line already starts with *, keep it as is
    if (trimmedLine.startsWith('*')) {
      return trimmedLine
    }
    // Otherwise, add * prefix
    return `* ${trimmedLine}`
  })
  
  // Join with line breaks for clean vertical spacing
  return formattedLines.join('\n')
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
    // Check if this is a bullet point (starts with ●)
    else if (line.startsWith('●')) {
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
    const isRetainerTable = headerRow.includes('Pricing Component') && headerRow.includes('Amount') && headerRow.includes('Notes')
    const isOperationalTable = headerRow.includes('Service') && headerRow.includes('Estimated Cost') && headerRow.includes('Notes')
    
    // Build HTML table with appropriate classes
    let tableClass = 'proposal-table table-border'
    if (isRetainerTable) {
      tableClass += ' retainer-table'
    } else if (isOperationalTable) {
      tableClass += ' operational-table'
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
