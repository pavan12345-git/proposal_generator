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
            content: `Our ${formData.projectTitle || 'project'} is designed to help your business streamline operations and improve efficiency. Our platform combines modern technology with user-friendly design, helping your business to achieve better results while reducing operational costs.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'project-overview': {
            id: 'project-overview',
            title: 'Project Overview',
            content: `* ${formData.companyName || 'our company'} will deliver ${formData.projectTitle || 'project'} to address ${formData.clientCompany || 'the client company' || formData.clientName || 'the client'}'s business needs.\n* The solution combines modern web technologies with responsive design and backend integration.\n* Key features: user management, data processing, and analytics with real-time updates.\n* The platform improves operational efficiency by automating processes, reducing manual work, and providing business insights.\n* Success will be defined by delivering a fully functional solution and gaining measurable business value through improved user experience.`,
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
            content: `Our ${formData.projectTitle || 'project'} is designed to streamline your business operations while improving user experience. The platform provides comprehensive functionality to help your business achieve better results and operational efficiency.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'key-features': {
            id: 'key-features',
            title: 'Key Features',
            content: `**1. Core Functionality**
● Essential business operations
● User management and authentication
● Data processing and storage

**2. User Experience**
● Intuitive interface design
● Mobile-responsive layout
● Accessibility compliance

**3. Integration Capabilities**
● Third-party API connections
● Database synchronization
● Real-time data updates

**4. Security & Compliance**
● Data encryption and protection
● User access controls
● Audit trail functionality

**5. Performance & Scalability**
● High-speed processing
● Cloud-based infrastructure
● Scalable architecture

