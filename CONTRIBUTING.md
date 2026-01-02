# Contributing to Auto-Sage

Thank you for considering contributing to Auto-Sage! This document provides guidelines for development.

## 🚨 Critical Rules (Non-Negotiable)

### Safety Rules

1. **NEVER** bypass safety checks in `lib/safety.ts`
2. **NEVER** remove escalation logic for critical systems
3. **ALWAYS** add safety warnings when introducing new diagnostic features
4. **ALWAYS** err on the side of caution - escalate if uncertain

**Critical Systems (Always Escalate):**

- Brakes
- Airbags / SRS
- Fuel systems
- Steering
- High-voltage EV batteries
- Seat belts

### Privacy Rules

1. **NEVER** add user accounts or authentication
2. **NEVER** store images on the server
3. **NEVER** persist location data
4. **ALWAYS** use device-local storage (IndexedDB)
5. **ALWAYS** inform users about data handling

## 📋 Development Workflow

### 1. Set Up Development Environment

```bash
git clone https://github.com/yourusername/auto-sage.git
cd auto-sage
npm install
cp .env.example .env.local
# Add your API keys to .env.local
npm run dev
```

### 2. Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `safety/*` - Safety enhancements (high priority)

### 3. Commit Message Format

```
type(scope): subject

body

footer
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `safety`: Safety enhancement
- `privacy`: Privacy enhancement
- `docs`: Documentation
- `style`: Code style (no functional changes)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build/tooling

**Example:**

```
feat(diagnostic): Add engine temperature monitoring

- Add temperature range checks
- Escalate to professional if overheating
- Show warning for high temps

Closes #123
```

## 🧪 Testing Requirements

### Before Submitting PR

1. **TypeScript Compilation:**

   ```bash
   npm run build
   ```

2. **Manual Testing:**

   - [ ] Add/edit/delete vehicles
   - [ ] Chat functionality
   - [ ] Mock diagnostics work
   - [ ] Safety blocks trigger correctly
   - [ ] Photo upload (UI only if no API key)
   - [ ] Shop finder (UI only if no API key)
   - [ ] No console errors

3. **Safety Testing:**
   Test these inputs MUST escalate:

   - "brake fluid low"
   - "airbag warning light"
   - "fuel pump issue"
   - "steering wheel vibrates"
   - "EV battery error"

4. **Browser Testing:**
   - [ ] Chrome/Edge
   - [ ] Firefox
   - [ ] Safari (desktop & iOS)
   - [ ] Mobile responsive

## 📝 Code Guidelines

### TypeScript

- Use explicit types (avoid `any`)
- Export interfaces for reusable types
- Use Zod for runtime validation

### React

- Use functional components
- Prefer hooks over classes
- Use `'use client'` directive when needed
- Keep components focused (single responsibility)

### File Organization

```
components/         # Reusable UI components
├── [Component].tsx # PascalCase naming

lib/               # Business logic & utilities
├── [module].ts    # camelCase naming

types/             # TypeScript definitions
├── [domain].ts    # Grouped by domain

src/app/           # Next.js routes
├── api/[route]/   # API endpoints
└── [page]/        # Pages
```

### Styling

- Use Tailwind CSS classes
- Follow existing color scheme (blue primary)
- Ensure mobile responsiveness
- Maintain accessibility (ARIA labels)

## 🔒 Adding New Diagnostic Features

### 1. Update Safety Rules First

Add to `lib/safety.ts` if unsafe:

```typescript
const UNSAFE_TOPICS = [
  // existing...
  "new-unsafe-system",
];
```

### 2. Add to AI Prompt

Update `lib/aiPrompt.ts`:

```typescript
export const systemPrompt = `
...existing rules...

NEW RULE: [Your safety rule]
`;
```

### 3. Add Mock Logic

Update `ChatUI.tsx` `generateMockDiagnostic()`:

```typescript
if (lowerInput.includes("new-topic")) {
  return {
    // diagnostic response
  };
}
```

### 4. Test Thoroughly

- [ ] AI response is JSON
- [ ] Safety checks work
- [ ] Escalation triggers appropriately
- [ ] UI displays correctly

## 🐛 Bug Reports

### Include:

1. **Environment:**

   - OS & Browser
   - Node.js version
   - Next.js version

2. **Steps to Reproduce:**

   - Clear, numbered steps

3. **Expected vs Actual:**

   - What should happen
   - What actually happens

4. **Screenshots/Videos:**

   - If UI-related

5. **Console Errors:**
   - Browser dev tools output

### Template:

```markdown
**Environment:**

- OS: Windows 11
- Browser: Chrome 120
- Node: v20.10.0

**Steps:**

1. Add vehicle
2. Click "Start Diagnosis"
3. Type "battery dead"

**Expected:** Diagnostic card appears
**Actual:** Error in console

**Console Error:**
```

TypeError: Cannot read property 'id' of undefined

```

**Screenshot:** [attach]
```

## 🌟 Feature Requests

### Include:

1. **Use Case:** Why is this needed?
2. **Safety Considerations:** Any safety implications?
3. **Privacy Considerations:** Any privacy concerns?
4. **Proposed Solution:** How should it work?
5. **Alternatives:** What else could work?

### Template:

```markdown
**Feature:** VIN Decoder Integration

**Use Case:**
Users want to auto-fill vehicle info from VIN.

**Safety:**
No safety concerns - informational only.

**Privacy:**
VIN should NOT be sent to external APIs. Use local VIN decoder library.

**Proposed Solution:**

1. Install `vin-decoder` library
2. Add VIN input validation
3. Parse VIN locally
4. Pre-fill make/model/year

**Alternatives:**

- Use external VIN API (but violates privacy)
- Manual entry only (current state)
```

## 📚 Areas for Contribution

### High Priority (Safety/Privacy)

- [ ] Add more unsafe keywords to safety checks
- [ ] Improve escalation logic
- [ ] Enhance privacy warnings
- [ ] Add more vehicle makes/models

### Medium Priority (Features)

- [ ] Maintenance schedule reminders
- [ ] Service history tracking
- [ ] Cost estimate integration
- [ ] Parts lookup
- [ ] Multi-language support

### Low Priority (Polish)

- [ ] Dark mode
- [ ] Better animations
- [ ] More icon options
- [ ] Voice input
- [ ] Accessibility improvements

## 📞 Getting Help

- **Questions:** Open a [Discussion](https://github.com/yourusername/auto-sage/discussions)
- **Bugs:** Open an [Issue](https://github.com/yourusername/auto-sage/issues)
- **Security:** Email security@auto-sage.com (do NOT open public issue)

## ✅ Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] TypeScript compiles (`npm run build`)
- [ ] No console errors in browser
- [ ] Safety checks tested
- [ ] Privacy rules followed
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow format
- [ ] PR description explains changes

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make Auto-Sage safer and better!**
