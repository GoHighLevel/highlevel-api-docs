const fs = require('fs').promises;
const path = require('path');
const googleSheetsService = require('./google-sheets-service.js');

const ISSUE_TEMPLATE_DIR = path.join(__dirname, 'ISSUE_TEMPLATE');

/**
 * Update product area options in a YAML issue template
 * @param {string} filePath - Path to the template file
 * @param {string[]} productAreas - Array of product areas
 */
async function updateProductAreasInTemplate(filePath, productAreas) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    // Find the product-area dropdown section
    const lines = content.split('\n');
    let updatedLines = [];
    let inProductAreaSection = false;
    let inOptionsSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if we're entering the product-area dropdown
      if (line.includes('id: product-area')) {
        inProductAreaSection = true;
      }
      
      // Check if we're in the options section
      if (inProductAreaSection && line.includes('options:')) {
        inOptionsSection = true;
        updatedLines.push(line);
        
        // Add all product areas
        productAreas.forEach(area => {
          updatedLines.push(`        - ${area}`);
        });
        
        // Skip existing options until we find the next section
        i++;
        while (i < lines.length && lines[i].startsWith('        -')) {
          i++;
        }
        i--; // Back up one line since the for loop will increment
        
        inOptionsSection = false;
        inProductAreaSection = false;
        continue;
      }
      
      // Add the line if we're not in the options section
      if (!inOptionsSection) {
        updatedLines.push(line);
      }
    }
    
    await fs.writeFile(filePath, updatedLines.join('\n'));
    console.log(`Updated product areas in ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

/**
 * Update all issue templates with current product areas
 */
async function updateAllIssueTemplates() {
  try {
    console.log('Fetching product areas from Google Sheets...');
    const productAreas = await googleSheetsService.getAllProductAreas();
    console.log(`Found ${productAreas.length} product areas`);
    
    // Get all YAML template files
    const files = await fs.readdir(ISSUE_TEMPLATE_DIR);
    const yamlFiles = files.filter(file => file.endsWith('.yaml') && file !== 'config.yaml');
    
    console.log(`Updating ${yamlFiles.length} issue templates...`);
    
    // Update each template
    for (const file of yamlFiles) {
      const filePath = path.join(ISSUE_TEMPLATE_DIR, file);
      await updateProductAreasInTemplate(filePath, productAreas);
    }
    
    console.log('All issue templates updated successfully!');
    
    // Also update the highlevel-teams.json file for consistency
    await updateHighlevelTeamsJson(productAreas);
    
  } catch (error) {
    console.error('Error updating issue templates:', error);
    process.exit(1);
  }
}

/**
 * Update the highlevel-teams.json file with current product areas
 * @param {string[]} productAreas - Array of product areas
 */
async function updateHighlevelTeamsJson(productAreas) {
  try {
    const teamsData = [];
    
    // For each product area, try to get team info
    for (const area of productAreas) {
      try {
        const productInfo = await googleSheetsService.getProductInfo(area);
        if (productInfo && productInfo.team) {
          teamsData.push({
            team: productInfo.team.toLowerCase(),
            sub_team: area
          });
        } else {
          // Use fallback team assignment based on existing patterns
          teamsData.push({
            team: "crm", // Default team
            sub_team: area
          });
        }
      } catch (error) {
        console.error(`Error getting team info for ${area}:`, error);
        // Add with default team
        teamsData.push({
          team: "crm",
          sub_team: area
        });
      }
    }
    
    const filePath = path.join(__dirname, 'highlevel-teams.json');
    await fs.writeFile(filePath, JSON.stringify(teamsData, null, 2));
    console.log('Updated highlevel-teams.json');
    
  } catch (error) {
    console.error('Error updating highlevel-teams.json:', error);
  }
}

// Run if called directly
if (require.main === module) {
  updateAllIssueTemplates();
}

module.exports = {
  updateAllIssueTemplates,
  updateProductAreasInTemplate
};