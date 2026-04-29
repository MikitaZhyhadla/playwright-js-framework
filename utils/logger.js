class Logger {
  logStep(message) {
    const log = `[STEP] ${message}`;
    console.log(log);
    return log;
  }

  logAction(message) {
    const log = `[ACTION] ${message}`;
    console.log(log);
    return log;
  }

  logAssertion(message) {
    const log = `[ASSERT] ${message}`;
    console.log(log);
    return log;
  }

  error(message) {
    const log = `[ERROR] ${message}`;
    console.error(log);
    return log;
  }
}

module.exports = Logger;
