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
        musicToggle.addEventListener('click', function() {
            if (music.paused) {
                // If paused, play and show the 'mute' icon
                music.play();
                music.muted = false;
                musicToggle.innerHTML = '🔇';
            } else {
                // If playing, toggle mute
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
                        const img = document.createElement('img');
                        img.src = url;
                        img.onerror = function() { this.style.display = 'none'; };
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