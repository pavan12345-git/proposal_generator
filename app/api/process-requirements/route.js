import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body
    const formData = await request.json();
    
    // Validate required fields (only project description)
    const requiredFields = ['projectDescription'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if Claude API key is configured
    console.log('🔍 Checking Claude API key...', process.env.CLAUDE_API_KEY ? 'Configured' : 'Not configured');
    if (!process.env.CLAUDE_API_KEY) {
      console.log('⚠️ Claude API key not configured, using mock data');
      
      // Return mock data for development/testing (all sections)
      const mockData = {
        id: `proposal_${Date.now()}`,
        requirements: formData,
        sections: {
          'executive-summary': {
            id: 'executive-summary',
            title: 'Executive Summary',
            content: `Our ${formData.projectTitle} is designed to help your business streamline operations and improve efficiency. Our platform combines modern technology with user-friendly design, helping your business to achieve better results while reducing operational costs.`,
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
            content: `Most businesses struggle with outdated systems and manual processes that slow down operations and reduce productivity. This creates inefficiencies that impact customer satisfaction and business growth.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'our-solution': {
            id: 'our-solution',
            title: 'Our Solution',
            content: `Our ${formData.projectTitle} is designed to streamline your business operations while improving user experience. The platform provides comprehensive functionality to help your business achieve better results and operational efficiency.`,
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
      try {
        const importedFunctions = await import('@/lib/claude-client');
        console.log('Imported functions:', Object.keys(importedFunctions));
        console.log('generateAdditionalFeatures exists:', 'generateAdditionalFeatures' in importedFunctions);
        
        const { generateExecutiveSummary, generateProjectOverview, generateTheProblem, generateOurSolution, generateKeyValuePropositions, generateBenefitsAndROI, generateNextSteps, generateDevelopmentCost, generateAdditionalFeatures, generateOperationalCosts, generateMonthlyRetainerFee, generateTotalInvestment, generateImplementationTimeline, generateProcessFlowDiagram, generateTechnicalArchitecture, generateWithClaude } = importedFunctions;
        
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
      } else if (formData.sectionType === 'next-steps') {
        content = await generateNextSteps(formData);
      } else if (formData.sectionType === 'one-time-development-cost') {
        content = await generateDevelopmentCost(formData);
      } else if (formData.sectionType === 'additional-features-recommended') {
        console.log('🔄 Generating additional-features-recommended...');
        console.log('Function exists:', typeof generateAdditionalFeatures);
        if (typeof generateAdditionalFeatures !== 'function') {
          throw new Error('generateAdditionalFeatures function not found');
        }
        content = await generateAdditionalFeatures(formData);
        console.log('✅ Generated additional-features-recommended successfully');
      } else if (formData.sectionType === 'operational-costs-monthly') {
        console.log('🔄 Generating operational-costs-monthly...');
        console.log('Function exists:', typeof generateOperationalCosts);
        if (typeof generateOperationalCosts !== 'function') {
          throw new Error('generateOperationalCosts function not found');
        }
        content = await generateOperationalCosts(formData);
        console.log('✅ Generated operational-costs-monthly successfully');
      } else if (formData.sectionType === 'monthly-retainer-fee') {
        console.log('🔄 Generating monthly-retainer-fee...');
        console.log('Function exists:', typeof generateMonthlyRetainerFee);
        if (typeof generateMonthlyRetainerFee !== 'function') {
          throw new Error('generateMonthlyRetainerFee function not found');
        }
        content = await generateMonthlyRetainerFee(formData);
        console.log('✅ Generated monthly-retainer-fee successfully');
      } else if (formData.sectionType === 'total-investment-from-client') {
        console.log('🔄 Generating total-investment-from-client...');
        console.log('Function exists:', typeof generateTotalInvestment);
        if (typeof generateTotalInvestment !== 'function') {
          throw new Error('generateTotalInvestment function not found');
        }
        content = await generateTotalInvestment(formData);
        console.log('✅ Generated total-investment-from-client successfully');
      } else if (formData.sectionType === 'implementation-timeline') {
        console.log('🔄 Generating implementation-timeline...');
        console.log('Function exists:', typeof generateImplementationTimeline);
        if (typeof generateImplementationTimeline !== 'function') {
          throw new Error('generateImplementationTimeline function not found');
        }
        content = await generateImplementationTimeline(formData);
        console.log('✅ Generated implementation-timeline successfully');
      } else if (formData.sectionType === 'process-flow-diagram') {
        console.log('🔄 Generating process-flow-diagram...');
        console.log('Function exists:', typeof generateProcessFlowDiagram);
        if (typeof generateProcessFlowDiagram !== 'function') {
          throw new Error('generateProcessFlowDiagram function not found');
        }
        content = await generateProcessFlowDiagram(formData);
        console.log('✅ Generated process-flow-diagram successfully');
      } else if (formData.sectionType === 'technical-architecture') {
        console.log('🔄 Generating technical-architecture...');
        console.log('Function exists:', typeof generateTechnicalArchitecture);
        if (typeof generateTechnicalArchitecture !== 'function') {
          throw new Error('generateTechnicalArchitecture function not found');
        }
        content = await generateTechnicalArchitecture(formData);
        console.log('✅ Generated technical-architecture successfully');
      } else if (formData.sectionType === 'generic') {
        // Generate generic content for custom sections
        const prompt = `Generate content for a business proposal section titled "${formData.sectionTitle}" based on the following requirements:

Company: ${formData.companyName}
Project: ${formData.projectTitle}
Client: ${formData.clientName} (${formData.clientCompany || 'N/A'})
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
      } catch (importError) {
        console.error('Error in regeneration:', importError);
        
        // Check if it's a Claude API error
        if (importError.message.includes('Claude API is currently overloaded')) {
          return NextResponse.json(
            { error: 'Claude API is currently overloaded. Please try again later.' },
            { status: 529 }
          );
        }
        
        if (importError.message.includes('Rate limit exceeded')) {
          return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            { status: 429 }
          );
        }
        
        if (importError.message.includes('Authentication failed')) {
          return NextResponse.json(
            { error: 'API authentication failed. Please check your Claude API key.' },
            { status: 401 }
          );
        }
        
        // If it's a genuine import error
        if (importError.message.includes('Failed to import') || importError.message.includes('Cannot resolve module')) {
          return NextResponse.json(
            { error: `Failed to import required functions: ${importError.message}` },
            { status: 500 }
          );
        }
        
        // For other errors, return the original error message
        return NextResponse.json(
          { error: importError.message },
          { status: 500 }
        );
      }
    }

    // Check if this is a request to generate only selected sections
    if (formData.selectedSections && Array.isArray(formData.selectedSections)) {
      console.log('🎯 API: Processing selected sections request');
      console.log('📋 Selected sections received:', formData.selectedSections);
      
      const { generateExecutiveSummary, generateProjectOverview, generateTheProblem, generateOurSolution, generateKeyValuePropositions, generateBenefitsAndROI, generateNextSteps, generateDevelopmentCost, generateAdditionalFeatures, generateOperationalCosts, generateMonthlyRetainerFee, generateTotalInvestment, generateImplementationTimeline, generateProcessFlowDiagram, generateTechnicalArchitecture } = await import('@/lib/claude-client');
      
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
      if (selectedSectionIds.includes('next-steps')) {
        console.log('✅ Generating next-steps');
        sectionsToGenerate['next-steps'] = await generateNextSteps(formData);
      }
      if (selectedSectionIds.includes('one-time-development-cost')) {
        console.log('✅ Generating one-time-development-cost');
        sectionsToGenerate['one-time-development-cost'] = await generateDevelopmentCost(formData);
      }
      if (selectedSectionIds.includes('additional-features-recommended')) {
        console.log('✅ Generating additional-features-recommended');
        sectionsToGenerate['additional-features-recommended'] = await generateAdditionalFeatures(formData);
      }
      if (selectedSectionIds.includes('operational-costs-monthly')) {
        console.log('✅ Generating operational-costs-monthly');
        sectionsToGenerate['operational-costs-monthly'] = await generateOperationalCosts(formData);
      }
      if (selectedSectionIds.includes('monthly-retainer-fee')) {
        console.log('✅ Generating monthly-retainer-fee');
        sectionsToGenerate['monthly-retainer-fee'] = await generateMonthlyRetainerFee(formData);
      }
      if (selectedSectionIds.includes('total-investment-from-client')) {
        console.log('✅ Generating total-investment-from-client');
        sectionsToGenerate['total-investment-from-client'] = await generateTotalInvestment(formData);
      }
      if (selectedSectionIds.includes('implementation-timeline')) {
        console.log('✅ Generating implementation-timeline');
        sectionsToGenerate['implementation-timeline'] = await generateImplementationTimeline(formData);
      }
      if (selectedSectionIds.includes('process-flow-diagram')) {
        console.log('✅ Generating process-flow-diagram');
        sectionsToGenerate['process-flow-diagram'] = await generateProcessFlowDiagram(formData);
      }
      if (selectedSectionIds.includes('technical-architecture')) {
        console.log('✅ Generating technical-architecture');
        sectionsToGenerate['technical-architecture'] = await generateTechnicalArchitecture(formData);
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
          'benefits-and-roi': 'Benefits & ROI',
          'next-steps': 'Next Steps',
          'one-time-development-cost': 'One Time Development Cost',
          'additional-features-recommended': 'Additional Features Recommended',
          'operational-costs-monthly': 'Operational Costs (Monthly)',
          'monthly-retainer-fee': 'Monthly Retainer Fee',
          'total-investment-from-client': 'Total Investment from Client',
          'implementation-timeline': 'Implementation Timeline',
          'process-flow-diagram': 'Process Flow Diagram',
          'technical-architecture': 'Technical Architecture'
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
    let executiveSummary, projectOverview, theProblem, ourSolution, keyValuePropositions;
    
    try {
      const { generateExecutiveSummary, generateProjectOverview, generateTheProblem, generateOurSolution, generateKeyValuePropositions } = await import('@/lib/claude-client');
      
      [executiveSummary, projectOverview, theProblem, ourSolution, keyValuePropositions] = await Promise.all([
        generateExecutiveSummary(formData),
        generateProjectOverview(formData),
        generateTheProblem(formData),
        generateOurSolution(formData),
        generateKeyValuePropositions(formData)
      ]);
    } catch (claudeError) {
      console.log('⚠️ Claude API failed, falling back to mock data:', claudeError.message);
      
      // Fallback to mock data when Claude API fails
      const mockData = {
        id: `proposal_${Date.now()}`,
        requirements: formData,
        sections: {
          'executive-summary': {
            id: 'executive-summary',
            title: 'Executive Summary',
            content: `Our ${formData.projectTitle} is designed to help your business streamline operations and improve efficiency. Our platform combines modern technology with user-friendly design, helping your business to achieve better results while reducing operational costs.`,
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
            content: `Most businesses struggle with outdated systems and manual processes that slow down operations and reduce productivity. This creates inefficiencies that impact customer satisfaction and business growth.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'our-solution': {
            id: 'our-solution',
            title: 'Our Solution',
            content: `Our ${formData.projectTitle} is designed to streamline your business operations while improving user experience. The platform provides comprehensive functionality to help your business achieve better results and operational efficiency.`,
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
        message: 'Requirements processed successfully (using mock data - Claude API temporarily unavailable)',
        data: mockData
      });
    }

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
