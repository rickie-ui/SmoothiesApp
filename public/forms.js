//signup
const signupForm = document.querySelector('#signupForm');
const usernameError = document.querySelector('.username.error');
const emailError = document.querySelector('.email.error');
const passwordError = document.querySelector('.password.error');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    //reset errors
    usernameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    // get values
    const username = signupForm.username.value;
    const email = signupForm.email.value;
    const password = signupForm.password.value;

    try {
      const res = await fetch('/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.errors) {
        usernameError.textContent = data.errors.username;
        emailError.textContent = data.errors.email;
        passwordError.textContent = data.errors.password;
      }
      if (data.user) {
        location.assign('/');
      }
    } catch (err) {
      console.log(err);
    }
  });
}

//login
const loginForm = document.querySelector('#loginForm');
const emailErr = document.querySelector('.email.error');
const passwordErr = document.querySelector('.password.error');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    //reset errors
    emailErr.textContent = '';
    passwordErr.textContent = '';

    // get values
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
      const res = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.errors) {
        emailErr.textContent = data.errors.email;
        passwordErr.textContent = data.errors.password;
      }
      if (data.user) {
        location.assign('/');
      }
    } catch (err) {
      console.log(err);
    }
  });
}
