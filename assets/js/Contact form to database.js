function submitForm(event) { 
  event.preventDefault(); 
  const form = event.target; 
  const status = document.getElementById('status'); 
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnIcon = document.getElementById('btnIcon');

  const firstName = document.getElementById('inputFirstName').value; 
  const lastName = document.getElementById('inputLastName').value; 
  const email = document.getElementById('inputEmail').value; 
  const message = document.getElementById('message').value; 

  if (!firstName || !lastName || !email || !message) { 
    status.style.display = 'block';
    status.innerHTML = '⚠️ Please fill in all fields.'; 
    status.style.color = '#ff5050'; 
    status.style.background = 'rgba(255,80,80,0.1)';
    status.style.padding = '10px';
    status.style.borderRadius = '8px';
    return; 
  } 

  // ========== PROFESSIONAL SECURITY FILTERS ==========
  
  // 1. Email Restriction (@gmail.com only)
  if (!email.toLowerCase().endsWith('@gmail.com')) {
    status.style.display = 'block';
    status.innerHTML = '🛡️ Security Policy: Only @gmail.com addresses are allowed.'; 
    status.style.color = '#ff5050'; 
    status.style.background = 'rgba(255,80,80,0.1)';
    status.style.padding = '10px';
    status.style.borderRadius = '8px';
    return;
  }

  // 2. Content Filter (Profanity & Suspicious Keywords)
  const forbiddenWords = ['sex', 'porn', 'fuck', 'shit', 'casino', 'bet', 'free money', 'winner', 'يا خول', 'شرموط', 'كسمك', 'سكس', 'نيك', 'قحبة'];
  const lowercaseMsg = message.toLowerCase();
  const foundWord = forbiddenWords.find(word => lowercaseMsg.includes(word));

  if (foundWord) {
    status.style.display = 'block';
    status.innerHTML = '🛡️ Content Filter: Your message contains prohibited or suspicious content.'; 
    status.style.color = '#ff5050'; 
    status.style.background = 'rgba(255,80,80,0.15)';
    status.style.padding = '12px';
    status.style.borderRadius = '8px';
    return;
  }

  // ========== ANTI-BOT CYBER SHIELD ==========
  const honeypot = document.getElementById('_honeypot')?.value;
  const loadTime = document.getElementById('formLoadTime')?.value;
  const timeElapsed = Date.now() - (loadTime ? parseInt(loadTime) : Date.now());

  // If honeypot filled (bots see hidden fields) or form submitted faster than 3 seconds
  if (honeypot || timeElapsed < 3000) {
    status.style.display = 'block';
    status.innerHTML = '🛡️ Cyber Shield Active: Bot Detected. Access Denied.'; 
    status.style.color = '#ff5050'; 
    status.style.background = 'rgba(255,80,80,0.15)';
    status.style.padding = '12px';
    status.style.borderRadius = '8px';
    status.style.border = '1px solid #ff5050';
    
    // Disable form to lock the bot out
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Blocked';
      submitBtn.style.background = 'transparent';
      submitBtn.style.border = '1px solid #ff5050';
      submitBtn.style.color = '#ff5050';
      submitBtn.style.cursor = 'not-allowed';
    }
    return; // Stop submission entirely
  }

  // Loading state
  status.style.display = 'block';
  status.innerHTML = '⏳ Sending your message securely...'; 
  status.style.color = 'var(--primary)'; 
  status.style.background = 'rgba(0,212,255,0.1)';
  status.style.padding = '10px';
  status.style.borderRadius = '8px';
  status.style.border = 'none';
  
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'not-allowed';
  }
  if (btnText) btnText.innerText = 'Sending...';
  if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin';

  const formData = new FormData(form); 

  fetch(form.action, { 
    method: 'POST', 
    mode: 'no-cors',
    body: formData
  }) 
  .then(() => {
    // Professional Success Animation Overlay
    status.style.display = 'none';
    form.reset();
    
    const overlay = document.createElement('div');
    overlay.className = 'form-success-overlay';
    overlay.innerHTML = `
      <div class="form-success-card">
        <div class="form-success-checkmark">
          <i class="fas fa-check"></i>
        </div>
        <h3 class="form-success-title">Message Sent!</h3>
        <p class="form-success-message">Thank you for reaching out. We'll get back to you within 24 hours. Stay tuned!</p>
        <button class="form-success-close" onclick="this.closest('.form-success-overlay').remove()">Got it</button>
      </div>
    `;
    document.body.appendChild(overlay);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.4s ease';
        setTimeout(() => overlay.remove(), 400);
      }
    }, 6000);
  })
  .catch(error => {
    console.error('Error:', error);
    status.innerHTML = '✗ Oops! There was a problem sending the message. Please try via WhatsApp.'; 
    status.style.color = '#ff5050'; 
    status.style.background = 'rgba(255,80,80,0.1)';
  })
  .finally(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
    }
    if (btnText) btnText.innerText = 'Send Message';
    if (btnIcon) btnIcon.className = 'fas fa-paper-plane';
  });
}
