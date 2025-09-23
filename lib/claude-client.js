import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client with proper configuration
const claudeClient = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
  maxRetries: 3,
  timeout: 30000, // 30 seconds
});



/**
 * Generate content using Claude API with retry logic and error handling
 * @param {string} prompt - The prompt to send to Claude
 * @param {Object} options - Additional options for the request
 * @returns {Promise<string>} - Generated content
 */
export async function generateWithClaude(prompt, options = {}) {
  const maxRetries = options.maxRetries || 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await claudeClient.messages.create({
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

**Business Requirements:**
Company: ${requirements.companyName}
Project: ${requirements.projectTitle}
Client: ${requirements.clientName}${requirements.clientCompany ? ` (${requirements.clientCompany})` : ''}
Description: ${requirements.projectDescription}
Budget: ${requirements.budgetRange}
Timeline: ${requirements.timeline}
Industry: ${requirements.industryType}

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

**Business Requirements:**
Company: ${requirements.companyName}
Project: ${requirements.projectTitle}
Client: ${requirements.clientName}${requirements.clientCompany ? ` (${requirements.clientCompany})` : ''}
Description: ${requirements.projectDescription}
Budget: ${requirements.budgetRange}
Timeline: ${requirements.timeline}
Industry: ${requirements.industryType}

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

"Most [client's industry/business type] [main challenge/pain point], and [secondary challenge that compounds the problem]."

**Requirements:**
- One paragraph format (no bullet points or asterisks)
- 2-3 sentences maximum
- Start with "Most [industry/business type]..."
- Focus on the core business challenge
- Include a secondary related problem
- Keep it simple and direct
- No technical jargon
- Make it relatable to their specific industry

**Business Requirements:**
Company: ${requirements.companyName}
Project: ${requirements.projectTitle}
Client: ${requirements.clientName}${requirements.clientCompany ? ` (${requirements.clientCompany})` : ''}
Description: ${requirements.projectDescription}
Budget: ${requirements.budgetRange}
Timeline: ${requirements.timeline}
Industry: ${requirements.industryType}
Objectives: ${requirements.objectives ? requirements.objectives.join(', ') : 'Not specified'}

Generate based on the project description, industry type, and business context provided in the requirements form.`;

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

**Business Requirements:**
Company: ${requirements.companyName}
Project: ${requirements.projectTitle}
Client: ${requirements.clientName}${requirements.clientCompany ? ` (${requirements.clientCompany})` : ''}
Description: ${requirements.projectDescription}
Budget: ${requirements.budgetRange}
Timeline: ${requirements.timeline}
Industry: ${requirements.industryType}
Objectives: ${requirements.objectives ? requirements.objectives.join(', ') : 'Not specified'}

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

**Business Requirements:**
Company: ${requirements.companyName}
Project: ${requirements.projectTitle}
Client: ${requirements.clientName}${requirements.clientCompany ? ` (${requirements.clientCompany})` : ''}
Description: ${requirements.projectDescription}
Budget: ${requirements.budgetRange}
Timeline: ${requirements.timeline}
Industry: ${requirements.industryType}
Objectives: ${requirements.objectives ? requirements.objectives.join(', ') : 'Not specified'}

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
● [Specific revenue benefit]: [description of improvement]
● [Another revenue benefit]: [description of impact]
● [Third revenue benefit]: [description of outcome]

Cost Savings:
● [Cost saving area]: [description of savings]
● [Another cost saving]: [description of efficiency]
● [Third cost benefit]: [description of reduction]

Competitive Advantages:
● [Advantage area]: [description of benefit]
● [Another advantage]: [description of differentiation]
● [Third advantage]: [description of strategic benefit]
● [Fourth advantage]: [description of growth benefit]

**Requirements:**
- Use exactly 3 plain text category headings followed by colon (no bold formatting)
- Use filled circle bullets (●) for sub-points
- Each category should have 3-4 benefits
- Focus on measurable business outcomes
- Make it specific to their project type and industry
- No specific numbers or percentages
- Each bullet point should be a complete sentence
- Focus on tangible business value and return on investment
- Each bullet point on separate line with clean spacing between sections
- Remove any introductory text, explanatory content, or bold formatting
- Display format should be: "Revenue Impact:" followed by bullet points, then "Cost Savings:" with bullets, then "Competitive Advantages:" with bullets

**Business Requirements:**
Company: ${requirements.companyName}
Project: ${requirements.projectTitle}
Client: ${requirements.clientName}${requirements.clientCompany ? ` (${requirements.clientCompany})` : ''}
Description: ${requirements.projectDescription}
Budget: ${requirements.budgetRange}
Timeline: ${requirements.timeline}
Industry: ${requirements.industryType}
Objectives: ${requirements.objectives ? requirements.objectives.join(', ') : 'Not specified'}

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

export default claudeClient;
