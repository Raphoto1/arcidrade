# Runbook Template

## Runbook Name
- Related extended guide: [GUIDE_NAME.md](../GUIDE_NAME.md)

## Objective
One sentence goal.

## Scope
- Environment: dev | preview | deploy
- Components: API | DB | email | frontend

## Preconditions
1. Confirm target environment.
2. Confirm access and required permissions.
3. Confirm secrets are not exposed in chat/logs.

## Fast Steps
1. Step one.
2. Step two.
3. Step three.

## Commands
```bash
# Add only safe commands here
```

## Validation
- Expected result 1.
- Expected result 2.

## Rollback or Exit Criteria
- What to revert.
- When to stop and escalate.

## Escalation
- Next runbook to use.
- What evidence to include (logs, timestamp, endpoint, error code).
