// Handle login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe')?.checked;
        
        try {
            const { data, error } = await window.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            // Handle successful login
            console.log('Logged in:', data);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            if (rememberMe) {
                // Implement remember me functionality
                localStorage.setItem('rememberMe', 'true');
            }

            // Redirect to dashboard or home page
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Login error:', error);
            alert(error.message);
        }
    });
}

// Handle registration form
const registerForm = document.getElementById('registerForm');
console.log('Registration form found:', registerForm); // Debug log

if (registerForm) {
    console.log('Adding submit event listener to registration form'); // Debug log
    registerForm.addEventListener('submit', async function(e) {
        console.log('Registration form submitted'); // Debug log
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        console.log('Form values:', { fullName, email }); // Debug log (excluding passwords)
        
        // Basic validation
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        try {
            console.log('Attempting to sign up with Supabase...'); // Debug log
            // Sign up the user
            const { data, error } = await window.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName
                    },
                    emailRedirectTo: window.location.origin + '/index.html'
                }
            });

            if (error) {
                console.error('Supabase signup error:', error); // Debug log
                throw error;
            }

            console.log('Registration successful:', data); // Debug log

            // Check if email verification is required
            if (data?.user?.identities?.length === 0) {
                alert('This email is already registered. Please try logging in instead.');
                window.location.href = 'index.html';
                return;
            }

            // Show a more detailed message about email verification
            const message = `
                Registration successful!
                
                1. Please check your email (${email}) for the verification link
                2. Click the verification link in the email
                3. After verification, you can log in with your email and password
                
                Note: If you don't see the email, please check your spam folder.
            `;
            
            alert(message);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Registration error:', error); // Debug log
            alert(error.message);
        }
    });
} else {
    console.log('Registration form not found in the DOM'); // Debug log
}

// Handle forgot password
const forgotPasswordLink = document.getElementById('forgotPassword');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        try {
            const { error } = await window.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/index.html'
            });

            if (error) throw error;

            alert('Password reset instructions have been sent to your email');
        } catch (error) {
            alert(error.message);
        }
    });
}

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data: { session }, error } = await window.supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session && window.location.pathname.includes('index.html')) {
            // If user is already logged in and trying to access login page,
            // redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Session check error:', error);
    }
}); 