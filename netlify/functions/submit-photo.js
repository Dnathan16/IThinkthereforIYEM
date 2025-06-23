// Complete Photo Upload Handler
async function handlePhotoUpload(event) {
  event.preventDefault();
  console.log('Photo upload started');
  
  const fileInput = document.getElementById('photo-input');
  const nameInput = document.getElementById('photo-name');
  const emailInput = document.getElementById('photo-email');
  const showDateInput = document.getElementById('photo-show-date');
  const venueInput = document.getElementById('photo-venue');
  const descriptionInput = document.getElementById('photo-description');
  
  if (!fileInput.files[0]) {
    alert('Please select a photo');
    return;
  }
  
  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Uploading...';
  submitBtn.disabled = true;
  
  try {
    console.log('Converting file to base64...');
    // Convert file to base64
    const file = fileInput.files[0];
    const base64 = await fileToBase64(file);
    console.log('File converted, size:', base64.length);
    
    const uploadData = {
      name: nameInput.value,
      email: emailInput.value,
      showDate: showDateInput.value,
      venue: venueInput.value,
      description: descriptionInput.value,
      photoBase64: base64,
    };
    
    console.log('Sending to API...');
    
    // Submit to backend
    const response = await fetch('/api/submit-photo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    
    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Response data:', result);
    
    if (result.success) {
      alert('Photo uploaded successfully!');
      event.target.reset(); // Clear form
      loadPhotos(); // Refresh photo display
    } else {
      alert('Error uploading photo: ' + result.error);
      console.error('Upload error:', result);
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('Error uploading photo: ' + error.message);
  } finally {
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Load and display photos
async function loadPhotos() {
  try {
    console.log('Loading photos...');
    const response = await fetch('/api/get-submissions?type=photos');
    const result = await response.json();
    console.log('Photos loaded:', result);
    
    if (result.success) {
      const photosContainer = document.getElementById('photos-container');
      if (!photosContainer) {
        console.log('No photos container found');
        return;
      }
      
      photosContainer.innerHTML = '';
      
      if (result.submissions.length === 0) {
        photosContainer.innerHTML = '<p>No photos submitted yet. Be the first!</p>';
        return;
      }
      
      result.submissions.forEach(photo => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-item';
        photoDiv.innerHTML = `
          <img src="${photo['Photo URL']}" alt="${photo.Description || 'Concert photo'}" loading="lazy">
          <div class="photo-info">
            <h4>${photo.Venue || 'Unknown Venue'}</h4>
            <p>${photo['Show Date'] || 'Date unknown'}</p>
            <p>${photo.Description || ''}</p>
            <small>Submitted by ${photo.Name}</small>
          </div>
        `;
        photosContainer.appendChild(photoDiv);
      });
    }
  } catch (error) {
    console.error('Error loading photos:', error);
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing photo upload...');
  
  // Load existing submissions
  loadPhotos();
  
  // Set up form handler
  const photoForm = document.getElementById('photo-form');
  if (photoForm) {
    console.log('Photo form found, adding event listener');
    photoForm.addEventListener('submit', handlePhotoUpload);
  } else {
    console.log('Photo form not found');
  }
});

// Add some basic CSS for photo display
const styles = `
  .photo-item {
    margin: 20px 0;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f9f9f9;
    max-width: 600px;
  }
  
  .photo-item img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }
  
  .photo-info {
    padding: 10px 0;
  }
  
  .photo-info h4 {
    margin: 0 0 5px 0;
    color: #333;
  }
  
  .photo-info p {
    margin: 5px 0;
    color: #666;
  }
  
  .photo-info small {
    color: #888;
    font-style: italic;
  }
`;

// Add styles to page if not already added
if (!document.querySelector('#upload-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'upload-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}