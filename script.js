// A SINGLE, ROBUST DOMCONTENTLOADED WRAPPER FOR THE REST OF THE SITE'S SCRIPTS
document.addEventListener('DOMContentLoaded', function() {

    // --- SCRIPT FOR "REVEAL ON SCROLL" ANIMATIONS ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    // --- SCRIPT FOR FLOATING CONTACT BUBBLE ---
    const contactIcon = document.getElementById('contact-icon');
    const contactFormContainer = document.getElementById('contact-form-container');
    const contactForm = document.getElementById('contact-form');
    const contactFormStatus = document.getElementById('contact-form-status');

    if (contactIcon && contactFormContainer) {
        contactIcon.addEventListener('click', () => {
            contactFormContainer.classList.toggle('visible');
        });

        document.addEventListener('click', function(event) {
            if (!contactFormContainer.contains(event.target) && !contactIcon.contains(event.target)) {
                contactFormContainer.classList.remove('visible');
            }
        });

        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const form = e.target;
                const data = new FormData(form);
                const action = form.action;
                fetch(action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
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

    // --- SCRIPT FOR MUSIC TOGGLE BUTTON ---
    const music = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');

    if (music && musicToggle) {
        // We start with the icon as 'play' (🔊)
        // We'll use a 'data-playing' attribute to track state
        musicToggle.addEventListener('click', function() {
            if (music.paused) {
                // If paused, play it and show the 'mute' icon
                music.play().then(() => {
                    // Audio is playing
                    music.muted = false;
                    musicToggle.innerHTML = '🔇';
                }).catch(error => {
                    // Autoplay was prevented (shouldn't happen on click, but good to have)
                    console.log("Music play failed:", error);
                });
            } else {
                // If playing, just toggle mute
                music.muted = !music.muted;
                // Update icon based on mute state
                musicToggle.innerHTML = music.muted ? '🔈' : '🔇';
            }
        });
    }
    // --- SCRIPT FOR ACTIVE NAV LINK (SEPARATE PAGES) ---
    // This new script checks the URL on page load
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll('#nav-links a');

    if (navLinks.length > 0) {
        let activeLinkFound = false;

        navLinks.forEach(link => {
            const linkPath = link.href.split("/").pop();
            
            // Check if the link's path matches the current page's path
            if (linkPath === currentPath) {
                link.classList.add('nav-active');
                activeLinkFound = true;
                
                // On mobile, scroll the nav bar to show the active link
                if (window.innerWidth <= 768) {
                    link.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
            }
        });

        // Fallback: If no link was matched (e.g., at root "/"), light up the "Home" link
        if (!activeLinkFound && (currentPath === '' || currentPath === 'index.html')) {
            const homeLink = document.querySelector('#nav-links a[href="index.html"]');
            if (homeLink) {
                homeLink.classList.add('nav-active');
            }
        }
    }


    // --- SCRIPT FOR COUNTDOWN TIMER ---
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const nikahDate = new Date("2025-12-21T10:00:00").getTime();
        const updateCountdown = setInterval(function() {
            const now = new Date().getTime();
            const distance = nikahDate - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("days").innerText = days;
            document.getElementById("hours").innerText = hours;
            document.getElementById("minutes").innerText = minutes;
            document.getElementById("seconds").innerText = seconds;

            if (distance < 0) {
                clearInterval(updateCountdown);
                countdownElement.innerHTML = "<h2 style='font-family: var(--font-serif); color: var(--gold);'>The day is here!</h2>";
            }
        }, 1000);
    }

    // --- SCRIPT FOR RSVP FORM SUBMISSION ---
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbw1oKKRXcXNhqrtFPafW05794gJ6vwJ_Cpliic90-W3WWc7Yirgpqgal_D-7DuklTYF/exec';
        const submitButton = document.getElementById('submit-button');
        const formMessage = document.getElementById('form-message');

        rsvpForm.addEventListener('submit', e => {
            e.preventDefault();
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            fetch(scriptURL, { method: 'POST', body: new FormData(rsvpForm) })
                .then(response => {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit RSVP';
                    formMessage.textContent = 'Thank you! Your RSVP has been recorded.';
                    formMessage.style.color = 'var(--gold)';
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

    // --- SCRIPT FOR PHOTO UPLOAD & GALLERY (WITH MULTIPLE UPLOAD) ---
    const photoGallery = document.getElementById('photo-gallery');
    if (photoGallery) {
        const galleryScriptURL = 'https://script.google.com/macros/s/AKfycbzKhQoUMq-MxFv8Wyu9SVnFsnrcjNdukiINX5xkBlNCNXOgl7pdddCUrVubCxLX1gupHQ/exec'; 
        fetch(galleryScriptURL)
            .then(response => response.json())
            .then(urls => {
                console.log("Fetched URLs from Google Script:", urls);
                if (urls && urls.length > 0) {
                    photoGallery.innerHTML = '';
                    urls.forEach(url => {
                    // 1. Create the <a> link for the lightbox
                    const link = document.createElement('a');
                    link.href = url; // The link's 'href' is the full-size image
                    link.setAttribute('data-lightbox', 'wedding-gallery'); // Group photos
                    // 2. Create the <img> thumbnail inside the link
                const img = document.createElement('img');
                img.src = url; // The image 'src' is the thumbnail
                img.onerror = function() { this.style.display = 'none'; };
                // 3. Append the <img> to the <a>, and the <a> to the gallery
                link.appendChild(img);
                photoGallery.appendChild(link);
            });
                    // urls.forEach(url => {
                    //     const img = document.createElement('img');
                    //     img.src = url;
                    //     img.onerror = function() { this.style.display = 'none'; };
                    //     photoGallery.appendChild(img);
                    // });
                } else {
                    photoGallery.innerHTML = '<p style="color:#aaa;">No photos have been approved for display yet. Be the first to share!</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching gallery photos:', error);
                photoGallery.innerHTML = '<p style="color:#ff4d4d;">Could not load the photo gallery. Please try again later.</p>';
            });
    }

    const photoInput = document.getElementById('photo-input');
    const uploadButton = document.getElementById('upload-button');
    const uploadStatus = document.getElementById('upload-status');

    if (uploadButton) {
        const uploadScriptURL = 'https://script.google.com/macros/s/AKfycbzKhQoUMq-MxFv8Wyu9SVnFsnrcjNdukiINX5xkBlNCNXOgl7pdddCUrVubCxLX1gupHQ/exec';
        uploadButton.addEventListener('click', () => {
            photoInput.click();
        });

        photoInput.addEventListener('change', (event) => {
            const files = event.target.files;
            if (!files.length) return;

            uploadButton.disabled = true;
            uploadStatus.textContent = `Uploading ${files.length} photo(s)...`;

            const uploadPromises = Array.from(files).map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        const fileData = { name: file.name, type: file.type, file: reader.result };
                        fetch(uploadScriptURL, { method: 'POST', body: JSON.stringify(fileData) })
                            .then(res => res.json())
                            .then(data => {
                                if (data.result === 'success') {
                                    resolve(data);
                                } else {
                                    reject(data.error);
                                }
                            })
                            .catch(reject);
                    };
                    reader.onerror = reject;
                });
            });

            Promise.all(uploadPromises)
                .then(results => {
                    uploadStatus.textContent = `Successfully uploaded ${results.length} photo(s) for review!`;
                    uploadStatus.style.color = 'var(--gold)';
                })
                .catch(error => {
                    uploadStatus.textContent = 'Some files failed to upload. Please try again.';
                    uploadStatus.style.color = 'red';
                    console.error('Upload Error:', error);
                })
                .finally(() => {
                    uploadButton.disabled = false;
                    photoInput.value = ''; // Reset the input
                });
        });
    }

    // --- SCRIPT FOR SAVE THE DATE CALENDAR LINKS ---
    const eventDetails = {
        nikah: {
            title: "Nikah of Anam & Yaseen",
            startDate: "2025-12-21T10:00:00",
            endDate: "2025-12-21T16:00:00",
            location: "Le Roma Gardenia, Bengaluru, Karnataka",
            description: "Nikah ceremony of Anam Armaan Raza & Yaseen Aamir Baig Mirza."
        },
        valima: {
            title: "Valima of Anam & Yaseen",
            startDate: "2025-12-25T18:00:00",
            endDate: "2025-12-25T23:00:00",
            location: "Blue Bay Beach Resort, Mahabalipuram, Tamil Nadu",
            description: "Valima reception for Anam Armaan Raza & Yaseen Aamir Baig Mirza."
        }
    };
    function formatUTCDate(dateStr) { const date = new Date(dateStr); return date.toISOString().replace(/-|:|\.\d{3}/g, ""); }
    function createIcsContent(eventKey) { const event = eventDetails[eventKey]; const icsContent = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", "URL:" + document.location.href, "DTSTART:" + formatUTCDate(event.startDate), "DTEND:" + formatUTCDate(event.endDate), "SUMMARY:" + event.title, "DESCRIPTION:" + event.description, "LOCATION:" + event.location, "END:VEVENT", "END:VCALENDAR"].join("\n"); return "data:text/calendar;charset=utf8," + encodeURIComponent(icsContent); }
    function createGoogleLink(eventKey) { const event = eventDetails[eventKey]; const url = new URL("https://www.google.com/calendar/render"); url.searchParams.append("action", "TEMPLATE"); url.searchParams.append("text", event.title); url.searchParams.append("dates", formatUTCDate(event.startDate) + "/" + formatUTCDate(event.endDate)); url.searchParams.append("details", event.description); url.searchParams.append("location", event.location); return url.toString(); }
    function createOutlookLink(eventKey) { const event = eventDetails[eventKey]; const url = new URL("https://outlook.live.com/calendar/0/deeplink/compose"); url.searchParams.append("path", "/calendar/action/compose"); url.searchParams.append("rru", "addevent"); url.searchParams.append("startdt", new Date(event.startDate).toISOString()); url.searchParams.append("enddt", new Date(event.endDate).toISOString()); url.searchParams.append("subject", event.title); url.searchParams.append("body", event.description); url.searchParams.append("location", event.location); return url.toString(); }

    const calendarButtons = document.querySelectorAll(".save-calendar-button");
    if (calendarButtons.length > 0) {
        calendarButtons.forEach(button => {
            const eventKey = button.dataset.event;
            const dropdown = document.querySelector(`.dropdown-content[data-dropdown="${eventKey}"]`);
            if (eventKey && dropdown) {
                const googleLink = dropdown.querySelector('[data-service="google"]');
                const outlookLink = dropdown.querySelector('[data-service="outlook"]');
                const icsLink = dropdown.querySelector('[data-service="ics"]');
                if (googleLink) googleLink.href = createGoogleLink(eventKey);
                if (outlookLink) outlookLink.href = createOutlookLink(eventKey);
                if (icsLink) icsLink.href = createIcsContent(eventKey);
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
    }
});
// --- SCRIPT FOR LIVE GUESTBOOK (GOOGLE SHEETS) ---
    const guestbookForm = document.getElementById('guestbook-form');
    
    // Only run this code if the guestbook form exists on the current page
    if (guestbookForm) {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzVHb8W9bVJl5X7BZay8jraP5pFue3zBQFQN9nJM45_hxiu6Usfg20-APdUIWCKVSQw1Q/exec'; // <--- PASTE YOUR URL HERE
        const status = document.getElementById('guestbook-status');
        const container = document.getElementById('messages-container');
        const btn = document.getElementById('guestbook-submit-btn');

        // Helper function to build the HTML
        function createMessageHTML(name, message) {
            return `
            <div class="guest-message fade-in">
                <p>"${message}"</p>
                <h4>— ${name}</h4>
            </div>`;
        }

        function addMessageToPage(name, message) {
            const html = createMessageHTML(name, message);
            container.insertAdjacentHTML('beforeend', html);
        }

        // 1. Load Messages on Page Load
        fetch(scriptURL)
            .then(response => response.json())
            .then(data => {
                container.innerHTML = ''; // Clear loading text
                if (data.length === 0) {
                    container.innerHTML = '<p class="no-msg">Be the first to leave a wish!</p>';
                } else {
                    data.forEach(entry => {
                        addMessageToPage(entry.name, entry.message);
                    });
                }
            })
            .catch(error => {
                console.error('Error loading messages!', error);
                container.innerHTML = '<p class="no-msg">Could not load messages.</p>';
            });

        // 2. Handle Form Submit
        guestbookForm.addEventListener('submit', e => {
            e.preventDefault();
            
            // Disable button
            btn.disabled = true;
            btn.innerText = "Posting...";

            // A. Optimistic UI: Add message to page IMMEDIATELY
            const nameVal = document.getElementById('GuestName').value;
            const msgVal = document.getElementById('Message').value;
            
            // Add the new message to the top of the list
            const newMessageHTML = createMessageHTML(nameVal, msgVal);
            container.insertAdjacentHTML('afterbegin', newMessageHTML);

            // B. Send to Google Sheet in background
            fetch(scriptURL, { method: 'POST', body: new FormData(guestbookForm)})
                .then(response => {
                    status.textContent = "Thank you! Your message has been posted.";
                    status.style.color = "var(--gold)";
                    guestbookForm.reset();
                    btn.disabled = false;
                    btn.innerText = "Share Message";
                    
                    // Clear status after 3 seconds
                    setTimeout(() => { status.textContent = ""; }, 3000);
                })
                .catch(error => {
                    status.textContent = "Error! Please try again.";
                    status.style.color = "red";
                    btn.disabled = false;
                    btn.innerText = "Share Message";
                });
        });
    }