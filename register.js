// ===== Register page: validation logic =====
(function () {
  const form = document.getElementById('registerForm');
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const rulesList = document.getElementById('passRules');

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    length: (v) => v.length >= 8,
    lower: (v) => /[a-z]/.test(v),
    upper: (v) => /[A-Z]/.test(v),
    special: (v) => /[^A-Za-z0-9]/.test(v),
  };

  // ---- Rule checklist (live update while typing) ----
  function updateRules(value) {
    rulesList.querySelectorAll('li').forEach((li) => {
      const key = li.dataset.rule;
      const ok = rules[key](value);
      li.classList.toggle('ok', ok);
      li.querySelector('.rule-icon').textContent = ok ? '✓' : '○';
    });
  }

  // ---- Field-level helpers ----
  function setError(input, errorId, message) {
    const el = document.getElementById(errorId);
    el.textContent = message || '';
    input.classList.toggle('invalid', !!message);
    input.classList.toggle('valid', !message && input.value.trim() !== '');
    return !message;
  }

  function validateName() {
    const v = fullName.value.trim();
    if (!v) return setError(fullName, 'nameError', 'Full name is required.');
    if (v.length < 3) return setError(fullName, 'nameError', 'Name must be at least 3 characters.');
    return setError(fullName, 'nameError', '');
  }

  function validateEmail() {
    const v = email.value.trim();
    if (!v) return setError(email, 'emailError', 'Email is required.');
    if (!EMAIL_RE.test(v)) return setError(email, 'emailError', 'Enter a valid email address (e.g. you@company.com).');
    return setError(email, 'emailError', '');
  }

  function validatePassword() {
    const v = password.value;
    if (!v) return setError(password, 'passwordError', 'Password is required.');
    const failed = Object.keys(rules).filter((k) => !rules[k](v));
    if (failed.length) {
      return setError(
        password,
        'passwordError',
        'Password must be at least 8 characters and include uppercase, lowercase, and a special character.'
      );
    }
    return setError(password, 'passwordError', '');
  }

  function validateConfirm() {
    const v = confirmPassword.value;
    if (!v) return setError(confirmPassword, 'confirmError', 'Please confirm your password.');
    if (v !== password.value) return setError(confirmPassword, 'confirmError', 'Passwords do not match.');
    return setError(confirmPassword, 'confirmError', '');
  }

  // ---- Live events ----
  password.addEventListener('input', () => {
    updateRules(password.value);
    if (confirmPassword.value) validateConfirm();
    if (password.classList.contains('invalid') || password.classList.contains('valid')) validatePassword();
  });

  [
    [fullName, validateName, 'blur'],
    [email, validateEmail, 'blur'],
    [password, validatePassword, 'blur'],
    [confirmPassword, validateConfirm, 'blur'],
  ].forEach(([input, fn, evt]) => input.addEventListener(evt, fn));

  [
    [fullName, validateName],
    [email, validateEmail],
    [confirmPassword, validateConfirm],
  ].forEach(([input, fn]) => input.addEventListener('input', () => {
    if (input.classList.contains('invalid')) fn();
  }));

  // ---- Show / hide password ----
  document.querySelectorAll('.toggle-pass').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      const show = target.type === 'password';
      target.type = show ? 'text' : 'password';
      btn.textContent = show ? '🙈' : '👁';
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  // ---- Submit ----
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = [validateName(), validateEmail(), validatePassword(), validateConfirm()];
    if (results.some((ok) => !ok)) {
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    // Demo: no backend yet — show success state.
    form.hidden = true;
    const success = document.getElementById('authSuccess');
    document.getElementById('successName').textContent = fullName.value.trim().split(' ')[0];
    success.hidden = false;
  });
})();
