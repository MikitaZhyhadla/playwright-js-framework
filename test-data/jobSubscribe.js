function generateEmail(prefix = 'test.ikea') {
  const timestamp = Date.now();
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${prefix}.${timestamp}.${suffix}@testmail.dev`;
}

export default {
  homeUrl: 'https://www.ikea.com/',
  category: 'Sales & Commercial',
  location: 'Stockholm',
  emailPrefix: 'test.ikea',
  generateEmail,
};
