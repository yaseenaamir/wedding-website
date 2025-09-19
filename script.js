// Wait for the HTML document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

   // --- EVENT DETAILS ---
    const eventDetails = {
        nikah: {
            title: "Nikah of Anam & Yaseen",
            startDate: "2025-12-21T10:00:00",
            endDate: "2025-12-21T16:00:00",
            location: "Le Roma Gardenia, Avalahalli Village, Off Ivri Road, near Nagarjuna Vidyaniketan School, Bengaluru, Karnataka 560064",
            description: "Nikah ceremony of Anam Armaan Raza & Yaseen Aamir Baig Mirza."
        },
        valima: {
            title: "Valima of Anam & Yaseen",
            startDate: "2025-12-25T18:00:00",
            endDate: "2025-12-25T23:00:00",
            location: "Blue Bay Beach Resort, Vadanemilli Village (Before Crocodile Park, SH 49, Mahabalipuram, Tamil Nadu 603104, India.",
            description: "Valima reception for Anam Armaan Raza & Yaseen Aamir Baig Mirza."
        }
    };

    // --- HELPER FUNCTIONS ---
    function formatUTCDate(dateStr) {
        const date = new Date(dateStr);
        return date.toISOString().replace(/-|:|\.\d{3}/g, "");
    }

    function createIcsContent(eventKey) {
        const event = eventDetails[eventKey];
        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "BEGIN:VEVENT",
            "URL:" + document.location.href,
            "DTSTART:" + formatUTCDate(event.startDate),
            "DTEND:" + formatUTCDate(event.endDate),
            "SUMMARY:" + event.title,
            "DESCRIPTION:" + event.description,
            "LOCATION:" + event.location,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\n");
        return "data:text/calendar;charset=utf8," + encodeURIComponent(icsContent);
    }

    function createGoogleLink(eventKey) {
        const event = eventDetails[eventKey];
        const url = new URL("https://www.google.com/calendar/render");
        url.searchParams.append("action", "TEMPLATE");
        url.searchParams.append("text", event.title);
        url.searchParams.append("dates", formatUTCDate(event.startDate) + "/" + formatUTCDate(event.endDate));
        url.searchParams.append("details", event.description);
        url.searchParams.append("location", event.location);
        return url.toString();
    }
    
    function createOutlookLink(eventKey) {
        const event = eventDetails[eventKey];
        const url = new URL("https://outlook.live.com/calendar/0/deeplink/compose");
        url.searchParams.append("path", "/calendar/action/compose");
        url.searchParams.append("rru", "addevent");
        url.searchParams.append("startdt", new Date(event.startDate).toISOString());
        url.searchParams.append("enddt", new Date(event.endDate).toISOString());
        url.searchParams.append("subject", event.title);
        url.searchParams.append("body", event.description);
        url.searchParams.append("location", event.location);
        return url.toString();
    }

    // --- MAIN SCRIPT LOGIC ---
    const calendarButtons = document.querySelectorAll(".save-calendar-button");
    calendarButtons.forEach(button => {
        const eventKey = button.dataset.event;
        const dropdown = document.querySelector(`.dropdown-content[data-dropdown="${eventKey}"]`);
        if (eventKey && dropdown) {
            const googleLink = dropdown.querySelector('[data-service="google"]');
            const outlookLink = dropdown.querySelector('[data-service="outlook"]');
            const icsLink = dropdown.querySelector('[data-service="ics"]');
            if(googleLink) googleLink.href = createGoogleLink(eventKey);
            if(outlookLink) outlookLink.href = createOutlookLink(eventKey);
            if(icsLink) icsLink.href = createIcsContent(eventKey);
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.dropdown-content.show').forEach(openDropdown => {
                    if (openDropdown !== dropdown) {
                        openDropdown.classList.remove('show');
                    }
                });
                dropdown.classList.toggle('show');
            });
        }
    });

    window.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-content.show').forEach(openDropdown => {
            openDropdown.classList.remove('show');
        });
    });

    // --- SCRIPT FOR RSVP FORM SUBMISSION ---
const rsvpForm = document.getElementById('rsvp-form');

// Only run this code if the rsvpForm exists on the current page
if (rsvpForm) {
    // !!! IMPORTANT: PASTE YOUR WEB APP URL HERE
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw1oKKRXcXNhqrtFPafW05794gJ6vwJ_Cpliic90-W3WWc7Yirgpqgal_D-7DuklTYF/exec'; 

    const submitButton = document.getElementById('submit-button');
    const formMessage = document.getElementById('form-message');

    rsvpForm.addEventListener('submit', e => {
        e.preventDefault(); // Prevent the form from submitting the default way
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        fetch(scriptURL, { method: 'POST', body: new FormData(rsvpForm) })
            .then(response => {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit RSVP';
                formMessage.textContent = 'Thank you! Your RSVP has been recorded.';
                formMessage.style.color = '#c59d5f';
                rsvpForm.reset();
            })
            .catch(error => {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit RSVP';
                formMessage.textContent = 'Oops! Something went wrong. Please try again.';
                formMessage.style.color = '#ff4d4d';
                console.error('Error!', error.message);
            });
    });
}

// --- SCRIPT FOR PHOTO UPLOAD & GALLERY ---

