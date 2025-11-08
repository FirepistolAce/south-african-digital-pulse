

(function () {
  const STORAGE_KEY_NAME = 'profileName';
  const STORAGE_KEY_BIO = 'profileBio';

  
  document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('displayName');
    const bioInput = document.getElementById('bio');
    const saveBtn = document.querySelector('.submit-btn');

    
    const profileInfo = document.querySelector('.profile-info');
    const profileNameEl = profileInfo.querySelector('h3');
    const memberRoleEl = profileInfo.querySelector('.member-role');
    
    const defaultBioPara = Array.from(profileInfo.querySelectorAll('p'))
      .find(p => !p.classList.contains('member-role'));

    const defaultName = profileNameEl ? profileNameEl.textContent.trim() : '';
    const defaultBio = defaultBioPara ? defaultBioPara.textContent.trim() : '';

    
    let profileBioDisplay = document.getElementById('profile-bio-display');
    if (!profileBioDisplay) {
      profileBioDisplay = document.createElement('p');
      profileBioDisplay.id = 'profile-bio-display';
      profileBioDisplay.className = 'profile-bio';
      profileBioDisplay.setAttribute('aria-live', 'polite'); // announce updates to assistive tech
      
      if (memberRoleEl && memberRoleEl.parentNode) {
        memberRoleEl.insertAdjacentElement('afterend', profileBioDisplay);
      } else {
        
        profileInfo.appendChild(profileBioDisplay);
      }
    }

    
    const savedName = localStorage.getItem(STORAGE_KEY_NAME);
    const savedBio = localStorage.getItem(STORAGE_KEY_BIO);

    
    if (nameInput) nameInput.value = savedName ?? '';
    if (bioInput) bioInput.value = savedBio ?? '';

    profileNameEl.textContent = savedName && savedName.trim().length ? savedName : defaultName;
    profileBioDisplay.textContent = savedBio && savedBio.trim().length ? savedBio : defaultBio;

    
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        const v = e.target.value.trim();
        profileNameEl.textContent = v.length ? v : defaultName;
      });
    }

    if (bioInput) {
      bioInput.addEventListener('input', (e) => {
        const v = e.target.value.trim();
        profileBioDisplay.textContent = v.length ? v : defaultBio;
      });
    }

    
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const nameVal = nameInput ? nameInput.value.trim() : '';
        const bioVal = bioInput ? bioInput.value.trim() : '';

        
        try {
          if (nameVal.length) {
            localStorage.setItem(STORAGE_KEY_NAME, nameVal);
          } else {
            localStorage.removeItem(STORAGE_KEY_NAME);
          }

          if (bioVal.length) {
            localStorage.setItem(STORAGE_KEY_BIO, bioVal);
          } else {
            localStorage.removeItem(STORAGE_KEY_BIO);
          }

          
          profileNameEl.textContent = nameVal.length ? nameVal : defaultName;
          profileBioDisplay.textContent = bioVal.length ? bioVal : defaultBio;

         
          showSavedToast('Profile saved.');
        } catch (err) {
          
          console.error('Could not save profile to localStorage:', err);
          showSavedToast('Unable to save — check browser settings.');
        }
      });
    }

    
    function showSavedToast(message) {
      const existing = document.getElementById('profile-save-toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.id = 'profile-save-toast';
      toast.textContent = message;
      
      toast.style.position = 'fixed';
      toast.style.right = '16px';
      toast.style.bottom = '16px';
      toast.style.padding = '8px 12px';
      toast.style.background = 'rgba(0,0,0,0.8)';
      toast.style.color = 'white';
      toast.style.borderRadius = '6px';
      toast.style.fontSize = '14px';
      toast.style.zIndex = 9999;
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 180ms ease-in-out';

      document.body.appendChild(toast);
      
      requestAnimationFrame(() => (toast.style.opacity = '1'));

      
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
          toast.remove();
        }, 200);
      }, 2000);
    }
  });
})();
