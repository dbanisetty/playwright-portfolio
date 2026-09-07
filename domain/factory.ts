import type { Logger } from '@test-kit/logger';
import type { PageManager } from '@ui/PageManager';
import { EmployeeOnboardingFlow } from '@domain/EmployeeOnboardingFlow';

/** One getter per business flow. Exposed to specs as the `domain` fixture. */
export class FlowFactory {
  constructor(
    private readonly pages: PageManager,
    private readonly log: Logger,
  ) {}

  employeeOnboarding(): EmployeeOnboardingFlow {
    return new EmployeeOnboardingFlow(this.pages, this.log.child('EmployeeOnboardingFlow'));
  }
}
