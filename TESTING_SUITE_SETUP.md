# 🧪 Vita Health App - Comprehensive Testing Suite

## 📋 **Testing Strategy Overview**

### **Testing Pyramid**
```
    🔺 E2E Tests (Few)
   🔺🔺 Integration Tests (Some)  
  🔺🔺🔺 Unit Tests (Many)
```

### **Testing Tools Stack**
- **Unit Testing**: Vitest + React Testing Library
- **Integration Testing**: Vitest + Firebase Emulator
- **E2E Testing**: Playwright
- **Performance Testing**: Lighthouse CI
- **Security Testing**: OWASP ZAP

---

## **🔧 Setup Instructions**

### **1. Install Testing Dependencies**
```bash
# Core testing framework
npm install -D vitest @vitest/ui

# React testing utilities
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# E2E testing
npm install -D @playwright/test

# Firebase testing
npm install -D @firebase/rules-unit-testing

# Performance testing
npm install -D @lhci/cli

# Mocking utilities
npm install -D msw
```

### **2. Configure Vitest**
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
      ],
    },
  },
})
```

### **3. Test Setup File**
```javascript
// src/test/setup.js
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Firebase
vi.mock('../lib/supabase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
  },
  db: {},
  analytics: {},
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

---

## **🧪 Unit Testing**

### **1. Component Tests**
```javascript
// src/test/components/Login.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Login from '../../components/Auth/Login'

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login onToggleForm={vi.fn()} />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  test('validates email format', async () => {
    render(<Login onToggleForm={vi.fn()} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  test('submits form with valid data', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ success: true })
    
    render(<Login onToggleForm={vi.fn()} />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })
})
```

### **2. Service Tests**
```javascript
// src/test/services/HealthDataService.test.js
import { describe, test, expect, vi, beforeEach } from 'vitest'
import HealthDataService from '../../services/HealthDataService'

describe('HealthDataService', () => {
  let service
  const mockUserId = 'test-user-123'

  beforeEach(() => {
    service = new HealthDataService(mockUserId)
  })

  test('calculates vitality data correctly', () => {
    const healthData = {
      sleep: { duration: 480, quality: 8 },
      activity: { steps: 8000, activeMinutes: 30 },
      mood: 7
    }

    const result = service.getVitalityData(healthData)

    expect(result).toHaveProperty('sleep')
    expect(result).toHaveProperty('activity')
    expect(result.sleep.duration).toBe(480)
    expect(result.activity.steps).toBe(8000)
  })

  test('handles missing data gracefully', () => {
    const result = service.getDefaultVitalityData()

    expect(result.sleep.duration).toBe(0)
    expect(result.activity.steps).toBe(0)
    expect(result.mood).toBe(0)
  })
})
```

### **3. Utility Tests**
```javascript
// src/test/utils/validation.test.js
import { describe, test, expect } from 'vitest'
import { validateEmail, validatePassword } from '../../utils/validation'

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    test('accepts valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true)
    })

    test('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    test('accepts strong passwords', () => {
      expect(validatePassword('StrongPass123!')).toBe(true)
      expect(validatePassword('MySecure2024')).toBe(true)
    })

    test('rejects weak passwords', () => {
      expect(validatePassword('weak')).toBe(false)
      expect(validatePassword('12345678')).toBe(false)
      expect(validatePassword('password')).toBe(false)
    })
  })
})
```

---

## **🔗 Integration Testing**

### **1. Firebase Integration Tests**
```javascript
// src/test/integration/firebase.test.js
import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing'

describe('Firebase Integration', () => {
  let testEnv

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'vita-test',
      firestore: {
        rules: `
          rules_version = '2';
          service cloud.firestore {
            match /databases/{database}/documents {
              match /profiles/{userId} {
                allow read, write: if request.auth != null && request.auth.uid == userId;
              }
            }
          }
        `
      }
    })
  })

  afterAll(async () => {
    await testEnv.cleanup()
  })

  test('authenticated user can read own profile', async () => {
    const alice = testEnv.authenticatedContext('alice')
    const profileDoc = alice.firestore().doc('profiles/alice')
    
    await expect(profileDoc.get()).resolves.not.toThrow()
  })

  test('user cannot read other user profiles', async () => {
    const alice = testEnv.authenticatedContext('alice')
    const bobProfile = alice.firestore().doc('profiles/bob')
    
    await expect(bobProfile.get()).rejects.toThrow()
  })
})
```

### **2. API Integration Tests**
```javascript
// src/test/integration/healthData.test.js
import { describe, test, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import HealthDataForm from '../../components/ManualEntry/HealthDataForm'
import { AuthProvider } from '../../context/FirebaseAuthContext'

describe('Health Data Integration', () => {
  test('saves health data to Firebase', async () => {
    const mockUser = { uid: 'test-user', email: 'test@example.com' }
    
    render(
      <AuthProvider value={{ user: mockUser }}>
        <HealthDataForm />
      </AuthProvider>
    )

    // Fill out form
    fireEvent.change(screen.getByLabelText(/sleep duration/i), {
      target: { value: '8' }
    })
    fireEvent.change(screen.getByLabelText(/mood/i), {
      target: { value: '7' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/data saved successfully/i)).toBeInTheDocument()
    })
  })
})
```

