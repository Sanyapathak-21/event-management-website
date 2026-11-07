// Sample Event Data
const eventsData = [
    {
        id: 1,
        title: "Tech Conference 2026",
        date: "March 15, 2026",
        venue: "Convention Center, Tech Hub",
        category: "Tech",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
        description: "Join top industry leaders to discuss AI, Cloud computing, and web technologies."
    },
    {
        id: 2,
        title: "Summer Music Fest",
        date: "April 20, 2026",
        venue: "Open Air Arena",
        category: "Music",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
        description: "A full day of live musical performances by renowned indie and pop artists."
    },
    {
        id: 3,
        title: "Startup Pitch Day",
        date: "May 10, 2026",
        venue: "Innovation Hub",
        category: "Business",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80",
        description: "Watch promising startups pitch their ideas to venture capitalists and investors."
    }
];

// Elements
const eventsContainer = document.getElementById("events-container");
const searchInput = document.getElementById("search-bar");
const categoryFilter = document.getElementById("category-filter");
const themeToggleBtn = document.getElementById("theme-toggle");
const form = document.getElementById("registration-form");

// 1. Render Events
function renderEvents(events) {
    eventsContainer.innerHTML = "";
    if (events.length === 0) {
        eventsContainer.innerHTML = "<p>No events found matching your search.</p>";
        return;
    }

    events.forEach(event => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${event.image}" alt="${event.title}">
            <div class="card-content">
                <h3>${event.title}</h3>
                <div class="meta">📅 ${event.date} | 📍 ${event.venue}</div>
                <p>${event.description}</p>
                <button class="card-btn" onclick="selectEventForRegistration('${event.title}')">Register</button>
            </div>
        `;
        eventsContainer.appendChild(card);
    });
}

// 2. Filter & Search Logic
function filterEvents() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = eventsData.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm) || event.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    renderEvents(filtered);
}

searchInput.addEventListener("input", filterEvents);
categoryFilter.addEventListener("change", filterEvents);

// Auto-fill form event dropdown when clicking card button
function selectEventForRegistration(title) {
    document.getElementById("event-select").value = title;
    document.getElementById("register").scrollIntoView({ behavior: 'smooth' });
}

// 3. Dark Mode Toggle
themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeToggleBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// 4. Form Validation & Local Storage
form.addEventListener("submit", function (e) {
    e.preventDefault();
    
    let isValid = true;
    
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const eventSelect = document.getElementById("event-select").value;

    // Reset error messages
    document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");

    // Validate Name
    if (name === "") {
        document.getElementById("name-error").textContent = "Name is required.";
        isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById("email-error").textContent = "Enter a valid email address.";
        isValid = false;
    }

    // Validate Phone (10 digits)
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
        document.getElementById("phone-error").textContent = "Enter a valid 10-digit phone number.";
        isValid = false;
    }

    // Validate Selected Event
    if (eventSelect === "") {
        document.getElementById("event-error").textContent = "Please select an event.";
        isValid = false;
    }

    if (isValid) {
        // Local Storage Save
        const registrationData = { name, email, phone, eventSelect, timestamp: new Date() };
        let currentRegistrations = JSON.parse(localStorage.getItem("registrations")) || [];
        currentRegistrations.push(registrationData);
        localStorage.setItem("registrations", JSON.stringify(currentRegistrations));

        // Display Success Message
        const successMsg = document.getElementById("success-message");
        successMsg.style.display = "block";
        successMsg.textContent = `🎉 Thank you, ${name}! You have successfully registered for ${eventSelect}.`;
        
        form.reset();
    }
});

// Initial Render
renderEvents(eventsData);
