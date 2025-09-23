import { NextResponse } from 'next/server';
import { generateExecutiveSummary, generateProjectOverview, generateTheProblem, generateOurSolution, generateKeyValuePropositions, generateBenefitsAndROI, generateWithClaude } from '@/lib/claude-client';

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

    // Check if Claude API key is configured
    if (!process.env.CLAUDE_API_KEY) {
      // Handle selected sections for mock data
      if (formData.selectedSections && Array.isArray(formData.selectedSections)) {
        console.log('🎯 API: Processing selected sections request (MOCK MODE)');
        console.log('📋 Selected sections received:', formData.selectedSections);
        
        const selectedSectionIds = formData.selectedSections.map(s => s.id);
        console.log('🔍 Selected section IDs:', selectedSectionIds);
        
        const mockSections = {};
        
        // Only generate mock content for selected sections
        if (selectedSectionIds.includes('executive-summary')) {
          mockSections['executive-summary'] = {
            id: 'executive-summary',
            title: 'Executive Summary',
            content: `Our ${formData.projectTitle} is designed to help your ${formData.industryType} business streamline operations and improve efficiency. Our platform combines modern technology with user-friendly design, helping your business to achieve better results while reducing operational costs.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          };
        }
        if (selectedSectionIds.includes('project-overview')) {
          mockSections['project-overview'] = {
            id: 'project-overview',
            title: 'Project Overview',
            content: `* ${formData.companyName} will deliver ${formData.projectTitle} to address ${formData.clientCompany || formData.clientName}'s business needs.\n* The solution combines modern web technologies with responsive design and backend integration.\n* Key features: user management, data processing, and analytics with real-time updates.\n* The platform improves operational efficiency by automating processes, reducing manual work, and providing business insights.\n* Success will be defined by delivering a fully functional solution and gaining measurable business value through improved user experience.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          };
        }
        if (selectedSectionIds.includes('the-problem')) {
          mockSections['the-problem'] = {
            id: 'the-problem',
            title: 'The Problem',
            content: `Most ${formData.industryType} businesses struggle with outdated systems and manual processes that slow down operations and reduce productivity. This creates inefficiencies that impact customer satisfaction and business growth.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          };
        }
        if (selectedSectionIds.includes('our-solution')) {
          mockSections['our-solution'] = {
            id: 'our-solution',
            title: 'Our Solution',
            content: `Our ${formData.projectTitle} is designed to streamline your business operations while improving user experience. The platform provides comprehensive functionality to help your ${formData.industryType} business achieve better results and operational efficiency.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          };
        }
        if (selectedSectionIds.includes('key-value-propositions')) {
          mockSections['key-value-propositions'] = {
            id: 'key-value-propositions',
            title: 'Key Value Propositions',
            content: `1. Enhanced Operational Efficiency\n* Streamline business processes and reduce manual work\n* Automate repetitive tasks to save time and resources\n* Improve workflow management and team collaboration\n\n2. Improved User Experience\n* Intuitive interface design for better usability\n* Mobile-responsive design for accessibility\n* Fast loading times and reliable performance\n\n3. Scalable Business Growth\n* Flexible architecture that grows with your business\n* Easy integration with existing systems\n* Future-proof technology stack\n\n4. Measurable ROI and Cost Savings\n* Reduce operational costs through automation\n* Increase productivity and efficiency\n* Quick implementation and fast time-to-value`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          };
        }
        if (selectedSectionIds.includes('benefits-and-roi')) {
          mockSections['benefits-and-roi'] = {
            id: 'benefits-and-roi',
            title: 'Benefits & ROI',
            content: `Our solution delivers significant value through improved efficiency, cost savings, and enhanced user experience. Expected ROI includes reduced operational costs, increased productivity, and measurable business growth.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          };
        }
        
        const mockData = {
          id: `proposal_${Date.now()}`,
          requirements: formData,
          sections: mockSections,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        console.log('📤 API: Returning mock data with sections:', Object.keys(mockSections));
        
        return NextResponse.json({
          success: true,
          message: 'Selected sections generated successfully (using mock data - Claude API key not configured)',
          data: mockData
        });
      }
      
      // Return mock data for development/testing (all sections)
      const mockData = {
        id: `proposal_${Date.now()}`,
        requirements: formData,
        sections: {
          'executive-summary': {
            id: 'executive-summary',
            title: 'Executive Summary',
            content: `Our ${formData.projectTitle} is designed to help your ${formData.industryType} business streamline operations and improve efficiency. Our platform combines modern technology with user-friendly design, helping your business to achieve better results while reducing operational costs.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'project-overview': {
            id: 'project-overview',
            title: 'Project Overview',
            content: `* ${formData.companyName} will deliver ${formData.projectTitle} to address ${formData.clientCompany || formData.clientName}'s business needs.\n* The solution combines modern web technologies with responsive design and backend integration.\n* Key features: user management, data processing, and analytics with real-time updates.\n* The platform improves operational efficiency by automating processes, reducing manual work, and providing business insights.\n* Success will be defined by delivering a fully functional solution and gaining measurable business value through improved user experience.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'the-problem': {
            id: 'the-problem',
            title: 'The Problem',
            content: `Most ${formData.industryType} businesses struggle with outdated systems and manual processes that slow down operations and reduce productivity. This creates inefficiencies that impact customer satisfaction and business growth.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'our-solution': {
            id: 'our-solution',
            title: 'Our Solution',
            content: `Our ${formData.projectTitle} is designed to streamline your business operations while improving user experience. The platform provides comprehensive functionality to help your ${formData.industryType} business achieve better results and operational efficiency.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'key-value-propositions': {
            id: 'key-value-propositions',
            title: 'Key Value Propositions',
            content: `1. Enhanced Operational Efficiency\n* Streamline business processes and reduce manual work\n* Automate repetitive tasks to save time and resources\n* Improve workflow management and team collaboration\n\n2. Improved User Experience\n* Intuitive interface design for better usability\n* Mobile-responsive design for accessibility\n* Fast loading times and reliable performance\n\n3. Scalable Business Growth\n* Flexible architecture that grows with your business\n* Easy integration with existing systems\n* Future-proof technology stack\n\n4. Measurable ROI and Cost Savings\n* Reduce operational costs through automation\n* Increase productivity and efficiency\n* Quick implementation and fast time-to-value`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        message: 'Requirements processed successfully (using mock data - Claude API key not configured)',
        data: mockData
      });
    }

    // Check if this is a regeneration request for a specific section
    if (formData.regenerate && formData.sectionType) {
      let content;
      
      if (formData.sectionType === 'executive-summary') {
        content = await generateExecutiveSummary(formData);
      } else if (formData.sectionType === 'project-overview') {
        content = await generateProjectOverview(formData);
      } else if (formData.sectionType === 'the-problem') {
        content = await generateTheProblem(formData);
      } else if (formData.sectionType === 'our-solution') {
        content = await generateOurSolution(formData);
      } else if (formData.sectionType === 'key-value-propositions') {
        content = await generateKeyValuePropositions(formData);
      } else if (formData.sectionType === 'benefits-and-roi') {
        content = await generateBenefitsAndROI(formData);
      } else if (formData.sectionType === 'generic') {
        // Generate generic content for custom sections
        const prompt = `Generate content for a business proposal section titled "${formData.sectionTitle}" based on the following requirements:

Company: ${formData.companyName}
Project: ${formData.projectTitle}
Client: ${formData.clientName} (${formData.clientCompany || 'N/A'})
Industry: ${formData.industryType}
Budget: ${formData.budgetRange}
Timeline: ${formData.timeline}
Objectives: ${formData.objectives?.join(', ') || 'N/A'}
Project Description: ${formData.projectDescription}

Please generate professional, detailed content for this section that aligns with the project requirements and industry context.`;

        content = await generateWithClaude(prompt, { maxTokens: 1500 });
      }
      
      return NextResponse.json({
        success: true,
        data: {
          content: content
        }
      });
    }

    // Check if this is a request to generate only selected sections
    if (formData.selectedSections && Array.isArray(formData.selectedSections)) {
      console.log('🎯 API: Processing selected sections request');
      console.log('📋 Selected sections received:', formData.selectedSections);
      
      const selectedSectionIds = formData.selectedSections.map(s => s.id);
      console.log('🔍 Selected section IDs:', selectedSectionIds);
      
      const sectionsToGenerate = {};
      
      // Only generate content for selected sections
      if (selectedSectionIds.includes('executive-summary')) {
        console.log('✅ Generating executive-summary');
        sectionsToGenerate['executive-summary'] = await generateExecutiveSummary(formData);
      }
      if (selectedSectionIds.includes('project-overview')) {
        console.log('✅ Generating project-overview');
        sectionsToGenerate['project-overview'] = await generateProjectOverview(formData);
      }
      if (selectedSectionIds.includes('the-problem')) {
        console.log('✅ Generating the-problem');
        sectionsToGenerate['the-problem'] = await generateTheProblem(formData);
      }
      if (selectedSectionIds.includes('our-solution')) {
        console.log('✅ Generating our-solution');
        sectionsToGenerate['our-solution'] = await generateOurSolution(formData);
      }
      if (selectedSectionIds.includes('key-value-propositions')) {
        console.log('✅ Generating key-value-propositions');
        sectionsToGenerate['key-value-propositions'] = await generateKeyValuePropositions(formData);
      }
      if (selectedSectionIds.includes('benefits-and-roi')) {
        console.log('✅ Generating benefits-and-roi');
        sectionsToGenerate['benefits-and-roi'] = await generateBenefitsAndROI(formData);
      }
      
      console.log('📊 Sections to generate:', Object.keys(sectionsToGenerate));
      
      // Create proposal data object with only selected sections
      const proposalData = {
        id: `proposal_${Date.now()}`,
        requirements: formData,
        sections: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add generated sections to proposal data
      Object.entries(sectionsToGenerate).forEach(([sectionId, content]) => {
        const sectionTitles = {
          'executive-summary': 'Executive Summary',
          'project-overview': 'Project Overview',
          'the-problem': 'The Problem',
          'our-solution': 'Our Solution',
          'key-value-propositions': 'Key Value Propositions',
          'benefits-and-roi': 'Benefits & ROI'
        };
        
        proposalData.sections[sectionId] = {
          id: sectionId,
          title: sectionTitles[sectionId],
          content: content,
          status: 'Complete',
          approved: false,
          generatedAt: new Date().toISOString(),
          version: 1
        };
      });
      
      console.log('📤 API: Returning proposal data with sections:', Object.keys(proposalData.sections));
      
      return NextResponse.json({
        success: true,
        message: 'Selected sections generated successfully',
        data: proposalData
      });
    }

    // Generate executive summary, project overview, problem statement, solution, and key value propositions using Claude API
    const [executiveSummary, projectOverview, theProblem, ourSolution, keyValuePropositions] = await Promise.all([
      generateExecutiveSummary(formData),
      generateProjectOverview(formData),
      generateTheProblem(formData),
      generateOurSolution(formData),
      generateKeyValuePropositions(formData)
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
        },
        'key-value-propositions': {
          id: 'key-value-propositions',
          title: 'Key Value Propositions',
          content: keyValuePropositions,
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