---

## **🎭 End-to-End Testing**

### **1. Playwright Configuration**
```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run preview',
    port: 4173,
  },
})
```

### **2. E2E Test Examples**
```javascript
// e2e/auth.spec.js
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('user can sign up and log in', async ({ page }) => {
    await page.goto('/')
    
    // Should redirect to auth page
    await expect(page).toHaveURL(/.*auth/)
    
    // Sign up
    await page.click('text=Create Account')
    await page.fill('[data-testid=firstName]', 'Test')
    await page.fill('[data-testid=lastName]', 'User')
    await page.fill('[data-testid=email]', 'test@example.com')
    await page.fill('[data-testid=password]', 'TestPassword123!')
    await page.fill('[data-testid=confirmPassword]', 'TestPassword123!')
    await page.click('[data-testid=signUpButton]')
    
    // Should show success message
    await expect(page.locator('text=Account created successfully')).toBeVisible()
  })

  test('user can log health data', async ({ page }) => {
    // Login first
    await page.goto('/auth')
    await page.fill('[data-testid=email]', 'test@example.com')
    await page.fill('[data-testid=password]', 'TestPassword123!')
    await page.click('[data-testid=signInButton]')
    
    // Navigate to data entry
    await page.click('[data-testid=logDataTab]')
    
    // Fill health data
    await page.selectOption('[data-testid=sleepDuration]', '8')
    await page.selectOption('[data-testid=mood]', '7')
    await page.fill('[data-testid=steps]', '8000')
    
    // Submit
    await page.click('[data-testid=saveButton]')
    
    // Verify success
    await expect(page.locator('text=Data saved successfully')).toBeVisible()
  })
})
```

---

## **📊 Performance Testing**

### **1. Lighthouse CI Configuration**
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4173/'],
      startServerCommand: 'npm run preview',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

### **2. Performance Test Scripts**
```javascript
// src/test/performance/vitality-orb.test.js
import { test, expect } from '@playwright/test'

test('Vitality Orb performance', async ({ page }) => {
  await page.goto('/')
  
  // Measure animation performance
  const animationStart = Date.now()
  await page.click('[data-testid=vitalityOrbToggle]')
  await page.waitForSelector('[data-testid=vitalityOrb]')
  const animationEnd = Date.now()
  
  expect(animationEnd - animationStart).toBeLessThan(1000) // Under 1 second
  
  // Check for smooth animations (60fps)
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      let frameCount = 0
      const startTime = performance.now()
      
      function countFrames() {
        frameCount++
        if (performance.now() - startTime < 1000) {
          requestAnimationFrame(countFrames)
        } else {
          resolve(frameCount)
        }
      }
      requestAnimationFrame(countFrames)
    })
  })
  
  expect(metrics).toBeGreaterThan(55) // Close to 60fps
})
```

---

## **🔒 Security Testing**

### **1. Security Test Suite**
```javascript
// src/test/security/auth.test.js
import { test, expect } from '@playwright/test'

test.describe('Security Tests', () => {
  test('prevents XSS attacks', async ({ page }) => {
    await page.goto('/auth')
    
    // Try to inject script
    const maliciousInput = '<script>alert("XSS")</script>'
    await page.fill('[data-testid=email]', maliciousInput)
    
    // Should not execute script
    page.on('dialog', () => {
      throw new Error('XSS vulnerability detected')
    })
    
    await page.click('[data-testid=signInButton]')
    // Should show validation error, not execute script
  })

  test('enforces authentication', async ({ page }) => {
    // Try to access protected route
    await page.goto('/dashboard')
    
    // Should redirect to auth
    await expect(page).toHaveURL(/.*auth/)
  })
})
```

---

## **📋 Test Scripts**

### **Package.json Scripts**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:integration": "vitest --config vitest.integration.config.js",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:performance": "lhci autorun",
    "test:all": "npm run test && npm run test:e2e && npm run test:performance"
  }
}
```

---

## **🎯 Testing Checklist**

### **Unit Tests** (Target: 80%+ coverage)
- [ ] All components render correctly
- [ ] Form validation works
- [ ] Service functions work correctly
- [ ] Utility functions handle edge cases
- [ ] Error boundaries catch errors

### **Integration Tests**
- [ ] Firebase authentication works
- [ ] Data persistence works
- [ ] API integrations work
- [ ] Context providers work
- [ ] Service worker functions

### **E2E Tests**
- [ ] Complete user journeys work
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness
- [ ] Performance benchmarks met
- [ ] Accessibility standards met

### **Security Tests**
- [ ] XSS prevention works
- [ ] Authentication enforced
- [ ] Data isolation verified
- [ ] Input sanitization works
- [ ] HTTPS enforced

---

**🧪 Testing Status: COMPREHENSIVE SUITE READY**

**Next Steps:**
1. Run full test suite: `npm run test:all`
2. Fix any failing tests
3. Achieve target coverage (80%+)
4. Set up CI/CD pipeline with automated testing
