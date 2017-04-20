(function saucelabsReportingScope() {
  'use strict';

  function flattenTitles(leafTest) {
    var titles = [];
    var test = leafTest;
    while (test.parent.title) {
      titles.push(test.parent.title);
      test = test.parent;
    }
    return titles.reverse();
  }

  function saucelabsReporting(runner) {
    var failedTests = [];

    runner.on('fail', function logFailure(test, err) {
      failedTests.push({
        name: test.title,
        result: false,
        message: err.message,
        stack: err.stack,
        titles: flattenTitles(test)
      });
    });

    runner.on('end', function reportTestsComplete() {
      window.mochaResults = runner.stats;
      window.mochaResults.reports = failedTests;
    });
  }

  // Exports
  window.saucelabsReporting = saucelabsReporting;
}());
