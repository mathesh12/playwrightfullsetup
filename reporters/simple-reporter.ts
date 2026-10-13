import type {
  FullResult,
  Reporter,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

class SimpleReporter implements Reporter {
  private total = 0;
  private passed = 0;
  private failed = 0;
  private skipped = 0;

  onTestBegin(test: TestCase): void {
    console.log(`[START] ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.total += 1;
    console.log(`[${result.status.toUpperCase()}] ${test.title} (${result.duration} ms)`);

    if (result.status === 'passed') {
      this.passed += 1;
    } else if (result.status === 'skipped') {
      this.skipped += 1;
    } else {
      this.failed += 1;
    }
  }

  onEnd(result: FullResult): void {
    if (this.total === 0) {
      console.log(`[SUMMARY] No tests executed. Run status: ${result.status}.`);
      return;
    }

    console.log(
      `[SUMMARY] ${this.passed} passed, ${this.failed} failed, ` +
        `${this.skipped} skipped. Run status: ${result.status}.`,
    );
  }
}

export default SimpleReporter;
