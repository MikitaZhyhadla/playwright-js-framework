class MailHelper {
  static generateUniqueEmail(prefix = 'test.ikea') {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    return `${prefix}.${timestamp}.${randomSuffix}@testmail.dev`;
  }
}

module.exports = MailHelper;