**6. Analytics & Reporting**
● Business intelligence dashboards
● Custom reporting tools
● Performance metrics tracking`,
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
        content = normalizeImplementationTimeline(content);
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

Company: ${formData.companyName || 'our company'}
Project: ${formData.projectTitle || 'project'}
Client: ${formData.clientName || 'the client'} (${formData.clientCompany || 'the client company' || 'N/A'})
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
      
      const { generateExecutiveSummary, generateProjectOverview, generateTheProblem, generateOurSolution, generateKeyFeatures, generateKeyValuePropositions, generateBenefitsAndROI, generateNextSteps, generateDevelopmentCost, generateAdditionalFeatures, generateOperationalCosts, generateMonthlyRetainerFee, generateTotalInvestment, generateImplementationTimeline, generateProcessFlowDiagram, generateTechnicalArchitecture } = await import('@/lib/claude-client');
      
      const selectedSectionIds = formData.selectedSections.map(s => s.id);
      console.log('🔍 Selected section IDs:', selectedSectionIds);
      
      const sectionsToGenerate = {};
      
      // Only generate content for selected sections
      if (selectedSectionIds.includes('executive-summary')) {
        console.log('✅ Generating executive-summary');
        try {
          sectionsToGenerate['executive-summary'] = await generateExecutiveSummary(formData);
        } catch (error) {
          console.log('⚠️ Failed to generate executive-summary, using fallback');
          sectionsToGenerate['executive-summary'] = `Our ${formData.projectTitle || 'project'} is designed to help your business streamline operations and improve efficiency. Our platform combines modern technology with user-friendly design, helping your business to achieve better results while reducing operational costs.`;
        }
      }
      if (selectedSectionIds.includes('project-overview')) {
        console.log('✅ Generating project-overview');
        try {
          sectionsToGenerate['project-overview'] = await generateProjectOverview(formData);
        } catch (error) {
          console.log('⚠️ Failed to generate project-overview, using fallback');
          sectionsToGenerate['project-overview'] = `* ${formData.companyName || 'our company'} will deliver ${formData.projectTitle || 'project'} to address ${formData.clientCompany || 'the client company' || formData.clientName || 'the client'}'s business needs.\n* The solution combines modern web technologies with responsive design and backend integration.\n* Key features: user management, data processing, and analytics with real-time updates.\n* The platform improves operational efficiency by automating processes, reducing manual work, and providing business insights.\n* Success will be defined by delivering a fully functional solution and gaining measurable business value through improved user experience.`;
        }
      }
      if (selectedSectionIds.includes('the-problem')) {
        console.log('✅ Generating the-problem');
        try {
          sectionsToGenerate['the-problem'] = await generateTheProblem(formData);
        } catch (error) {
          console.log('⚠️ Failed to generate the-problem, using fallback');
          sectionsToGenerate['the-problem'] = `Most businesses struggle with outdated systems and manual processes that slow down operations and reduce productivity. This creates inefficiencies that impact customer satisfaction and business growth.`;
        }
      }
      if (selectedSectionIds.includes('our-solution')) {
        console.log('✅ Generating our-solution');
        try {
          sectionsToGenerate['our-solution'] = await generateOurSolution(formData);
        } catch (error) {
          console.log('⚠️ Failed to generate our-solution, using fallback');
          sectionsToGenerate['our-solution'] = `Our ${formData.projectTitle || 'project'} is designed to streamline your business operations while improving user experience. The platform provides comprehensive functionality to help your business achieve better results and operational efficiency.`;
        }
      }
      if (selectedSectionIds.includes('key-features')) {
        console.log('✅ Generating key-features');
        try {
          sectionsToGenerate['key-features'] = await generateKeyFeatures(formData);
        } catch (error) {
          console.log('⚠️ Failed to generate key-features, using fallback');
          sectionsToGenerate['key-features'] = `**1. Core Functionality**
● Essential business operations
● User management and authentication
● Data processing and storage

**2. User Experience**
● Intuitive interface design
● Mobile-responsive layout
● Accessibility compliance

**3. Integration Capabilities**
● Third-party API connections
● Database synchronization
● Real-time data updates

**4. Security & Compliance**
● Data encryption and protection
● User access controls
● Audit trail functionality

**5. Performance & Scalability**
● High-speed processing
● Cloud-based infrastructure
● Scalable architecture

**6. Analytics & Reporting**
● Business intelligence dashboards
● Custom reporting tools
● Performance metrics tracking`;
        }
      }
      if (selectedSectionIds.includes('key-value-propositions')) {
        console.log('✅ Generating key-value-propositions');
        try {
          sectionsToGenerate['key-value-propositions'] = await generateKeyValuePropositions(formData);
        } catch (error) {
          console.log('⚠️ Failed to generate key-value-propositions, using fallback');
          sectionsToGenerate['key-value-propositions'] = `1. Enhanced Operational Efficiency\n* Streamline business processes and reduce manual work\n* Automate repetitive tasks to save time and resources\n* Improve workflow management and team collaboration\n\n2. Improved User Experience\n* Intuitive interface design for better usability\n* Mobile-responsive design for accessibility\n* Fast loading times and reliable performance\n\n3. Scalable Business Growth\n* Flexible architecture that grows with your business\n* Easy integration with existing systems\n* Future-proof technology stack\n\n4. Measurable ROI and Cost Savings\n* Reduce operational costs through automation\n* Increase productivity and efficiency\n* Quick implementation and fast time-to-value`;
        }
      }
      if (selectedSectionIds.includes('benefits-and-roi')) {
        console.log('✅ Generating benefits-and-roi');
        try {
          sectionsToGenerate['benefits-and-roi'] = await generateBenefitsAndROI(formData);
        } catch (error) {
          console.log('⚠️ Failed to generate benefits-and-roi, using fallback');
          sectionsToGenerate['benefits-and-roi'] = `The implementation of ${formData.projectTitle || 'project'} will deliver significant benefits including improved operational efficiency, reduced manual work, enhanced user experience, and measurable cost savings. Expected ROI of 200-300% within the first year.`;
        }
      }
      if (selectedSectionIds.includes('next-steps')) {
        console.log('✅ Generating next-steps');
        try {
          sectionsToGenerate['next-steps'] = await generateNextSteps(formData);
        } catch (error) {
          console.log('⚠️ Failed to generate next-steps, using fallback');
          sectionsToGenerate['next-steps'] = `1. Project kickoff meeting\n2. Requirements finalization\n3. Design and development phase\n4. Testing and quality assurance\n5. Deployment and go-live\n6. Training and support`;
        }
      }
      if (selectedSectionIds.includes('one-time-development-cost')) {
        console.log('✅ Generating one-time-development-cost');
        try {
          sectionsToGenerate['one-time-development-cost'] = await generateDevelopmentCost(formData);
        } catch (error) {
          console.log('⚠️ Failed to generate one-time-development-cost, using fallback');
          sectionsToGenerate['one-time-development-cost'] = `Includes:
• Full front end and back end development
• Email parsing, matching algorithm
• System testing
• Production migration and DevOps

| Component | Description | Estimate |
|-----------|-------------|----------|
| Front End Development | End-to-end website design and development | $ 500 |
| Email Parsing | CSV and email parsing, data validation | $ 1000 |
| Matching Algorithm | Core matching algorithms, confidence scoring | $ 1000 |
| DevOps | GitHub workflows and code migration | $ 100 |
| QA/Testing | Validate application flows and admin functionalities | $ 100 |
| Development Cost |  | $ 2700 |`;
        }
      }
      if (selectedSectionIds.includes('additional-features-recommended')) {
        console.log('✅ Generating additional-features-recommended');
        try {
          sectionsToGenerate['additional-features-recommended'] = await generateAdditionalFeatures(formData);
        } catch (error) {
          console.log('⚠️ Failed to generate additional-features-recommended, using fallback');
          sectionsToGenerate['additional-features-recommended'] = `Recommended additional features include advanced analytics dashboard, mobile app development, API integrations, and automated reporting capabilities to enhance the overall solution value.`;
        }
      }
      if (selectedSectionIds.includes('operational-costs-monthly')) {
        console.log('✅ Generating operational-costs-monthly');
        try {
          sectionsToGenerate['operational-costs-monthly'] = await generateOperationalCosts(formData);
        } catch (error) {
          console.log('⚠️ Failed to generate operational-costs-monthly, using fallback');
          sectionsToGenerate['operational-costs-monthly'] = `Monthly operational costs include hosting, maintenance, monitoring, and support services estimated at $500-1000 per month depending on usage and scale.`;
        }
      }
      if (selectedSectionIds.includes('monthly-retainer-fee')) {
        console.log('✅ Generating monthly-retainer-fee');
        try {
          sectionsToGenerate['monthly-retainer-fee'] = await generateMonthlyRetainerFee(formData);
        } catch (error) {
          console.log('⚠️ Failed to generate monthly-retainer-fee, using fallback');
          sectionsToGenerate['monthly-retainer-fee'] = `Monthly retainer fee for ongoing support, maintenance, and feature updates is $2000-4000 per month, providing dedicated support and continuous improvement.`;
        }
      }
      if (selectedSectionIds.includes('total-investment-from-client')) {
        console.log('✅ Generating total-investment-from-client');
        try {
          sectionsToGenerate['total-investment-from-client'] = await generateTotalInvestment(formData);
        } catch (error) {
          console.log('⚠️ Failed to generate total-investment-from-client, using fallback');
          sectionsToGenerate['total-investment-from-client'] = `Total investment includes one-time development cost plus 12 months of operational costs and retainer fees, totaling approximately $50K-100K for the first year.`;
        }
      }
      if (selectedSectionIds.includes('implementation-timeline')) {
        console.log('✅ Generating implementation-timeline');
        try {
          sectionsToGenerate['implementation-timeline'] = normalizeImplementationTimeline(
            await generateImplementationTimeline(formData)
          );
        } catch (error) {
          console.log('⚠️ Failed to generate implementation-timeline, using fallback');
          sectionsToGenerate['implementation-timeline'] = `| Phase | Duration | Activities |
|-------|----------|-----------|
| Requirements Gathering | 2-3 weeks | Finalize requirements |
| Development | 6-8 weeks | Build application |
| Testing and QA | 2-3 weeks | Comprehensive testing |
| Deployment and Go-Live | 1-2 weeks | Production setup |
| Training & Handover | 1 week | Documentation and knowledge transfer |
| Total | 12-16 weeks | Complete project delivery |`;
        }
      }
      if (selectedSectionIds.includes('process-flow-diagram')) {
        console.log('✅ Generating process-flow-diagram');
        try {
          sectionsToGenerate['process-flow-diagram'] = await generateProcessFlowDiagram(formData);
        } catch (error) {
          console.log('⚠️ Failed to generate process-flow-diagram, using fallback');
          sectionsToGenerate['process-flow-diagram'] = `The process flow includes user authentication, data input, processing, validation, storage, and output generation. The system follows a structured workflow ensuring data integrity and user experience.`;
        }
      }
      if (selectedSectionIds.includes('technical-architecture')) {
        console.log('✅ Generating technical-architecture');
        try {
          sectionsToGenerate['technical-architecture'] = await generateTechnicalArchitecture(formData);
        } catch (error) {
          console.log('⚠️ Failed to generate technical-architecture, using fallback');
          sectionsToGenerate['technical-architecture'] = `The technical architecture includes frontend (React/Next.js), backend (Node.js/Express), database (PostgreSQL), cloud hosting (AWS/Vercel), and third-party integrations for a scalable and secure solution.`;
        }
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
          content: sectionId === 'implementation-timeline' ? normalizeImplementationTimeline(content) : content,
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
      console.log('🔍 Full error details:', claudeError);
      
      // Fallback to mock data when Claude API fails - all 16 sections
      const mockData = {
        id: `proposal_${Date.now()}`,
        requirements: formData,
        sections: {
          'executive-summary': {
            id: 'executive-summary',
            title: 'Executive Summary',
            content: `Our ${formData.projectTitle || 'project'} is designed to help your business streamline operations and improve efficiency. Our platform combines modern technology with user-friendly design, helping your business to achieve better results while reducing operational costs.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'project-overview': {
            id: 'project-overview',
            title: 'Project Overview',
            content: `* ${formData.companyName || 'our company'} will deliver ${formData.projectTitle || 'project'} to address ${formData.clientCompany || 'the client company' || formData.clientName || 'the client'}'s business needs.\n* The solution combines modern web technologies with responsive design and backend integration.\n* Key features: user management, data processing, and analytics with real-time updates.\n* The platform improves operational efficiency by automating processes, reducing manual work, and providing business insights.\n* Success will be defined by delivering a fully functional solution and gaining measurable business value through improved user experience.`,
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
            content: `Our ${formData.projectTitle || 'project'} is designed to streamline your business operations while improving user experience. The platform provides comprehensive functionality to help your business achieve better results and operational efficiency.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'key-features': {
            id: 'key-features',
            title: 'Key Features',
            content: `**1. Core Functionality**
● Essential business operations
● User management and authentication
● Data processing and storage

**2. User Experience**
● Intuitive interface design
● Mobile-responsive layout
● Accessibility compliance

**3. Integration Capabilities**
● Third-party API connections
● Database synchronization
● Real-time data updates

**4. Security & Compliance**
● Data encryption and protection
● User access controls
● Audit trail functionality

**5. Performance & Scalability**
● High-speed processing
● Cloud-based infrastructure
● Scalable architecture

**6. Analytics & Reporting**
● Business intelligence dashboards
● Custom reporting tools
● Performance metrics tracking`,
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
          },
          'benefits-and-roi': {
            id: 'benefits-and-roi',
            title: 'Benefits & ROI',
            content: `The implementation of ${formData.projectTitle || 'project'} will deliver significant benefits including improved operational efficiency, reduced manual work, enhanced user experience, and measurable cost savings. Expected ROI of 200-300% within the first year.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'next-steps': {
            id: 'next-steps',
            title: 'Next Steps',
            content: `1. Project kickoff meeting\n2. Requirements finalization\n3. Design and development phase\n4. Testing and quality assurance\n5. Deployment and go-live\n6. Training and support`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'one-time-development-cost': {
            id: 'one-time-development-cost',
            title: 'One Time Development Cost',
            content: `Includes:
• Full front end and back end development
• Email parsing, matching algorithm
• System testing
• Production migration and DevOps

| Component | Description | Estimate |
|-----------|-------------|----------|
| Front End Development | End-to-end website design and development | $ 500 |
| Email Parsing | CSV and email parsing, data validation | $ 1000 |
| Matching Algorithm | Core matching algorithms, confidence scoring | $ 1000 |
| DevOps | GitHub workflows and code migration | $ 100 |
| QA/Testing | Validate application flows and admin functionalities | $ 100 |
| Development Cost |  | $ 2700 |`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'additional-features-recommended': {
            id: 'additional-features-recommended',
            title: 'Additional Features Recommended',
            content: `Recommended additional features include advanced analytics dashboard, mobile app development, API integrations, and automated reporting capabilities to enhance the overall solution value.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'operational-costs-monthly': {
            id: 'operational-costs-monthly',
            title: 'Operational Costs (Monthly)',
            content: `Monthly operational costs include hosting, maintenance, monitoring, and support services estimated at $500-1000 per month depending on usage and scale.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'monthly-retainer-fee': {
            id: 'monthly-retainer-fee',
            title: 'Monthly Retainer Fee',
            content: `Monthly retainer fee for ongoing support, maintenance, and feature updates is $2000-4000 per month, providing dedicated support and continuous improvement.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'total-investment-from-client': {
            id: 'total-investment-from-client',
            title: 'Total Investment from Client',
            content: `Total investment includes one-time development cost plus 12 months of operational costs and retainer fees, totaling approximately $50K-100K for the first year.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'implementation-timeline': {
            id: 'implementation-timeline',
            title: 'Implementation Timeline',
            content: `| Phase | Duration | Activities |
|-------|----------|-----------|
| Requirements Gathering | 2-3 weeks | Finalize requirements |
| Development | 6-8 weeks | Build application |
| Testing and QA | 2-3 weeks | Comprehensive testing |
| Deployment and Go-Live | 1-2 weeks | Production setup |
| Training & Handover | 1 week | Documentation and knowledge transfer |
| Total | 12-16 weeks | Complete project delivery |`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'process-flow-diagram': {
            id: 'process-flow-diagram',
            title: 'Process Flow Diagram',
            content: `The process flow includes user authentication, data input, processing, validation, storage, and output generation. The system follows a structured workflow ensuring data integrity and user experience.`,
            status: 'Complete',
            approved: false,
            generatedAt: new Date().toISOString(),
            version: 1
          },
          'technical-architecture': {
            id: 'technical-architecture',
            title: 'Technical Architecture',
            content: `The technical architecture includes frontend (React/Next.js), backend (Node.js/Express), database (PostgreSQL), cloud hosting (AWS/Vercel), and third-party integrations for a scalable and secure solution.`,
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

// Normalize Implementation Timeline markdown so Activities column is a single line
function normalizeImplementationTimeline(md) {
  try {
    if (!md || typeof md !== 'string') return md;
    const lines = md.split('\n');
    const out = [];
    let inTable = false;
    let currentRow = null; // {cells: string[]}

    const pushRow = () => {
      if (!currentRow) return;
      if (currentRow.cells.length >= 3) {
        // Aggressively collapse Activities column to single line
        currentRow.cells[2] = String(currentRow.cells[2] || '')
          .replace(/<br\s*\/?>(\s*)/gi, ' ')
          .replace(/\*\*/g, '')
          .replace(/\n+/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/\.\s+/g, '. ')
          .replace(/;\s+/g, '; ')
          .replace(/,\s+/g, ', ')
          .trim();
      }
      out.push('|' + currentRow.cells.map(c => ' ' + String(c).trim() + ' ').join('|') + '|');
      currentRow = null;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // detect table header and separator
      if (!inTable && /^\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\|[-:\s|]+\|\s*$/.test(lines[i + 1])) {
        inTable = true;
        out.push(line);
        out.push(lines[i + 1]);
        i++;
        continue;
      }

      if (inTable) {
        if (/^\|.*\|\s*$/.test(line)) {
          // new row begins
          pushRow();
          const cells = line.split('|').slice(1, -1);
          currentRow = { cells };
          continue;
        }
        // continuation line inside table → append to Activities (3rd col)
        if (currentRow) {
          if (currentRow.cells.length >= 3) {
            const add = line.trim();
            if (add) currentRow.cells[2] = (currentRow.cells[2] || '') + ' ' + add;
          }
          continue;
        }
      }

      // close row if we leave table
      if (currentRow) pushRow();
      if (inTable && line.trim() === '') {
        inTable = false;
      }
      out.push(line);
    }

    if (currentRow) pushRow();
    return out.join('\n');
  } catch {
    return md;
  }
}
