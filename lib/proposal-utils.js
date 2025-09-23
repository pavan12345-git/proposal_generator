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
