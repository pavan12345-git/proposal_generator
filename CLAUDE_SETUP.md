# Claude API Integration Setup

This guide will help you set up the Claude API integration for automatic Executive Summary generation.

## Prerequisites

1. An Anthropic Claude API key
2. Node.js and npm installed
3. The proposal generator app running locally

## Setup Steps

### 1. Get Your Claude API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the API key (it starts with `sk-ant-`)

### 2. Configure Environment Variables

1. Open the `.env.local` file in the root directory
2. Replace `your_claude_api_key_here` with your actual API key:

```env
# Claude API Configuration
CLAUDE_API_KEY=sk-ant-your-actual-api-key-here

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Install Dependencies

The required dependencies are already installed, but if you need to reinstall:

```bash
npm install @anthropic-ai/sdk --legacy-peer-deps
```

### 4. Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Fill out the business requirements form and submit

4. The system will automatically:
   - Call the Claude API to generate an Executive Summary, Project Overview, and Problem Statement
   - Store the generated content
   - Navigate to the Content Index page
   - Show the pre-generated sections with "Generated" badges

## How It Works

### Automatic Generation Flow

1. **Form Submission**: When the business requirements form is submitted, it calls `/api/process-requirements`
2. **API Processing**: The API endpoint:
   - Validates the form data
   - Calls Claude API with professional prompts
   - Generates Executive Summary, Project Overview, and Problem Statement
   - Returns the data to the client
3. **Data Storage**: The generated content is stored in localStorage
4. **Content Display**: The Executive Summary appears pre-generated on the Content Index page

### Regeneration

- Users can regenerate the Executive Summary using the "Regenerate" button
- This calls the same Claude API with the original requirements
- The new content replaces the previous version
- Version tracking is maintained

### Error Handling

The system includes comprehensive error handling for:
- API authentication failures
- Rate limiting
- Network timeouts
- Invalid responses
- Missing required fields

## API Configuration

### Claude Client Settings

- **Model**: `claude-3-5-sonnet-20241022`
- **Max Tokens**: 500 for Executive Summary
- **Temperature**: 0.7 (balanced creativity)
- **Timeout**: 30 seconds
- **Retries**: 3 attempts with exponential backoff

### Executive Summary Prompt

The system uses a professional prompt that:
- Incorporates all business requirements
- Focuses on value proposition and ROI
- Maintains professional tone
- Targets 200-300 words
- Emphasizes business impact

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check your API key in `.env.local`
   - Ensure the key starts with `sk-ant-`
   - Verify the key is active in Anthropic Console

2. **"Rate limit exceeded"**
   - Wait a few minutes before trying again
   - Check your Anthropic account usage limits

3. **"Failed to generate content"**
   - Check your internet connection
   - Verify the API endpoint is accessible
   - Check browser console for detailed errors

### Debug Mode

To enable detailed logging, add this to your `.env.local`:

```env
DEBUG=true
```

## Security Notes

- Never commit your API key to version control
- The `.env.local` file is already in `.gitignore`
- API keys are only used server-side
- All API calls include proper error handling

## Next Steps

Once the Claude integration is working:

1. Test the complete workflow from requirements to final review
2. Customize the Executive Summary prompt if needed
3. Add generation for other proposal sections
4. Implement database storage instead of localStorage
5. Add user authentication and proposal management
