import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');

const mode = process.argv[2];

if (mode !== 'test' && mode !== 'live') {
  console.error('❌ Invalid mode! Use "test" or "live".');
  process.exit(1);
}

try {
  let content = fs.readFileSync(envPath, 'utf8');
  
  // Helper to parse key-value
  const getVar = (key) => {
    const regex = new RegExp(`^${key}=(.*)$`, 'm');
    const match = content.match(regex);
    return match ? match[1].trim() : null;
  };

  // Parse existing values
  const activeToken = getVar('SQUARE_ACCESS_TOKEN') || '';
  const activeLoc = getVar('SQUARE_LOCATION_ID') || '';
  const activeApp = getVar('SQUARE_APPLICATION_ID') || '';

  let liveToken = getVar('SQUARE_LIVE_ACCESS_TOKEN');
  let liveLoc = getVar('SQUARE_LIVE_LOCATION_ID');
  let liveApp = getVar('SQUARE_LIVE_APPLICATION_ID');

  let sandboxToken = getVar('SQUARE_SANDBOX_ACCESS_TOKEN');
  let sandboxLoc = getVar('SQUARE_SANDBOX_LOCATION_ID');
  let sandboxApp = getVar('SQUARE_SANDBOX_APPLICATION_ID');

  let modified = false;

  // Self-initialize live variables if not present (copy active variables)
  if (!liveToken && activeToken && !activeToken.startsWith('sandbox-')) {
    content += `\nSQUARE_LIVE_ACCESS_TOKEN=${activeToken}`;
    liveToken = activeToken;
    modified = true;
  }
  if (!liveLoc && activeLoc && !activeLoc.startsWith('sandbox-')) {
    content += `\nSQUARE_LIVE_LOCATION_ID=${activeLoc}`;
    liveLoc = activeLoc;
    modified = true;
  }
  if (!liveApp && activeApp && !activeApp.startsWith('sandbox-')) {
    content += `\nSQUARE_LIVE_APPLICATION_ID=${activeApp}`;
    liveApp = activeApp;
    modified = true;
  }

  // Self-initialize sandbox variables if not present
  if (!sandboxToken) {
    content += `\nSQUARE_SANDBOX_ACCESS_TOKEN=sandbox-EAAAl_your_sandbox_access_token`;
    sandboxToken = 'sandbox-EAAAl_your_sandbox_access_token';
    modified = true;
  }
  if (!sandboxLoc) {
    content += `\nSQUARE_SANDBOX_LOCATION_ID=sandbox-your_location_id`;
    sandboxLoc = 'sandbox-your_location_id';
    modified = true;
  }
  if (!sandboxApp) {
    content += `\nSQUARE_SANDBOX_APPLICATION_ID=sandbox-sq0idp-your_application_id`;
    sandboxApp = 'sandbox-sq0idp-your_application_id';
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(envPath, content, 'utf8');
  }

  // Now reload content to update active variables
  content = fs.readFileSync(envPath, 'utf8');

  const targetEnv = mode === 'test' ? 'sandbox' : 'production';
  const targetToken = mode === 'test' ? sandboxToken : (liveToken || activeToken);
  const targetLoc = mode === 'test' ? sandboxLoc : (liveLoc || activeLoc);
  const targetApp = mode === 'test' ? sandboxApp : (liveApp || activeApp);

  // Helper to replace or add a variable
  const setVar = (key, value) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (content.match(regex)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += `\n${key}=${value}`;
    }
  };

  setVar('SQUARE_ENVIRONMENT', targetEnv);
  setVar('SQUARE_ACCESS_TOKEN', targetToken);
  setVar('SQUARE_LOCATION_ID', targetLoc);
  setVar('SQUARE_APPLICATION_ID', targetApp);

  fs.writeFileSync(envPath, content, 'utf8');
  console.log(`\n\n==================================================`);
  console.log(`✅ Square Payments Switched to ${mode.toUpperCase()} Mode!`);
  console.log(`📍 Environment: ${targetEnv}`);
  console.log(`🔑 Token: ${targetToken.substring(0, 15)}...`);
  console.log(`🆔 Location ID: ${targetLoc}`);
  console.log(`==================================================\n\n`);

} catch (error) {
  console.error('❌ Error updating payment mode:', error.message);
  process.exit(1);
}
