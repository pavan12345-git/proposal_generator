import Anthropic from '@anthropic-ai/sdk';

// Lazy initialization of Claude client
let claudeClient = null;

function getClaudeClient() {
  if (!claudeClient) {
    claudeClient = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
      maxRetries: 3,
      timeout: 30000, // 30 seconds
    });
  }
  return claudeClient;
}



/**
 * Generate content using Claude API with retry logic and error handling
 * @param {string} prompt - The prompt to send to Claude
 * @param {Object} options - Additional options for the request
 * @returns {Promise<string>} - Generated content
 */
export async function generateWithClaude(prompt, options = {}) {
  // Check if API key is configured
  if (!process.env.CLAUDE_API_KEY) {
    throw new Error('Claude API key not configured. Please set CLAUDE_API_KEY environment variable.');
  }

  const maxRetries = options.maxRetries || 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await getClaudeClient().messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Extract the content from the response
      const content = response.content[0]?.text;
      if (!content) {
        throw new Error('No content received from Claude API');
      }

      return content;
    } catch (error) {
      lastError = error;
      console.error(`Claude API attempt ${attempt} failed:`, error.message);

      // Don't retry on certain errors
      if (error.status === 401 || error.status === 403) {
        throw new Error('Authentication failed. Please check your API key.');
      }

      if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      if (error.status === 529) {
        throw new Error('Claude API is currently overloaded. Please try again later.');
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // If all retries failed, throw the last error
  throw new Error(`Failed to generate content after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
}

// Build a context block including only provided fields and avoid placeholders
function buildBusinessRequirementsContext(requirements) {
  const lines = []
  const pushIf = (label, value) => {
    if (value && (typeof value === 'string' ? value.trim() : true)) {
      lines.push(`${label}: ${Array.isArray(value) ? value.join(', ') : value}`)
    }
  }
  pushIf('Company', requirements.companyName)
  pushIf('Project', requirements.projectTitle)
  const clientLine = [requirements.clientName, requirements.clientCompany && `(${requirements.clientCompany})`]
    .filter(Boolean)
    .join(' ')
    .trim()
  if (clientLine) lines.push(`Client: ${clientLine}`)
  pushIf('Description', requirements.projectDescription)
  pushIf('Budget', requirements.budgetRange)
  pushIf('Timeline', requirements.timeline)
  if (requirements.countryName) {
    const country = requirements.countryCode ? `${requirements.countryName} (${requirements.countryCode})` : requirements.countryName
    lines.push(`Country: ${country}`)
  }
  if (requirements.objectives && requirements.objectives.length > 0) {
    pushIf('Objectives', requirements.objectives)
  }
  return lines.join('\n')
}

/**
 * Generate Executive Summary based on business requirements
 * @param {Object} requirements - Business requirements data
 * @returns {Promise<string>} - Generated executive summary
 */
export async function generateExecutiveSummary(requirements) {
  const prompt = `You are a professional proposal writer. Generate an Executive Summary with exactly 2 sentences:

**Required Structure:**
1. **Sentence 1**: "Our [solution type] is designed to help your [client's business type] [main goal/benefit]."
2. **Sentence 2**: "Our platform combines [key feature 1] with [key feature 2], helping your [business] to [primary outcome] while [secondary benefit]."

**Requirements:**
- Exactly 2 sentences only
- Start first sentence with "Our [solution type] is designed to help your..."
- Start second sentence with "Our platform combines..."
- Use simple, clear language
- Focus on what the solution does for the client
- No technical jargon or complex explanations
- If company, project, or client fields are blank, do not invent names; use generic references like "the client" or "the company".

**Business Requirements:**
${buildBusinessRequirementsContext(requirements)}

Generate based on the project description and business requirements provided. Return only the executive summary content, no additional formatting.`;

  try {
    return await generateWithClaude(prompt, {
      maxTokens: 500,
      temperature: 0.7,
    });
  } catch (error) {
    console.error('Failed to generate executive summary:', error);
    throw new Error(`Failed to generate executive summary: ${error.message}`);
  }
}

/**
 * Generate Project Overview based on business requirements
 * @param {Object} requirements - Business requirements data
 * @returns {Promise<string>} - Generated project overview
 */
export async function generateProjectOverview(requirements) {
  const prompt = `You are a professional proposal writer. Generate a Project Overview as a vertical list with exactly 5 bullet points, each on a new line:

* [Your company] will deliver [solution type] to address [client company]'s [specific challenge/need].
* The solution combines [main component 1] and [main component 2] with [backend/integration detail].
* Key features: [feature 1], [feature 2], and [feature 3] with [additional capability].
* The platform improves [operational benefit] by [process improvement 1], [process improvement 2], and [business insight benefit].
* Success will be defined by delivering [main outcome] and gaining [business value] through [method/approach].

Format requirements:
- Use asterisk (*) followed by space
- Each point on a separate line for readability
- One complete sentence per bullet point
- NO percentages, numbers, costs, or timelines
- Clean vertical spacing between points
- Professional, flowing narrative from challenge to success
- If company, project, or client fields are blank, do not invent names; use generic references like "the client" or "the company".

**Business Requirements:**
${buildBusinessRequirementsContext(requirements)}

Generate based on the project description and business requirements provided.`;

  try {
    return await generateWithClaude(prompt, {
      maxTokens: 800,
      temperature: 0.7,
    });
  } catch (error) {
    console.error('Failed to generate project overview:', error);
    throw new Error(`Failed to generate project overview: ${error.message}`);
  }
}

/**
 * Generate "The Problem" section based on business requirements
 * @param {Object} requirements - Business requirements data
 * @returns {Promise<string>} - Generated problem statement
 */
export async function generateTheProblem(requirements) {
  const prompt = `You are a professional proposal writer. Generate "The Problem" section as a single, concise paragraph (2-3 sentences maximum):

"Most businesses [main challenge/pain point], and [secondary challenge that compounds the problem]."

**Requirements:**
- One paragraph format (no bullet points or asterisks)
- 2-3 sentences maximum
- Start with "Most businesses..."
- Focus on the core business challenge
- Include a secondary related problem
- Keep it simple and direct
- No technical jargon
- Make it relatable to their business
- If company, project, or client fields are blank, do not invent names; use generic references like "the client" or "the company".

**Business Requirements:**
${buildBusinessRequirementsContext(requirements)}

Generate based on the project description and business context provided in the requirements form.`;

  try {
    return await generateWithClaude(prompt, {
      maxTokens: 600,
      temperature: 0.7,
    });
  } catch (error) {
    console.error('Failed to generate problem statement:', error);
    throw new Error(`Failed to generate problem statement: ${error.message}`);
  }
}

/**
 * Generate "Our Solution" section based on business requirements
 * @param {Object} requirements - Business requirements data
 * @returns {Promise<string>} - Generated solution statement
 */
export async function generateOurSolution(requirements) {
  const prompt = `You are a professional proposal writer. Generate "Our Solution" section as a single, concise paragraph (2-3 sentences maximum):

"Our [solution type] is designed to [primary benefit/outcome] while [secondary benefit]. The platform [key functionality] to help your [business type] [main business goal]."

**Requirements:**
- One paragraph format (no bullet points or asterisks)
- 2-3 sentences maximum
- Start with "Our [solution type]..."
- Focus on how the solution addresses their specific problems
- Include primary and secondary benefits
- Keep it simple and direct
- No technical jargon
- Make it outcome-focused
- If company, project, or client fields are blank, do not invent names; use generic references like "the client" or "the company".

**Business Requirements:**
${buildBusinessRequirementsContext(requirements)}

Generate based on the project description, solution approach, and business objectives provided in the requirements form.`;

  try {
    return await generateWithClaude(prompt, {
      maxTokens: 600,
      temperature: 0.7,
    });
  } catch (error) {
    console.error('Failed to generate solution statement:', error);
    throw new Error(`Failed to generate solution statement: ${error.message}`);
  }
}

/**
 * Generate Key Value Propositions based on business requirements
 * @param {Object} requirements - Business requirements data
 * @returns {Promise<string>} - Generated key value propositions
 */
export async function generateKeyValuePropositions(requirements) {
  const prompt = `You are a professional proposal writer. Based on the provided business requirements, generate 3-4 key value propositions for this project. Format as numbered sections with bullet points:

1. [Value Proposition Title]
* [Specific benefit or feature]
* [Another benefit or feature] 
* [Third benefit or feature]

2. [Second Value Proposition Title]
* [Specific benefit or feature]
* [Another benefit or feature]
* [Third benefit or feature]

**Requirements:**
- Start directly with '1.' (no heading)
- Use clean numbered format without bold formatting
- 3-4 main value propositions
- 2-4 bullet points per proposition
- Focus on client benefits and business value
- Make it specific to their project type and industry
- Use asterisk (*) for bullet points
- Each bullet point should be a complete sentence
- Focus on competitive advantages and ROI
- Include measurable benefits where possible
- If company, project, or client fields are blank, do not invent names; use generic references like "the client" or "the company".

**Business Requirements:**
${buildBusinessRequirementsContext(requirements)}

Generate key value propositions that highlight the unique benefits, competitive advantages, and business value this solution will deliver to the client.`;

  try {
    return await generateWithClaude(prompt, {
      maxTokens: 1000,
      temperature: 0.7,
    });
  } catch (error) {
    console.error('Failed to generate key value propositions:', error);
    throw new Error(`Failed to generate key value propositions: ${error.message}`);
  }
}

/**
 * Generate Benefits & ROI section based on business requirements
 * @param {Object} requirements - Business requirements data
 * @returns {Promise<string>} - Generated benefits and ROI content
 */
export async function generateBenefitsAndROI(requirements) {
  const prompt = `You are a professional proposal writer. Based on the provided business requirements, generate a Benefits & ROI section with exactly 3 categories in this format:

Revenue Impact:
• [Specific revenue benefit]: [description of improvement]
• [Another revenue benefit]: [description of impact]
• [Third revenue benefit]: [description of outcome]

Cost Savings:
• [Cost saving area]: [description of savings]
• [Another cost saving]: [description of efficiency]
• [Third cost benefit]: [description of reduction]

Competitive Advantages:
• [Advantage area]: [description of benefit]
• [Another advantage]: [description of differentiation]
• [Third advantage]: [description of strategic benefit]
• [Fourth advantage]: [description of growth benefit]

**Requirements:**
- Use exactly 3 plain text category headings followed by colon (no bold formatting)
- Use standard round bullets (•) for sub-points
- Each category should have 3-4 benefits
- Focus on measurable business outcomes
- Make it specific to their project type and industry
- No specific numbers or percentages
- Each bullet point should be a complete sentence
- Focus on tangible business value and return on investment
- Each bullet point on separate line with clean spacing between sections
- Remove any introductory text, explanatory content, or bold formatting
- Display format should be: "Revenue Impact:" followed by bullet points, then "Cost Savings:" with bullets, then "Competitive Advantages:" with bullets
- If company, project, or client fields are blank, do not invent names; use generic references like "the client" or "the company".

**Business Requirements:**
${buildBusinessRequirementsContext(requirements)}

Generate content that shows tangible business value and return on investment relevant to the client's project requirements.`;

  try {
    return await generateWithClaude(prompt, {
      maxTokens: 1200,
      temperature: 0.7,
    });
  } catch (error) {
    console.error('Failed to generate benefits and ROI:', error);
    throw new Error(`Failed to generate benefits and ROI: ${error.message}`);
  }
}

/**
 * Generate One Time Development Cost based on business requirements
 * @param {Object} requirements - Business requirements data
 * @returns {Promise<string>} - Generated development cost content
 */
export async function generateDevelopmentCost(requirements) {
  const prompt = `You are a professional proposal writer. Generate a "One Time Development Cost" section based on the provided business requirements. Format EXACTLY as follows:

[Currency Symbol][Cost Range]

Includes:

• Platform Development: [Brief description]
  - [Specific component 1]
  - [Specific component 2]

• Backend Development: [Brief description]
  - [Specific component 1]
  - [Specific component 2]

• Frontend Development: [Brief description]
  - [Specific component 1]

• Database Setup: [Brief description]

• API Integration: [Brief description]

• Testing & QA: [Brief description]

**CRITICAL FORMATTING REQUIREMENTS:**
- Cost range as clean header line without extra description
- "Includes:" directly below on its own line
- Each main bullet point (•) with title and colon format like "Platform Development: description"
- Sub-bullets (-) indented under main bullets on separate lines
- Use standard round bullets (•) for main categories and hyphens (-) for sub-items
- Remove all extra spacing and explanatory text
- Format exactly like the example with concise descriptions
- Each section: main bullet with title and brief description, followed by indented sub-bullets listing specific components
- Maintain clean professional presentation without excessive spacing
- Use appropriate currency symbol based on country
- NO explanatory paragraph at the end
- NO additional text after the bullet points
- If company, project, or client fields are blank, do not invent names; use generic references like "the client" or "the company".

**Business Requirements:**
${buildBusinessRequirementsContext(requirements)}

Generate ONLY the formatted cost breakdown with the exact structure shown above.`;

  try {
    return await generateWithClaude(prompt, {
      maxTokens: 1200,
      temperature: 0.7,
    });
  } catch (error) {
    console.error('Failed to generate development cost:', error);
    throw new Error(`Failed to generate development cost: ${error.message}`);
  }
}

/**
 * Generate Next Steps based on business requirements
 * @param {Object} requirements - Business requirements data
 * @returns {Promise<string>} - Generated next steps
 */
export async function generateNextSteps(requirements) {
  const prompt = `You are a professional proposal writer. Generate Next Steps as a simple bullet point list with exactly 3-4 actionable items using standard round bullets (•):

**Required Format:**
• [Action item 1] - 2-4 words describing immediate action
• [Action item 2] - 2-4 words describing next step
• [Action item 3] - 2-4 words describing follow-up action
• [Action item 4] - 2-4 words describing final step

**Requirements:**
- Use standard round bullets (•) followed by space
- Each bullet point should be 2-4 words maximum
- Focus on immediate, actionable next steps
- Examples: "Finalize requirements", "Execute service agreement", "Begin implementation process", "Schedule kickoff meeting"
- Keep it concise and professional
- No explanations or additional text
- Each bullet point on a separate line
- Use simple, clear language
- If company, project, or client fields are blank, do not invent names; use generic references like "the client" or "the company".

**Business Requirements:**
${buildBusinessRequirementsContext(requirements)}

Generate 3-4 simple, actionable next steps that would logically follow after proposal approval.`;

  try {
    return await generateWithClaude(prompt, {
      maxTokens: 300,
      temperature: 0.7,
    });
  } catch (error) {
    console.error('Failed to generate next steps:', error);
    throw new Error(`Failed to generate next steps: ${error.message}`);
  }
}

/**
 * Generate Additional Features Recommended based on business requirements
 * @param {Object} requirements - Business requirements data
 * @returns {Promise<string>} - Generated additional features content
 */
export async function generateAdditionalFeatures(requirements) {
  const prompt = `You are a professional proposal writer. Generate an "Additional Features Recommended" section based on the provided business requirements. Format EXACTLY as follows:

These are not included in the one time development cost and will be additional [Currency Symbol].

| Component | Description | Estimate |
|-----------|-------------|----------|
| [Feature 1] | [Detailed description of feature and its benefits] | [Cost estimate] |
| [Feature 2] | [Detailed description of feature and its benefits] | [Cost estimate] |
| [Feature 3] | [Detailed description of feature and its benefits] | [Cost estimate] |
| [Feature 4] | [Detailed description of feature and its benefits] | [Cost estimate] |
| [Feature 5] | [Detailed description of feature and its benefits] | [Cost estimate] |

**CRITICAL FORMATTING REQUIREMENTS:**
- Start with explanatory text: "These are not included in the one time development cost and will be additional [Currency Symbol]."
- Use proper markdown table format with headers: Component, Description, Estimate
- Generate 3-5 additional features relevant to the project type
- Each feature should have a clear component name, detailed description, and cost estimate
- Use appropriate currency symbol based on country
- Features should be logical extensions or enhancements to the main project
- Descriptions should explain the business value and technical implementation
- Cost estimates should be realistic and proportional to the main project budget
- Keep descriptions concise but informative (2-3 sentences per feature)
- Focus on features that would add significant value to the project
- If company, project, or client fields are blank, do not invent names; use generic references like "the client" or "the company".

**Business Requirements:**
${buildBusinessRequirementsContext(requirements)}

Generate ONLY the formatted additional features table with proper markdown formatting.`;

  try {
    return await generateWithClaude(prompt, {
      maxTokens: 1200,
      temperature: 0.7,
    });
  } catch (error) {
    console.error('Failed to generate additional features:', error);
    throw new Error(`Failed to generate additional features: ${error.message}`);
  }
}

/**
 * Generate Operational Costs (Monthly) section
 * @param {Object} requirements - Business requirements object
 * @returns {Promise<string>} - Generated operational costs content
 */
export async function generateOperationalCosts(requirements) {
  const prompt = `You are a professional proposal writer. Generate an "Operational Costs (Monthly)" section based on the provided business requirements. Format EXACTLY as follows:

Monthly operational costs for hosting, services, and maintenance.

| Service | Estimated Cost | Notes |
|---------|----------------|-------|
| [Service 1] | [Cost with currency] | [Description of what this service provides] |
| [Service 2] | [Cost with currency] | [Description of what this service provides] |
| [Service 3] | [Cost with currency] | [Description of what this service provides] |
| [Service 4] | [Cost with currency] | [Description of what this service provides] |
| [Service 5] | [Cost with currency] | [Description of what this service provides] |
| [Service 6] | [Cost with currency] | [Description of what this service provides] |

**CRITICAL FORMATTING REQUIREMENTS:**
- Start with explanatory text: "Monthly operational costs for hosting, services, and maintenance."
- Use proper markdown table format with headers: Service, Estimated Cost, Notes
- Generate 4-6 monthly operational services relevant to the project
- Include realistic services: Database hosting, Web hosting, API services, Monitoring tools, Backup services, CDN/Performance services
- Use appropriate currency symbol based on country and budget range
- Cost estimates should be realistic and professional
- Notes should explain what each service provides and its importance
- Keep descriptions concise but informative (1-2 sentences per service)
- Focus on services essential for project operation and maintenance
- If company, project, or client fields are blank, do not invent names; use generic references like "the client" or "the company".

**Business Requirements:**
${buildBusinessRequirementsContext(requirements)}

Generate ONLY the formatted operational costs table with proper markdown formatting.`;

  try {
    return await generateWithClaude(prompt, {
      maxTokens: 1200,
      temperature: 0.7,
    });
  } catch (error) {
    console.error('Error generating operational costs:', error);
    throw new Error(`Failed to generate operational costs: ${error.message}`);
  }
}

/**
 * Generate Monthly Retainer Fee section
 * @param {Object} requirements - Business requirements object
 * @returns {Promise<string>} - Generated monthly retainer fee content
 */
export async function generateMonthlyRetainerFee(requirements) {
  const prompt = `You are a professional proposal writer. Generate a "Monthly Retainer Fee" section based on the provided business requirements. Format EXACTLY as follows:

Ongoing support, maintenance, and optimization retainer services.

| Service | Estimated Cost | Notes |
|---------|----------------|-------|
| [Service 1] | [Cost with currency] | [Brief description] |
| [Service 2] | [Cost with currency] | [Brief description] |

**CRITICAL FORMATTING REQUIREMENTS:**
- Start with explanatory text: "Ongoing support, maintenance, and optimization retainer services."
- Use proper markdown table format with headers: Service, Estimated Cost, Notes
- Generate EXACTLY 2 monthly retainer services (keep it minimal and focused)
- Include basic services: Technical Support, Platform Maintenance
- Use appropriate currency symbol based on country and budget range
- Cost estimates should be REALISTIC and LOWER than operational costs ($50-200/month range)
- Notes should be VERY brief and direct (maximum 4-5 words like "Basic technical support and troubleshooting")
- Keep descriptions extremely concise (single phrase per service)
- Focus on essential ongoing support services only
- Monthly retainer fees are typically much lower than operational costs
- If company, project, or client fields are blank, do not invent names; use generic references like "the client" or "the company".

**Business Requirements:**
${buildBusinessRequirementsContext(requirements)}

Generate ONLY the formatted monthly retainer fee table with proper markdown formatting.`;

  try {
    return await generateWithClaude(prompt, {
      maxTokens: 800,
      temperature: 0.7,
    });
  } catch (error) {
    console.error('Error generating monthly retainer fee:', error);
    throw new Error(`Failed to generate monthly retainer fee: ${error.message}`);
  }
}

/**
 * Generate Total Investment from Client section
 * @param {Object} requirements - Business requirements object
 * @returns {Promise<string>} - Generated total investment content
 */
export async function generateTotalInvestment(requirements) {
  const prompt = `You are a professional proposal writer. Generate a "Total Investment from Client" section based on the provided business requirements. Format EXACTLY as follows:

Summary of all investment components for the project.

| Pricing Component | Amount | Notes |
|-------------------|--------|-------|
| One Time Development Cost | [Total development cost with currency] | [Brief description of what's included] |
| Operational Costs (Monthly) | [Monthly operational cost with currency] | [Brief description of ongoing services] |
| Retainer Fee (Monthly) | [Monthly retainer cost with currency] | Optional - [Brief description of retainer services] |

**CRITICAL FORMATTING REQUIREMENTS:**
- Start with explanatory text: "Summary of all investment components for the project."
- Use proper markdown table format with headers: Pricing Component, Amount, Notes
- Generate realistic costs based on the business requirements budget range and currency
- One Time Development Cost should reflect the main project budget range
- Operational Costs should be realistic monthly hosting/service costs ($200-800/month range)
- Retainer Fee should be lower than operational costs ($50-300/month range)
- Mark Retainer Fee as "Optional" in the Notes column
- Use appropriate currency symbol based on country and budget range
- Keep descriptions concise but informative (1-2 sentences per component)
- Focus on clear, professional investment breakdown
- If company, project, or client fields are blank, do not invent names; use generic references like "the client" or "the company".

**Business Requirements:**
${buildBusinessRequirementsContext(requirements)}

Generate ONLY the formatted total investment table with proper markdown formatting.`;

  try {
    return await generateWithClaude(prompt, {
      maxTokens: 1000,
      temperature: 0.7,
    });
  } catch (error) {
    console.error('Error generating total investment:', error);
    throw new Error(`Failed to generate total investment: ${error.message}`);
  }
}

/**
 * Generate Implementation Timeline section
 * @param {Object} requirements - Business requirements object
 * @returns {Promise<string>} - Generated implementation timeline content
 */
export async function generateImplementationTimeline(requirements) {
  const prompt = `You are a professional proposal writer. Generate an "Implementation Timeline" section based on the provided business requirements. Format EXACTLY as follows:

Project implementation phases and timeline.

| Phase | Duration | Activities |
|-------|----------|-----------|
| [Phase 1] | [Duration] | [Detailed activities for this phase] |
| [Phase 2] | [Duration] | [Detailed activities for this phase] |
| [Phase 3] | [Duration] | [Detailed activities for this phase] |
| [Phase 4] | [Duration] | [Detailed activities for this phase] |
| [Phase 5] | [Duration] | [Detailed activities for this phase] |
| [Phase 6] | [Duration] | [Detailed activities for this phase] |

Total: [Overall project duration]

**CRITICAL FORMATTING REQUIREMENTS:**
- Start with explanatory text: "Project implementation phases and timeline."
- Use proper markdown table format with headers: Phase, Duration, Activities
- Generate 4-6 realistic project phases based on the timeline from business requirements
- Include standard phases: Requirements Gathering, Development, Testing, Deployment, Training & Handover
- Duration should be realistic and match the overall project timeline from requirements
- Activities should be detailed and specific to each phase (2-3 sentences per phase)
- Add "Total:" summary line below the table showing overall project duration
- Use appropriate time units (days, weeks) based on project scope
- Keep durations realistic and professional
- Focus on clear, actionable phases that demonstrate project structure
- If company, project, or client fields are blank, do not invent names; use generic references like "the client" or "the company".

**Business Requirements:**
${buildBusinessRequirementsContext(requirements)}

Generate ONLY the formatted implementation timeline table with proper markdown formatting.`;

  try {
    return await generateWithClaude(prompt, {
      maxTokens: 1200,
      temperature: 0.7,
    });
  } catch (error) {
    console.error('Error generating implementation timeline:', error);
    throw new Error(`Failed to generate implementation timeline: ${error.message}`);
  }
}

export default claudeClient;
