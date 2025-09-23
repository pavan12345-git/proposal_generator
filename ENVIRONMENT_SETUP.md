# Environment Setup Guide

## Claude API Configuration

To enable AI-powered content generation, you need to configure your Claude API key:

1. **Get your Claude API key:**
   - Visit [Anthropic Console](https://console.anthropic.com/)
   - Sign up or log in to your account
   - Navigate to API Keys section
   - Create a new API key

2. **Configure the environment:**
   - Create a `.env.local` file in the project root
   - Add your API key:
     ```
     CLAUDE_API_KEY="YOUR_API_KEY"
     ```

3. **Restart the development server:**
   ```bash
   npm run dev
   ```

## Fallback Mode

If no Claude API key is configured, the application will:
- Use mock data for content generation
- Display a message indicating mock data is being used
- Still allow you to test the complete form submission and navigation flow

## Testing the Form

1. Navigate to `/requirements`
2. Fill out the Business Requirements Form
3. Click "Submit & Continue"
4. You should be redirected to `/content-index` with generated content

## Troubleshooting

- **Form not submitting:** Check browser console for JavaScript errors
- **Navigation not working:** Ensure all required fields are filled
- **API errors:** Verify your Claude API key is correct and has sufficient credits
