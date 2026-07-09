// Single, repeatable verification entrypoint for the migration goal.
// Runs the project's standard quality gates via Node's child_process so the
// whole check is one invocation. Exit code 0 = all green, 1 = failure.
import { execSync } from 'node:child_process';

const steps = [
  { name: 'typecheck', cmd: 'pnpm typecheck' },
  { name: 'build', cmd: 'pnpm build' },
];

let ok = true;
for (const step of steps) {
  console.log(`\n▶ ${step.name}  (${step.cmd})`);
  try {
    execSync(step.cmd, { stdio: 'inherit' });
    console.log(`✓ ${step.name} passed`);
  } catch {
    console.error(`✗ ${step.name} failed`);
    ok = false;
    break;
  }
}

console.log(ok ? '\nAll verification steps passed.' : '\nVerification failed.');
process.exit(ok ? 0 : 1);