// --- PART 1: Code to build the gallery (fetches from Apps Script) ---
const photoGallery = document.getElementById('photo-gallery');
if (photoGallery) {
    // !!! IMPORTANT: PASTE YOUR PHOTO UPLOAD SCRIPT URL HERE
    const galleryScriptURL = 'https://script.google.com/macros/s/AKfycbzKhQoUMq-MxFv8Wyu9SVnFsnrcjNdukiINX5xkBlNCNXOgl7pdddCUrVubCxLX1gupHQ/exec'; 

    fetch(galleryScriptURL)
        .then(response => response.json())
        .then(urls => {
            // This will help us debug. Check the browser console to see what the script is sending.
            console.log("Fetched URLs from Google Script:", urls); 

            if (urls && urls.length > 0) {
                photoGallery.innerHTML = ''; // Clear any previous messages
                urls.forEach(url => {
                    const img = document.createElement('img');
                    img.src = url;
                    // Add an error handler to see if a specific image fails to load
                    img.onerror = function() {
                        console.error("Failed to load image:", url);
                        this.style.display = 'none'; // Hide the broken image icon
                    };
                    photoGallery.appendChild(img);
                });
            } else {
                photoGallery.innerHTML = '<p style="color:#aaa;">No photos have been approved for display yet. Be the first to share!</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching gallery photos:', error);
            photoGallery.innerHTML = '<p style="color:#ff4d4d;">Could not load the photo gallery. Please try again later.</p>';
        });
}


// --- PART 2: Code to handle the file upload (remains the same) ---
const photoInput = document.getElementById('photo-input');
const uploadButton = document.getElementById('upload-button');
const uploadStatus = document.getElementById('upload-status');

if (uploadButton) {
    // !!! IMPORTANT: THIS IS THE SAME URL AS galleryScriptURL ABOVE
    const uploadScriptURL = 'https://script.google.com/macros/s/AKfycbzKhQoUMq-MxFv8Wyu9SVnFsnrcjNdukiINX5xkBlNCNXOgl7pdddCUrVubCxLX1gupHQ/exec';

    uploadButton.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        uploadStatus.textContent = `Uploading ${file.name}...`;
        uploadStatus.style.color = '#cccccc';
        uploadButton.disabled = true;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const fileData = {
                name: file.name,
                type: file.type,
                file: reader.result,
            };

            fetch(uploadScriptURL, {
                method: 'POST',
                body: JSON.stringify(fileData)
            })
            .then(res => res.json())
            .then(data => {
                if (data.result === 'success') {
                    uploadStatus.textContent = 'Thank you! Your photo has been submitted for review.';
                    uploadStatus.style.color = '#c59d5f';
                } else {
                    uploadStatus.textContent = 'Upload failed. Please try again.';
                    uploadStatus.style.color = '#ff4d4d';
                }
                uploadButton.disabled = false;
                photoInput.value = '';
            })
            .catch(err => {
                uploadStatus.textContent = 'An error occurred. Please try again.';
                uploadStatus.style.color = '#ff4d4d';
                uploadButton.disabled = false;
            });
        };
    });
}
// --- SCRIPT FOR COUNTDOWN TIMER ---
const countdownElement = document.getElementById('countdown');

if (countdownElement) {
    const nikahDate = new Date("2025-12-21T10:00:00").getTime();

    const updateCountdown = setInterval(function() {
        const now = new Date().getTime();
        const distance = nikahDate - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the elements
        document.getElementById("days").innerText = days;
        document.getElementById("hours").innerText = hours;
        document.getElementById("minutes").innerText = minutes;
        document.getElementById("seconds").innerText = seconds;

        // If the countdown is finished, write some text
        if (distance < 0) {
            clearInterval(updateCountdown);
            countdownElement.innerHTML = "<h2 style='font-family: Playfair Display, serif; color: #c59d5f;'>The day is here!</h2>";
        }
    }, 1000);
}

// --- SCRIPT FOR "REVEAL ON SCROLL" ANIMATIONS ---
document.addEventListener('DOMContentLoaded', function() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing the element once it's visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });
});
// --- SCRIPT FOR FLOATING CONTACT BUBBLE (REVISED) ---
const contactIcon = document.getElementById('contact-icon');
const contactFormContainer = document.getElementById('contact-form-container');
const contactForm = document.getElementById('contact-form');
const contactFormStatus = document.getElementById('contact-form-status');

// This checks if the bubble exists on the page before adding listeners
if (contactIcon && contactFormContainer) {
    
    // Show/hide the form when the icon is clicked
    contactIcon.addEventListener('click', () => {
        contactFormContainer.classList.toggle('visible');
    });

    // Close the form if the user clicks anywhere else on the page
    document.addEventListener('click', function(event) {
        // If the click is outside the form container AND outside the icon itself
        if (!contactFormContainer.contains(event.target) && !contactIcon.contains(event.target)) {
            contactFormContainer.classList.remove('visible');
        }
    });

    // Handle the form submission with Formspree
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const form = e.target;
            const data = new FormData(form);
            const action = form.action;

            fetch(action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    contactFormStatus.textContent = "Thank you! Your message has been sent.";
                    contactFormStatus.style.color = "green";
                    form.reset();
                } else {
                    contactFormStatus.textContent = "Oops! There was a problem submitting your form.";
                    contactFormStatus.style.color = "red";
                }
            }).catch(error => {
                contactFormStatus.textContent = "Oops! There was a problem submitting your form.";
                contactFormStatus.style.color = "red";
            });
        });
    }
}
// --- SCRIPT FOR MOBILE HAMBURGER MENU (CORRECTED) ---
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger-icon');
    const navUl = document.getElementById('nav-links'); // Corrected to target the ul by its ID

    if (hamburger && navUl) {
        hamburger.addEventListener('click', () => {
            navUl.parentElement.classList.toggle('nav-active'); // Toggle the class on the <nav> parent
        });
    }
});
});