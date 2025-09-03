import { NextResponse } from 'next/server';
import { generateExecutiveSummary, generateProjectOverview, generateTheProblem, generateOurSolution } from '@/lib/claude-client';

export async function POST(request) {
  try {
    // Parse the request body
    const formData = await request.json();
    
    // Validate required fields
    const requiredFields = ['companyName', 'projectTitle', 'clientName', 'projectDescription', 'budgetRange', 'timeline', 'industryType'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate executive summary, project overview, problem statement, and solution using Claude API
    const [executiveSummary, projectOverview, theProblem, ourSolution] = await Promise.all([
      generateExecutiveSummary(formData),
      generateProjectOverview(formData),
      generateTheProblem(formData),
      generateOurSolution(formData)
    ]);

    // Create proposal data object
    const proposalData = {
      id: `proposal_${Date.now()}`,
      requirements: formData,
      sections: {
        'executive-summary': {
          id: 'executive-summary',
          title: 'Executive Summary',
          content: executiveSummary,
          status: 'Complete',
          approved: false,
          generatedAt: new Date().toISOString(),
          version: 1
        },
        'project-overview': {
          id: 'project-overview',
          title: 'Project Overview',
          content: projectOverview,
          status: 'Complete',
          approved: false,
          generatedAt: new Date().toISOString(),
          version: 1
        },
        'the-problem': {
          id: 'the-problem',
          title: 'The Problem',
          content: theProblem,
          status: 'Complete',
          approved: false,
          generatedAt: new Date().toISOString(),
          version: 1
        },
        'our-solution': {
          id: 'our-solution',
          title: 'Our Solution',
          content: ourSolution,
          status: 'Complete',
          approved: false,
          generatedAt: new Date().toISOString(),
          version: 1
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in localStorage (for demo purposes - in production, use a database)
    // Note: This is a server-side API, so we'll return the data to be stored client-side
    const response = {
      success: true,
      message: 'Requirements processed and sections generated successfully',
      data: proposalData
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error processing requirements:', error);
    
    // Handle specific error types
    if (error.message.includes('Authentication failed')) {
      return NextResponse.json(
        { error: 'API authentication failed. Please check your Claude API key.' },
        { status: 401 }
      );
    }
    
    if (error.message.includes('Rate limit exceeded')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    if (error.message.includes('Failed to generate content')) {
      return NextResponse.json(
        { error: 'Failed to generate content. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
