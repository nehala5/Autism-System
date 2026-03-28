// Global State
let token = localStorage.getItem('token');
let userId = localStorage.getItem('userId');
let selectedChildId = localStorage.getItem('selectedChildId');
let currentEmotionLogId = null;

// --- Data Templates ---

const animalTemplates = {
    'Dog': `
        <circle cx="100" cy="80" r="45" data-ref-fill="#964B00" stroke="#000" stroke-width="2"/>
        <circle cx="65" cy="50" r="18" data-ref-fill="#964B00" stroke="#000" stroke-width="2"/>
        <circle cx="135" cy="50" r="18" data-ref-fill="#964B00" stroke="#000" stroke-width="2"/>
        <circle cx="85" cy="75" r="5" data-ref-fill="#000" stroke="#000" stroke-width="2"/>
        <circle cx="115" cy="75" r="5" data-ref-fill="#000" stroke="#000" stroke-width="2"/>
        <ellipse cx="100" cy="95" rx="12" ry="7" data-ref-fill="#000" stroke="#000" stroke-width="2"/>
    `,
    'Cat': `
        <circle cx="100" cy="85" r="45" data-ref-fill="#FFA500" stroke="#000" stroke-width="2"/>
        <polygon points="60,60 85,55 70,30" data-ref-fill="#FFA500" stroke="#000" stroke-width="2"/>
        <polygon points="115,55 140,60 130,30" data-ref-fill="#FFA500" stroke="#000" stroke-width="2"/>
        <circle cx="85" cy="80" r="5" data-ref-fill="#000" stroke="#000" stroke-width="2"/>
        <circle cx="115" cy="80" r="5" data-ref-fill="#000" stroke="#000" stroke-width="2"/>
        <polygon points="100,95 95,90 105,90" data-ref-fill="#FFC0CB" stroke="#000" stroke-width="2"/>
    `,
    'Lion': `
        <circle cx="100" cy="90" r="60" data-ref-fill="#FFD700" stroke="#000" stroke-width="2"/>
        <circle cx="100" cy="90" r="40" data-ref-fill="#FFA500" stroke="#000" stroke-width="2"/>
        <circle cx="85" cy="85" r="5" data-ref-fill="#000" stroke="#000" stroke-width="2"/>
        <circle cx="115" cy="85" r="5" data-ref-fill="#000" stroke="#000" stroke-width="2"/>
        <ellipse cx="100" cy="105" rx="10" ry="6" data-ref-fill="#000" stroke="#000" stroke-width="2"/>
    `,
    'Bunny': `
        <circle cx="100" cy="100" r="35" data-ref-fill="#bdc3c7" stroke="#000" stroke-width="2"/>
        <ellipse cx="85" cy="50" rx="10" ry="30" data-ref-fill="#bdc3c7" stroke="#000" stroke-width="2"/>
        <ellipse cx="115" cy="50" rx="10" ry="30" data-ref-fill="#bdc3c7" stroke="#000" stroke-width="2"/>
        <circle cx="88" cy="95" r="4" data-ref-fill="#000" stroke="#000" stroke-width="2"/>
        <circle cx="112" cy="95" r="4" data-ref-fill="#000" stroke="#000" stroke-width="2"/>
        <circle cx="100" cy="110" r="5" data-ref-fill="#ff9ff3" stroke="#000" stroke-width="2"/>
    `,
    'Fish': `
        <ellipse cx="100" cy="100" rx="50" ry="30" data-ref-fill="#ff9f43" stroke="#000" stroke-width="2"/>
        <polygon points="150,100 175,80 175,120" data-ref-fill="#ff9f43" stroke="#000" stroke-width="2"/>
        <circle cx="75" cy="95" r="6" data-ref-fill="#fff" stroke="#000" stroke-width="2"/>
        <circle cx="75" cy="95" r="3" data-ref-fill="#000" stroke="#000" stroke-width="2"/>
        <path d="M 110 90 Q 130 100 110 110" data-ref-fill="none" stroke="#000" stroke-width="2" fill="none"/>
    `
};

const coloringTemplates = {
    'House': `
        <circle cx="160" cy="40" r="20" data-ref-fill="#f1c40f" stroke="#000" stroke-width="2"/>
        <rect x="50" y="100" width="100" height="80" data-ref-fill="#f39c12" stroke="#000" stroke-width="2"/>
        <polygon points="50,100 150,100 100,40" data-ref-fill="#e74c3c" stroke="#000" stroke-width="2"/>
        <rect x="85" y="140" width="30" height="40" data-ref-fill="#34495e" stroke="#000" stroke-width="2"/>
        <rect x="115" y="115" width="20" height="20" data-ref-fill="#95a5a6" stroke="#000" stroke-width="2"/>
    `,
    'Flower': `
        <circle cx="100" cy="100" r="25" data-ref-fill="#f1c40f" stroke="#000" stroke-width="2"/>
        <circle cx="100" cy="65" r="20" data-ref-fill="#e74c3c" stroke="#000" stroke-width="2"/>
        <circle cx="100" cy="135" r="20" data-ref-fill="#e74c3c" stroke="#000" stroke-width="2"/>
        <circle cx="65" cy="100" r="20" data-ref-fill="#e74c3c" stroke="#000" stroke-width="2"/>
        <circle cx="135" cy="100" r="20" data-ref-fill="#e74c3c" stroke="#000" stroke-width="2"/>
        <rect x="95" y="155" width="10" height="40" data-ref-fill="#2ecc71" stroke="#000" stroke-width="2"/>
    `,
    'Car': `
        <rect x="40" y="100" width="120" height="40" data-ref-fill="#3498db" stroke="#000" stroke-width="2"/>
        <rect x="60" y="70" width="80" height="30" data-ref-fill="#3498db" stroke="#000" stroke-width="2"/>
        <circle cx="65" cy="140" r="15" data-ref-fill="#333" stroke="#000" stroke-width="2"/>
        <circle cx="135" cy="140" r="15" data-ref-fill="#333" stroke="#000" stroke-width="2"/>
        <rect x="100" y="75" width="30" height="20" data-ref-fill="#ecf0f1" stroke="#000" stroke-width="2"/>
    `
};

const quizData = {
    'Social Skills': [
        {
            question: "A friend is feeling sad and crying. What should you do?",
            options: [
                { text: "Ask if they are okay 🫂", correct: true },
                { text: "Laugh at them 😆", correct: false },
                { text: "Run away 🏃", correct: false }
            ]
        },
        {
            question: "You want to play with a toy someone else has. What do you say?",
            options: [
                { text: "Can I have a turn please? 🧸", correct: true },
                { text: "Grab it quickly! 🖐️", correct: false },
                { text: "Yell at them 📢", correct: false }
            ]
        },
        {
            question: "Someone says 'Hello' to you. What is a nice way to respond?",
            options: [
                { text: "Smile and say 'Hi'! 👋", correct: true },
                { text: "Look at the floor ⬇️", correct: false },
                { text: "Walk away 🚶", correct: false }
            ]
        },
        {
            question: "You accidentally bumped into a friend. What do you say?",
            options: [
                { text: "I'm sorry! 🙊", correct: true },
                { text: "It was your fault! 😠", correct: false },
                { text: "Say nothing 🤐", correct: false }
            ]
        },
        {
            question: "A friend is talking, but you have something to say too. What should you do?",
            options: [
                { text: "Wait for them to finish, then speak 🙊", correct: true },
                { text: "Interrupt them immediately 📢", correct: false },
                { text: "Start talking louder 🗣️", correct: false }
            ]
        }
    ],
    'Daily Routine': [
        {
            question: "You just finished eating dinner. What comes next?",
            options: [
                { text: "Brush your teeth 🪥", correct: true },
                { text: "Go to school 🏫", correct: false },
                { text: "Eat breakfast 🥣", correct: false }
            ]
        },
        {
            question: "What should you do right after you wake up in the morning?",
            options: [
                { text: "Wash your face and get dressed ☀️", correct: true },
                { text: "Go to sleep 😴", correct: false },
                { text: "Eat dinner 🍽️", correct: false }
            ]
        },
        {
            question: "What is the first thing you do before eating your lunch?",
            options: [
                { text: "Wash your hands 🧼", correct: true },
                { text: "Run outside 🌳", correct: false },
                { text: "Start singing 🎤", correct: false }
            ]
        },
        {
            question: "Where do your toys go when you are finished playing?",
            options: [
                { text: "In the toy box 📦", correct: true },
                { text: "On the floor 🧹", correct: false },
                { text: "In the fridge 🧊", correct: false }
            ]
        },
        {
            question: "What do we do before going to bed at night?",
            options: [
                { text: "Put on pajamas and read a story 📖", correct: true },
                { text: "Go for a swim 🏊", correct: false },
                { text: "Eat a big meal 🍕", correct: false }
            ]
        }
    ],
    'Safety & Help': [
        {
            question: "If you feel lost in a big store, who should you look for?",
            options: [
                { text: "A store worker in a uniform 👮", correct: true },
                { text: "A stranger 👤", correct: false },
                { text: "Run outside 🏃", correct: false }
            ]
        },
        {
            question: "What should you do if you see something hot on the stove?",
            options: [
                { text: "Stay away and tell a grown-up 🚫", correct: true },
                { text: "Touch it 🖐️", correct: false },
                { text: "Blow on it 🌬️", correct: false }
            ]
        },
        {
            question: "If you get a small scrape on your knee, what should you do?",
            options: [
                { text: "Tell a teacher or parent 🩹", correct: true },
                { text: "Keep running 🏃", correct: false },
                { text: "Cry all day 😭", correct: false }
            ]
        },
        {
            question: "A stranger asks you to go with them. What do you do?",
            options: [
                { text: "Say 'NO' and run to a safe adult 🛑", correct: true },
                { text: "Go with them 🚶", correct: false },
                { text: "Take the candy they offer 🍬", correct: false }
            ]
        },
        {
            question: "What number should you know for emergencies?",
            options: [
                { text: "911 (or your local emergency number) ☎️", correct: true },
                { text: "123 🔢", correct: false },
                { text: "555 📞", correct: false }
            ]
        }
    ],
    'Advanced Social Skills': [
        {
            question: "Your friend is building a tower and it keeps falling. How might they feel?",
            options: [
                { text: "Frustrated or annoyed 😠", correct: true },
                { text: "Excited 🤩", correct: false },
                { text: "Sleepy 😴", correct: false }
            ]
        },
        {
            question: "A friend is talking about their favorite cat. What is a good thing to do?",
            options: [
                { text: "Listen and ask 'What is your cat's name?' 🐱", correct: true },
                { text: "Start talking about your dog 🐶", correct: false },
                { text: "Walk away 🚶", correct: false }
            ]
        },
        {
            question: "You want to play a game with a group. How can you join in?",
            options: [
                { text: "Wait for a break and ask 'Can I play too?' 🤝", correct: true },
                { text: "Jump into the middle of the game 🏃", correct: false },
                { text: "Take the ball away ⚽", correct: false }
            ]
        },
        {
            question: "You see someone sitting alone at recess. What could you do?",
            options: [
                { text: "Ask if they want to play with you 🤝", correct: true },
                { text: "Ignore them 🙈", correct: false },
                { text: "Point and laugh ☝️", correct: false }
            ]
        },
        {
            question: "If your friend wins a game and you lose, what should you say?",
            options: [
                { text: "Good game! You did well! 👏", correct: true },
                { text: "I hate this game! 😠", correct: false },
                { text: "You cheated! 😤", correct: false }
            ]
        }
    ]
};

// UI Initial Checks
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Path:", window.location.pathname);
    updateNav();
    applySensoryUI();
    applyLevelUI();
    if (window.location.pathname === '/login') {
        if (token) {
            const loginSection = document.getElementById('login-section');
            const childSection = document.getElementById('child-section');
            if (loginSection) loginSection.classList.add('hidden');
            if (childSection) {
                childSection.classList.remove('hidden');
                loadChildren();
            } else {
                window.location.href = '/children';
            }
        }
    }
    if (window.location.pathname === '/dashboard' || window.location.pathname === '/') {
        loadChildrenForDashboard();
    }
    if (window.location.pathname === '/diary') {
        loadDiary();
    }
    if (window.location.pathname === '/emotion-learning') {
        loadCustomEmotions();
    }
});

function updateNav() {
    if (token) {
        const loginNav = document.getElementById('nav-login');
        const logoutNav = document.getElementById('nav-logout');
        if (loginNav) loginNav.classList.add('hidden');
        if (logoutNav) logoutNav.classList.remove('hidden');
    }
}

function logout() {
    localStorage.clear();
    window.location.href = '/login';
}

function toggleAuth(showRegister) {
    const loginSection = document.getElementById('login-section');
    const regSection = document.getElementById('register-section');
    if (showRegister) {
        if (loginSection) loginSection.classList.add('hidden');
        if (regSection) regSection.classList.remove('hidden');
    } else {
        if (loginSection) loginSection.classList.remove('hidden');
        if (regSection) regSection.classList.add('hidden');
    }
}

// Auth API Calls
async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
        alert("Registered! Please login.");
        toggleAuth(false);
    } else alert(data.detail);
}

async function login() {
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    if (!usernameInput || !passwordInput) return;
    
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userId', data.user_id);
        token = data.access_token;
        userId = data.user_id;
        window.location.href = '/children';
    } else alert(data.detail);
}

async function addChild() {
    const nameInput = document.getElementById('child-name');
    const ageInput = document.getElementById('child-age');
    const inheritanceInput = document.getElementById('child-autism-inheritance');
    const sensoryInput = document.getElementById('child-sensory-level');
    
    if (!nameInput || !ageInput) return;

    const name = nameInput.value;
    const age = parseInt(ageInput.value);
    const parent_id = parseInt(userId || localStorage.getItem('userId'));
    
    if (!parent_id) {
        alert("Please log in again.");
        window.location.href = '/login';
        return;
    }

    const autism_inheritance = inheritanceInput ? inheritanceInput.value : "";
    const sensory_level = sensoryInput ? sensoryInput.value : "standard";

    console.log("Adding child with data:", { name, age, parent_id, autism_inheritance, sensory_level });

    try {
        const res = await fetch('/auth/add-child', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name, 
                age, 
                parent_id,
                autism_inheritance,
                sensory_level
            })
        });
        const data = await res.json();
        if (res.ok) {
            loadChildren();
            alert("Child added!");
            nameInput.value = '';
            ageInput.value = '';
        } else {
            console.error("Server error:", data);
            alert(data.detail || "Error adding child profile.");
        }
    } catch (err) {
        console.error("Network error:", err);
        alert("Could not connect to server.");
    }
}

async function loadChildren() {
    const res = await fetch(`/auth/children/${userId}`);
    const children = await res.json();
    const list = document.getElementById('child-list');
    if (!list) return; 
    list.innerHTML = '';
    if (children.length === 0) {
        list.innerHTML = '<p>No child profiles found. Add one to get started!</p>';
        return;
    }
    children.forEach(c => {
        const div = document.createElement('div');
        div.className = 'card child-card';
        div.innerHTML = `
            <div class="child-info">
                <h3>${c.name}</h3>
                <p>Age: ${c.age} | Level: ${c.level || 1} | Sensory: ${c.sensory_level}</p>
            </div>
            <div class="child-actions">
                <button class="btn-select" onclick="window.selectChild(${c.id}, '${c.name}', ${c.age}, '${c.sensory_level}', ${c.level || 1})">Select</button>
                <button class="btn-delete" onclick="window.deleteChild(${c.id})">Delete</button>
            </div>
        `;
        list.appendChild(div);
    });
}

async function deleteChild(id) {
    if (!confirm("Are you sure you want to delete this child profile? All progress will be lost.")) return;
    const res = await fetch(`/auth/delete-child/${id}`, { method: 'DELETE' });
    if (res.ok) {
        alert("Child profile deleted.");
        if (selectedChildId == id) {
            localStorage.removeItem('selectedChildId');
            localStorage.removeItem('selectedChildAge');
            localStorage.removeItem('selectedChildSensory');
            localStorage.removeItem('selectedChildLevel');
            selectedChildId = null;
        }
        loadChildren();
    } else {
        const data = await res.json();
        alert(data.detail || "Error deleting child.");
    }
}

function selectChild(id, name, age, sensory, level) {
    localStorage.setItem('selectedChildId', id);
    localStorage.setItem('selectedChildAge', age);
    localStorage.setItem('selectedChildSensory', sensory);
    localStorage.setItem('selectedChildLevel', level || 1);
    selectedChildId = id;
    alert(`Child profile selected: ${name} (Age: ${age}, Level: ${level || 1})`);
    applySensoryUI(sensory);
    applyLevelUI(age); // Note: age still used for some legacy UI logic if any
    window.location.href = '/dashboard';
}

function applySensoryUI(level) {
    if (!level) level = localStorage.getItem('selectedChildSensory') || 'standard';
    console.log("Applying UI for sensory level:", level);
    
    if (level === 'high') {
        document.body.classList.add('calm-theme');
    } else {
        document.body.classList.remove('calm-theme');
    }
}

function applyLevelUI(age) {
    // Reverted to normal UI for all levels as requested.
    // No specific theme classes added here.
    document.body.classList.remove('level-2-theme', 'level-3-theme');
}

// Real-time Emotion Tracker Logic
let videoStream = null;
let captureInterval = null;
let emotionHistory = []; // Buffer for smoothing results
const SMOOTHING_WINDOW = 5; // Average over last 5 frames

async function startCamera() {
    const display = document.getElementById('live-result');
    const video = document.getElementById('webcam');
    
    console.log("Attempting to start camera...");
    console.log("Hostname:", window.location.hostname);
    console.log("Secure Context:", window.isSecureContext);

    if (!selectedChildId) {
        alert("Please select a child profile first on the Child page!");
        return;
    }

    // 1. Check for Secure Context (HTTPS or localhost)
    if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        const errorMsg = `❌ Camera BLOCKED. Your browser requires HTTPS for camera access unless you are using 'localhost'. (Current: ${window.location.hostname})`;
        console.error(errorMsg);
        if (display) display.innerHTML = `<span style="color:red; font-size: 0.8rem;">${errorMsg}</span>`;
        alert(errorMsg);
        return;
    }

    // 2. Check for MediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const errorMsg = "❌ Camera API not supported in this browser. Try Chrome or Edge.";
        console.error(errorMsg);
        if (display) display.innerHTML = `<span style="color:red;">${errorMsg}</span>`;
        alert(errorMsg);
        return;
    }

    // Stop any existing camera session
    stopCamera();
    emotionHistory = []; 

    if (!video) {
        console.error("Video element 'webcam' not found in DOM.");
        return;
    }

    if (display) display.innerText = "⌛ Requesting camera permission...";

    try {
        console.log("Calling getUserMedia...");
        const constraints = { 
            video: { 
                facingMode: "user",
                width: { ideal: 640 },
                height: { ideal: 480 }
            } 
        };
        
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        console.log("Camera stream obtained.");
        video.srcObject = videoStream;
        
        // Ensure video plays
        video.onloadedmetadata = () => {
            console.log("Video metadata loaded, playing...");
            video.play()
                .then(() => {
                    console.log("Video playing successfully.");
                    if (display) display.innerHTML = '<span style="color:green;">✅ Camera Active!</span>';
                })
                .catch(e => {
                    console.error("Error playing video:", e);
                    if (display) display.innerHTML = `<span style="color:red;">Error playing video: ${e.message}</span>`;
                });
        };

        // Start capturing frames every 1.5 seconds
        captureInterval = setInterval(captureFrame, 1500); 
        
    } catch (err) {
        console.error("Camera start error:", err);
        let msg = "❌ Camera Error.";
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') 
            msg = "❌ Permission Denied. Please allow camera access in your browser settings.";
        else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') 
            msg = "❌ No camera found on this device.";
        else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') 
            msg = "❌ Camera is already in use by another app.";
        else 
            msg = `❌ Error: ${err.name} - ${err.message}`;

        if (display) display.innerHTML = `<span style="color:red; font-size: 0.9rem;">${msg}</span>`;
        alert(msg);
    }
}

function stopCamera() {
    console.log("Stopping camera...");
    if (captureInterval) {
        clearInterval(captureInterval);
        captureInterval = null;
    }
    
    if (videoStream) {
        videoStream.getTracks().forEach(track => {
            track.stop();
        });
        videoStream = null;
    }

    const video = document.getElementById('webcam');
    if (video) {
        video.srcObject = null;
    }

    const display = document.getElementById('live-result');
    if (display) display.innerText = "Camera Stopped";
    
    const overlay = document.getElementById('live-overlay');
    if (overlay) overlay.innerText = "Ready...";
    
    emotionHistory = [];
}

// Automatically stop camera if user leaves the page
window.addEventListener('beforeunload', stopCamera);
window.addEventListener('popstate', stopCamera);

async function captureFrame() {
    const video = document.getElementById('webcam');
    if (!video || !video.srcObject || !videoStream) {
        return;
    }

    if (video.paused || video.ended) return;

    console.log("Capturing frame for analysis...");
    
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    if (canvas.width === 0 || canvas.height === 0) return;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const frameData = canvas.toDataURL('image/jpeg', 0.6); // Lower quality for speed
    const formData = new FormData();
    formData.append('child_id', selectedChildId);
    formData.append('frame_data', frameData);

    try {
        const res = await fetch('/emotion/process-frame', {
            method: 'POST',
            body: formData
        });
        
        if (!res.ok) {
            console.error("Frame processing failed on server:", res.status);
            return;
        }

        const data = await res.json();
        if (data.emotion) {
            console.log("Detected emotion:", data.emotion);
            // Add to history for smoothing
            emotionHistory.push(data.emotion);
            if (emotionHistory.length > SMOOTHING_WINDOW) {
                emotionHistory.shift();
            }

            // Get the most frequent emotion in the window
            const counts = {};
            emotionHistory.forEach(e => counts[e] = (counts[e] || 0) + 1);
            const stableEmotion = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

            const overlay = document.getElementById('live-overlay');
            const display = document.getElementById('live-result');
            const emotion = stableEmotion.toUpperCase();
            
            if (overlay) {
                overlay.innerText = emotion;
                const colors = {
                    'HAPPY': '#4CAF50', 'SAD': '#2196F3', 'ANGRY': '#F44336',
                    'SURPRISE': '#FFEB3B', 'NEUTRAL': '#9E9E9E', 'FEAR': '#9C27B0', 'DISGUST': '#795548'
                };
                overlay.style.borderColor = colors[emotion] || '#4a90e2';
                overlay.style.background = (emotion === 'SURPRISE') ? 'rgba(255,235,59,0.9)' : 'rgba(0,0,0,0.7)';
                overlay.style.color = (emotion === 'SURPRISE') ? '#000' : '#fff';
            }
            
            if (display) {
                display.innerHTML = `<span style="color:green; font-weight:900;">LIVE: ${emotion}</span>`;
            }
        }
    } catch (err) {
        console.error("Frame processing error:", err);
    }
}

async function capturePhoto() {
    console.log("Capturing photo...");
    if (!selectedChildId) return alert("Select child first!");
    const video = document.getElementById('webcam');
    if (!video || !video.srcObject) return alert("Start camera first!");

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
    const formData = new FormData();
    formData.append('file', blob, 'capture.jpg');
    formData.append('child_id', selectedChildId);

    try {
        const res = await fetch('/emotion/upload', {
            method: 'POST',
            body: formData
        });
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.detail || "Upload failed");
        }
        const data = await res.json();
        currentEmotionLogId = data.id;
        document.getElementById('predicted-emotion').innerText = data.predicted_emotion.toUpperCase();
        document.getElementById('result-img').src = data.image_url;
        document.getElementById('emotion-result').classList.remove('hidden');
    } catch (err) {
        console.error("Capture upload error:", err);
        alert("Upload error: " + err.message);
    }
}

// Emotion Module (Legacy Upload)

async function loadCustomEmotions() {
    try {
        const res = await fetch('/emotion/unique-emotions');
        if (!res.ok) return;
        const emotions = await res.json();
        const select = document.getElementById('corrected-emotion');
        if (!select) return;

        // Save current "other" option
        const otherOption = select.querySelector('option[value="other"]');
        select.innerHTML = '';
        
        emotions.forEach(emo => {
            const opt = document.createElement('option');
            opt.value = emo;
            opt.innerText = emo.charAt(0).toUpperCase() + emo.slice(1);
            select.appendChild(opt);
        });
        
        if (otherOption) select.appendChild(otherOption);
    } catch (err) {
        console.error("Failed to load custom emotions:", err);
    }
}

async function uploadEmotion() {
    console.log("Uploading emotion image...");
    if (!selectedChildId) return alert("Please select a child profile first!");
    const fileInput = document.getElementById('emotion-upload');
    if (!fileInput || fileInput.files.length === 0) return alert("Select an image first.");

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('child_id', selectedChildId);

    try {
        const res = await fetch('/emotion/upload', {
            method: 'POST',
            body: formData
        });
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.detail || "Upload failed");
        }
        const data = await res.json();
        currentEmotionLogId = data.id;
        document.getElementById('predicted-emotion').innerText = data.predicted_emotion.toUpperCase();
        document.getElementById('result-img').src = data.image_url;
        document.getElementById('emotion-result').classList.remove('hidden');
    } catch (err) {
        console.error("Upload error:", err);
        alert("Upload error: " + err.message);
    }
}

async function confirmEmotion(confirmed) {
    if (confirmed) {
        await fetch('/emotion/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `log_id=${currentEmotionLogId}&confirmed=true`
        });
        alert("Confirmed! Thank you.");
        const resDiv = document.getElementById('emotion-result');
        if (resDiv) resDiv.classList.add('hidden');
    } else {
        const corrArea = document.getElementById('correction-area');
        if (corrArea) corrArea.classList.remove('hidden');
    }
}

function toggleCustomEmotion() {
    const select = document.getElementById('corrected-emotion');
    const customInput = document.getElementById('custom-emotion-name');
    if (select.value === 'other') {
        customInput.classList.remove('hidden');
    } else {
        customInput.classList.add('hidden');
    }
}

async function saveCorrection() {
    const select = document.getElementById('corrected-emotion');
    const customInput = document.getElementById('custom-emotion-name');
    
    let corrected = select.value;
    if (corrected === 'other') {
        corrected = customInput.value.toLowerCase().trim();
        if (!corrected) return alert("Please type a new emotion name.");
    }

    await fetch('/emotion/confirm', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `log_id=${currentEmotionLogId}&confirmed=true&corrected_emotion=${corrected}`
    });
    alert(`Learned! This image is now marked as: ${corrected}`);
    const resDiv = document.getElementById('emotion-result');
    if (resDiv) resDiv.classList.add('hidden');
    
    // Refresh the list to include the new emotion
    loadCustomEmotions();
    
    if (customInput) customInput.value = '';
    if (select) select.value = 'happy';
    toggleCustomEmotion();
}

async function trainAI() {
    const status = document.getElementById('train-status');
    if (status) status.innerText = "Training in progress... please wait.";
    
    try {
        const res = await fetch('/emotion/train', { method: 'POST' });
        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            if (status) status.innerText = "Last training: " + data.message;
        } else {
            alert("Training failed: " + data.error);
            if (status) status.innerText = "Training failed.";
        }
    } catch (err) {
        console.error("Training error:", err);
        alert("Error connecting to server.");
    }
}

// Activities and Games Logic
let activeGame = "";
let gameScore = 0;
let startTime = 0;

function startGame(name) {
    if (!selectedChildId) return alert("Select child first.");
    
    name = (name || "").trim();
    console.log("Starting game:", name);
    
    activeGame = name;
    gameScore = 0;
    startTime = Date.now();
    
    const gameArea = document.getElementById('game-area');
    if (gameArea) gameArea.classList.remove('hidden');
    
    const title = document.getElementById('current-game-title');
    if (title) {
        title.innerText = name;
        title.style.display = 'block';
    }
    
    const controls = document.getElementById('game-controls');
    if (controls) controls.classList.remove('hidden');
    
    const scoreDisplay = document.getElementById('game-score');
    if (scoreDisplay) scoreDisplay.innerText = gameScore;
    
    const closeBtn = document.getElementById('close-game-btn');
    if (closeBtn) closeBtn.classList.add('hidden');
    
    const container = document.getElementById('game-container');
    if (!container) return console.error("Game container not found!");
    
    container.innerHTML = '';

    const lowerName = name.toLowerCase();
    if (lowerName === 'color match' || lowerName === 'learn colors' || lowerName === 'learn about colors') startColorMatch(container);
    else if (lowerName === 'memory game') startMemoryGame(container);
    else if (lowerName === 'coloring book' || lowerName === 'online coloring' || lowerName === 'online coloring game') startColoringBook(container);
    else if (lowerName === 'animal coloring' || lowerName === 'animal coloring game') startAnimalColoring(container);
    else if (lowerName === 'pattern match' || lowerName === 'patternmatch') startPatternMatch(container);
    else if (lowerName === 'mood matcher' || lowerName === 'moodmatcher') startMoodMatch(container);
    else if (lowerName === 'learn emotions' || lowerName === 'learn about emotions') startLearnEmotions(container);
    else if (lowerName === 'shape match' || lowerName === 'learn shapes' || lowerName === 'learn about shapes') startShapeMatch(container);
    else if (lowerName === 'alphabet trace') startAlphabetTrace(container);
    else if (lowerName === 'number write') startNumberWrite(container);
    else if (lowerName === 'alphabet memory') startAlphabetMemory(container);
    else if (lowerName === 'word match') startWordMatch(container);
    else if (lowerName === 'halves match') startHalvesMatch(container);
    else if (lowerName === 'alphabet sort') startAbcSort(container);
    else if (lowerName === 'alphabet order') startAlphabetOrder(container);
    else if (lowerName === 'missing letter') startMissingLetter(container);
    else if (lowerName === 'word picture match') startWordPictureMatch(container);
    else if (lowerName === 'object search') startObjectSearch(container);
    else if (lowerName === 'spatial puzzle') startSpatialPuzzle(container);
    else if (lowerName === 'jigsaw puzzle') startJigsawPuzzle(container);
    else if (lowerName === 'advanced patterns') startAdvancedPatterns(container);
    else {
        console.error("Unknown game:", name);
        container.innerHTML = `<h3>Oops! Game "${name}" not found.</h3><br><button onclick="location.reload()" class="btn-blue">Reload Page</button>`;
    }
}
window.startGame = startGame;

// --- New Level 2 Game Functions ---

function startAlphabetTrace(container) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let currentIdx = 0;

    window.renderTraceLetter = (idx) => {
        const char = letters[idx];
        container.innerHTML = `
            <h3 style="text-align:center; margin-bottom: 20px;">Trace the Letter: <span style="font-size: 40px; color: var(--primary);">${char}</span></h3>
            <div style="text-align:center; background: white; padding: 20px; border-radius: 30px; border: 4px dashed var(--secondary); max-width: 400px; margin: 0 auto;">
                <canvas id="trace-canvas" width="300" height="300" style="cursor: crosshair; touch-action: none;"></canvas>
            </div>
            <div class="control-box">
                <button class="cute-btn btn-blue" onclick="renderTraceLetter(${currentIdx})"><span>🔄</span> Reset</button>
                <button class="cute-btn btn-green" onclick="nextTraceLetter()"><span>➡️</span> Next Letter</button>
                <button class="cute-btn btn-orange" onclick="finishGame()"><span>✅</span> Done</button>
            </div>
        `;
        initTracing();
    };

    window.nextTraceLetter = () => {
        gameScore += 10;
        document.getElementById('game-score').innerText = gameScore;
        currentIdx = (currentIdx + 1) % letters.length;
        renderTraceLetter(currentIdx);
    };

    function initTracing() {
        const canvas = document.getElementById('trace-canvas');
        const ctx = canvas.getContext('2d');
        let drawing = false;

        ctx.strokeStyle = '#8d6e63';
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.font = '250px Nunito';
        ctx.fillStyle = '#f0f0f0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letters[currentIdx], 150, 160);

        const startDraw = (e) => { drawing = true; draw(e); };
        const endDraw = () => { drawing = false; ctx.beginPath(); };
        const draw = (e) => {
            if (!drawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', endDraw);
        canvas.addEventListener('touchstart', startDraw);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', endDraw);
    }

    renderTraceLetter(currentIdx);
}

function startNumberWrite(container) {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    let currentIdx = 0;

    window.renderTraceNumber = (idx) => {
        const num = numbers[idx];
        container.innerHTML = `
            <h3 style="text-align:center; margin-bottom: 20px;">Write the Number: <span style="font-size: 40px; color: var(--primary);">${num}</span></h3>
            <div style="text-align:center; background: white; padding: 20px; border-radius: 30px; border: 4px dashed var(--secondary); max-width: 400px; margin: 0 auto;">
                <canvas id="trace-canvas" width="300" height="300" style="cursor: crosshair; touch-action: none;"></canvas>
            </div>
            <div class="control-box">
                <button class="cute-btn btn-blue" onclick="renderTraceNumber(${currentIdx})"><span>🔄</span> Reset</button>
                <button class="cute-btn btn-green" onclick="nextTraceNumber()"><span>➡️</span> Next Number</button>
                <button class="cute-btn btn-orange" onclick="finishGame()"><span>✅</span> Done</button>
            </div>
        `;
        initTracing();
    };

    window.nextTraceNumber = () => {
        gameScore += 10;
        document.getElementById('game-score').innerText = gameScore;
        currentIdx = (currentIdx + 1) % numbers.length;
        renderTraceNumber(currentIdx);
    };

    function initTracing() {
        const canvas = document.getElementById('trace-canvas');
        const ctx = canvas.getContext('2d');
        let drawing = false;

        ctx.strokeStyle = '#8d6e63';
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.font = '250px Nunito';
        ctx.fillStyle = '#f0f0f0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(numbers[currentIdx], 150, 160);

        const startDraw = (e) => { drawing = true; draw(e); };
        const endDraw = () => { drawing = false; ctx.beginPath(); };
        const draw = (e) => {
            if (!drawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', endDraw);
        canvas.addEventListener('touchstart', startDraw);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', endDraw);
    }

    renderTraceNumber(currentIdx);
}

function startAlphabetMemory(container) {
    const letters = [
        { u: 'A', l: 'a' }, { u: 'B', l: 'b' }, { u: 'C', l: 'c' }, { u: 'D', l: 'd' },
        { u: 'E', l: 'e' }, { u: 'F', l: 'f' }
    ];
    let cards = [];
    letters.forEach(pair => {
        cards.push({ val: pair.u, match: pair.l, type: 'upper' });
        cards.push({ val: pair.l, match: pair.u, type: 'lower' });
    });
    cards.sort(() => Math.random() - 0.5);

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    container.innerHTML = `
        <h3 style="text-align:center; margin-bottom: 25px;">Match Upper & Lower Case!</h3>
        <div id="memory-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; max-width: 500px; margin: 0 auto;">
            ${cards.map((card, i) => `
                <div class="card alphabet-card" id="abc-card-${i}" onclick="window.flipAbcCard(${i})" 
                     style="aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; font-size: 40px; cursor: pointer; background: var(--secondary); color: transparent; border-radius: 15px; border: 3px solid var(--primary);">
                    ${card.val}
                </div>
            `).join('')}
        </div>
        <div class="control-box">
            <button class="cute-btn btn-blue" onclick="startAlphabetMemory(document.getElementById('game-container'))"><span>🔄</span> Reset</button>
            <button class="cute-btn btn-orange" onclick="finishGame()"><span>✅</span> Done</button>
        </div>
    `;

    window.flipAbcCard = (i) => {
        if (lockBoard) return;
        const cardEl = document.getElementById(`abc-card-${i}`);
        if (cardEl.classList.contains('matched') || cardEl === firstCard) return;

        cardEl.style.color = 'var(--text)';
        cardEl.style.background = 'white';

        if (!firstCard) {
            firstCard = cardEl;
            return;
        }

        secondCard = cardEl;
        lockBoard = true;

        const val1 = firstCard.innerText.trim();
        const val2 = secondCard.innerText.trim();
        
        const isMatch = (val1.toUpperCase() === val2.toUpperCase() && val1 !== val2);

        if (isMatch) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            firstCard.style.background = '#d7ccc8';
            secondCard.style.background = '#d7ccc8';
            gameScore += 20;
            document.getElementById('game-score').innerText = gameScore;
            resetBoard();
        } else {
            setTimeout(() => {
                firstCard.style.color = 'transparent';
                firstCard.style.background = 'var(--secondary)';
                secondCard.style.color = 'transparent';
                secondCard.style.background = 'var(--secondary)';
                resetBoard();
            }, 1000);
        }
    };

    function resetBoard() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }
}

function startWordMatch(container) {
    const wordPairs = [
        { word: 'Apple', icon: '🍎' },
        { word: 'Dog', icon: '🐶' },
        { word: 'Sun', icon: '☀️' },
        { word: 'Book', icon: '📚' }
    ];
    let currentPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
    
    window.renderWordMatch = () => {
        currentPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
        const options = [...wordPairs].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <h3 style="text-align:center; margin-bottom: 20px;">Which picture matches the word?</h3>
            <div style="text-align:center; margin-bottom: 30px;">
                <button class="cute-btn btn-blue" onclick="speakWord('${currentPair.word}')" style="font-size: 30px; padding: 20px 40px;">
                    🔊 ${currentPair.word.toUpperCase()}
                </button>
            </div>
            <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                ${options.map(opt => `
                    <div onclick="checkWordMatch('${opt.word}', '${currentPair.word}')" class="card" style="width: 120px; height: 120px; font-size: 60px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        ${opt.icon}
                    </div>
                `).join('')}
            </div>
            <p id="feedback" style="text-align:center; font-size:24px; margin-top:30px; font-weight:bold; height:50px;"></p>
            <div class="control-box">
                <button class="cute-btn btn-blue" onclick="renderWordMatch()"><span>🔄</span> Next</button>
                <button class="cute-btn btn-orange" onclick="finishGame()"><span>✅</span> Done</button>
            </div>
        `;
    };

    window.speakWord = (word) => {
        const msg = new SpeechSynthesisUtterance();
        msg.text = word;
        window.speechSynthesis.speak(msg);
    };

    window.checkWordMatch = (selected, target) => {
        const feedback = document.getElementById('feedback');
        if (selected === target) {
            feedback.innerText = "Correct! 🌟";
            feedback.style.color = "var(--success)";
            gameScore += 15;
            document.getElementById('game-score').innerText = gameScore;
            setTimeout(renderWordMatch, 1500);
        } else {
            feedback.innerText = "Try again! 😊";
            feedback.style.color = "#e74c3c";
        }
    };

    renderWordMatch();
}

function startHalvesMatch(container) {
    const objects = [
        { icon: '🍎', left: '🍎', right: '🍎' }, // In real app, these would be split images
        { icon: '🐶', left: '🐶', right: '🐶' },
        { icon: '🚗', left: '🚗', right: '🚗' },
        { icon: '🏠', left: '🏠', right: '🏠' }
    ];
    
    window.renderHalves = () => {
        const target = objects[Math.floor(Math.random() * objects.length)];
        const options = [...objects].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <h3 style="text-align:center; margin-bottom: 20px;">Find the matching half!</h3>
            <div style="display: flex; justify-content: center; align-items: center; gap: 0; margin-bottom: 40px;">
                <div style="width: 100px; height: 200px; background: white; border: 4px solid var(--primary); border-right: none; border-radius: 20px 0 0 20px; display: flex; align-items: center; justify-content: center; font-size: 100px; overflow: hidden;">
                    <span style="margin-right: -100px;">${target.icon}</span>
                </div>
                <div style="width: 100px; height: 200px; background: #fafafa; border: 4px dashed var(--secondary); border-left: none; border-radius: 0 20px 20px 0; display: flex; align-items: center; justify-content: center; font-size: 100px; color: #eee;">
                    ?
                </div>
            </div>
            <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                ${options.map(opt => `
                    <div onclick="checkHalvesMatch('${opt.icon}', '${target.icon}')" class="card" style="width: 100px; height: 100px; font-size: 50px; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden;">
                        <span style="margin-left: -50px;">${opt.icon}</span>
                    </div>
                `).join('')}
            </div>
            <p id="feedback" style="text-align:center; font-size:24px; margin-top:30px; font-weight:bold; height:50px;"></p>
            <div class="control-box">
                <button class="cute-btn btn-blue" onclick="renderHalves()"><span>🔄</span> Next</button>
                <button class="cute-btn btn-orange" onclick="finishGame()"><span>✅</span> Done</button>
            </div>
        `;
    };

    window.checkHalvesMatch = (selected, target) => {
        const feedback = document.getElementById('feedback');
        if (selected === target) {
            feedback.innerText = "You completed it! 🌟";
            feedback.style.color = "var(--success)";
            gameScore += 15;
            document.getElementById('game-score').innerText = gameScore;
            setTimeout(renderHalves, 1500);
        } else {
            feedback.innerText = "Keep looking! 😊";
            feedback.style.color = "#e74c3c";
        }
    };

    renderHalves();
}

// --- Game Functions ---

function startAnimalColoring(container) {
    console.log("Starting Animal Coloring selection...");
    if (!animalTemplates || Object.keys(animalTemplates).length === 0) {
        console.error("No animal templates found!");
        container.innerHTML = "<h3>Sorry, no animals found! Please refresh the page.</h3>";
        return;
    }

    let animalCards = Object.keys(animalTemplates).map(name => {
        let icon = '🐾';
        if (name === 'Dog') icon = '🐶';
        else if (name === 'Cat') icon = '🐱';
        else if (name === 'Lion') icon = '🦁';
        else if (name === 'Bunny') icon = '🐰';
        else if (name === 'Fish') icon = '🐠';
        
        return `
        <div onclick="window.selectAnimalTemplate('${name}')" class="card" style="cursor:pointer; width:130px; text-align:center; padding: 15px; border-radius: 20px; background: white; border: 3px solid #eee;">
            <span style="font-size:50px; display: block; margin-bottom: 10px;">${icon}</span>
            <p style="font-weight: bold; margin: 0;">${name}</p>
        </div>`;
    }).join('');

    container.innerHTML = `
        <h3 style="text-align:center; margin-bottom: 20px; color: var(--primary);">Pick an animal friend to color!</h3>
        <div style="display:flex; justify-content:center; gap:20px; margin-top:20px; flex-wrap: wrap; padding: 20px;">
            ${animalCards}
        </div>
        <div style="text-align:center; margin-top: 30px;">
            <button onclick="window.location.href='/activities'" class="btn-kids" style="background: #95a5a6;">Go Back</button>
        </div>
    `;
}

function selectAnimalTemplate(name) {
    const container = document.getElementById('game-container');
    const templateSvg = animalTemplates[name];
    const referenceSvg = templateSvg.replace(/data-ref-fill="([^"]+)"/g, 'fill="$1"');
    const drawingSvg = templateSvg.replace(/data-ref-fill="([^"]+)"/g, (match, p1) => {
        if (p1 === 'none') return 'fill="none"';
        return 'fill="#fff" class="block-to-color" onclick="window.colorBlock(this)"';
    });

    const palette = [
        '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
        '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', 
        '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', 
        '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40',
        '#8D6E63', '#9E9E9E', '#CFD8DC', '#000000', '#FFFFFF'
    ];

    container.innerHTML = `
        <div style="display: flex; gap: 30px; align-items: flex-start; justify-content: center; flex-wrap: wrap;">
            <div style="text-align:center; border: 3px solid #eee; padding: 15px; border-radius: 20px; background: #fff; width: 150px;">
                <p style="font-size:14px; font-weight: bold; margin:0 0 10px 0;">Look at this!</p>
                <svg width="120" height="120" viewBox="0 0 200 200">${referenceSvg}</svg>
            </div>
            <div style="text-align:center; flex-grow: 1; min-width: 300px;">
                <svg width="400" height="400" viewBox="0 0 200 200" style="background:#fff; border-radius:30px; border: 6px dashed #ddd; box-shadow: inset 0 0 15px rgba(0,0,0,0.05);">${drawingSvg}</svg>
            </div>
        </div>
        
        <p style="text-align:center; margin-top: 25px; font-weight: bold; color: var(--text);">Step 1: Click a color ⬇️ | Step 2: Click the animal 🎨</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(45px, 1fr)); gap:12px; margin-top:15px; background: #fff; padding: 20px; border-radius: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-width: 600px; margin-left: auto; margin-right: auto;">
            ${palette.map(c => `
                <div class="color-swatch" 
                     style="background-color:${c}; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; border: 4px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s;" 
                     onclick="window.selectPaletteColor('${c}', this)">
                </div>
            `).join('')}
        </div>
        
        <div class="control-box" style="margin-top: 30px;">
            <button class="cute-btn btn-pink" onclick="window.startAnimalColoring(document.getElementById('game-container'))"><span>🔙</span> Different Animal</button>
            <button class="cute-btn btn-blue" onclick="window.selectAnimalTemplate('${name}')"><span>🔄</span> Start Over</button>
            <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> I'm Finished!</button>
        </div>
    `;
    const firstSwatch = document.querySelector('.color-swatch');
    if (firstSwatch) window.selectPaletteColor(palette[0], firstSwatch);
}

function startLearnEmotions(container) {
    const basicEmotions = [
        { name: 'Happy', emoji: '😊', color: '#f1c40f' },
        { name: 'Sad', emoji: '😢', color: '#3498db' },
        { name: 'Angry', emoji: '😠', color: '#e74c3c' },
        { name: 'Silly', emoji: '😜', color: '#9b59b6' }
    ];
    
    const target = basicEmotions[Math.floor(Math.random() * basicEmotions.length)];
    const options = [...basicEmotions].sort(() => 0.5 - Math.random());
    
    container.innerHTML = `
        <h3 style="text-align:center; margin-bottom: 20px; color: var(--primary); font-size: 24px;">Can you find the <span style="color:${target.color}">${target.name.toUpperCase()}</span> face?</h3>
        
        <div style="text-align:center; margin-bottom: 20px; font-size: 80px;">
            ${target.emoji}
        </div>

        <div style="display:flex; justify-content:center; gap:20px; flex-wrap:wrap; margin-top:20px;">
            ${options.map(m => `
                <div onclick="window.checkBasicEmotion('${m.name}', '${target.name}')" 
                     class="card"
                     style="width:140px; padding: 20px; cursor:pointer; border-radius: 20px; text-align:center; background: #fff; border: 3px solid #eee;">
                     <h4 style="margin:0; font-size: 24px;">${m.name}</h4>
                </div>
            `).join('')}
        </div>
        <p id="feedback" style="text-align:center; font-size:24px; margin-top:30px; font-weight:bold; height:50px;"></p>
        
        <div class="control-box">
            <button class="cute-btn btn-pink" onclick="window.closeGame()"><span>🔙</span> Back</button>
            <button class="cute-btn btn-blue" onclick="window.startLearnEmotions(document.getElementById('game-container'))"><span>🔄</span> Next</button>
            <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> I'm Done!</button>
        </div>
    `;
}

window.checkBasicEmotion = function(selected, target) {
    const feedback = document.getElementById('feedback');
    if (selected === target) {
        feedback.innerText = "Yay! You got it! 🌟";
        feedback.style.color = "#2ecc71";
        gameScore += 10;
        document.getElementById('game-score').innerText = gameScore;
        setTimeout(() => startLearnEmotions(document.getElementById('game-container')), 1500);
    } else {
        feedback.innerText = "Not quite, try again! 😊";
        feedback.style.color = "#e74c3c";
    }
};

function startShapeMatch(container) {
    const shapes = [
        { name: 'Circle', icon: '🔴' },
        { name: 'Square', icon: '🟧' },
        { name: 'Triangle', icon: '🔺' },
        { name: 'Star', icon: '⭐' },
        { name: 'Heart', icon: '❤️' },
        { name: 'Moon', icon: '🌙' }
    ];
    const target = shapes[Math.floor(Math.random() * shapes.length)];
    const options = [...shapes].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <h3 style="text-align:center; margin-bottom: 30px;">Can you find the <span style="color:var(--primary); font-weight:bold; font-size:28px;">${target.name.toUpperCase()}</span>?</h3>
        
        <div style="display:flex; justify-content:center; gap:25px; flex-wrap:wrap; margin-top:20px;">
            ${options.map(s => `
                <div onclick="window.checkShape('${s.name}', '${target.name}')" 
                     class="game-shape">
                     ${s.icon}
                </div>
            `).join('')}
        </div>
        <p id="feedback" style="text-align:center; font-size:24px; margin-top:30px; font-weight:bold; height:50px;"></p>
        
        <div class="control-box">
            <button class="cute-btn btn-pink" onclick="window.closeGame()"><span>🔙</span> Back</button>
            <button class="cute-btn btn-blue" onclick="window.startShapeMatch(document.getElementById('game-container'))"><span>🔄</span> Shuffle</button>
            <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> All Done!</button>
        </div>
    `;
}

window.checkShape = function(selected, target) {
    const feedback = document.getElementById('feedback');
    if (selected === target) {
        feedback.innerText = "Correct! You found the " + target + "! 🌟";
        feedback.style.color = "#2ecc71";
        gameScore += 10;
        document.getElementById('game-score').innerText = gameScore;
        setTimeout(() => startShapeMatch(document.getElementById('game-container')), 1200);
    } else {
        feedback.innerText = "Not that one. Try again! 🤔";
        feedback.style.color = "#e74c3c";
    }
};

function startPatternMatch(container) {
    const emojiSets = [
        ['🍎', '🍌'], ['🐶', '🐱'], ['☀️', '🌙'], ['🚗', '🚲'], ['🎈', '🎁'], ['🍦', '🍰']
    ];
    const set = emojiSets[Math.floor(Math.random() * emojiSets.length)];
    const pattern = [set[0], set[1], set[0], set[1]];
    const target = set[0];
    const options = [...set].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <h3 style="text-align:center; margin-bottom: 30px; color: var(--primary); font-size: 24px;">What comes next in the pattern?</h3>
        <div style="display:flex; justify-content:center; align-items:center; gap:15px; margin-bottom:40px; background: #f9f9f9; padding: 20px; border-radius: 20px; border: 2px dashed #ddd;">
            <div style="font-size: 60px;">${pattern[0]}</div>
            <div style="font-size: 40px; color: #ccc;">➡️</div>
            <div style="font-size: 60px;">${pattern[1]}</div>
            <div style="font-size: 40px; color: #ccc;">➡️</div>
            <div style="font-size: 60px;">${pattern[2]}</div>
            <div style="font-size: 40px; color: #ccc;">➡️</div>
            <div style="font-size: 60px;">${pattern[3]}</div>
            <div style="font-size: 40px; color: #ccc;">➡️</div>
            <div style="font-size: 60px; width: 80px; height: 80px; border: 4px solid var(--primary); border-radius: 15px; display: flex; align-items: center; justify-content: center; background: #fff; color: #eee;">?</div>
        </div>
        <div style="display:flex; justify-content:center; gap:25px; flex-wrap:wrap; margin-top:20px;">
            ${options.map(emoji => `
                <div onclick="window.checkPattern('${emoji}', '${target}')" 
                     class="card"
                     style="width:110px; height:110px; display: flex; align-items: center; justify-content: center; font-size: 50px; cursor:pointer; border-radius: 24px; transition: transform 0.2s;">
                     ${emoji}
                </div>
            `).join('')}
        </div>
        <p id="feedback" style="text-align:center; font-size:24px; margin-top:30px; font-weight:bold; height:50px;"></p>
        <div class="control-box">
            <button class="cute-btn btn-pink" onclick="window.closeGame()"><span>🔙</span> Back</button>
            <button class="cute-btn btn-blue" onclick="window.startPatternMatch(document.getElementById('game-container'))"><span>🔄</span> New Pattern</button>
            <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> I'm Done!</button>
        </div>
    `;
}

window.checkPattern = function(selected, target) {
    const feedback = document.getElementById('feedback');
    if (selected === target) {
        feedback.innerText = "Wow! You're so smart! 🌟";
        feedback.style.color = "#2ecc71";
        gameScore += 10;
        document.getElementById('game-score').innerText = gameScore;
        const placeholders = document.querySelectorAll('#game-container div');
        placeholders.forEach(div => {
            if (div.innerText === '?') {
                div.innerText = target;
                div.style.color = '#000';
                div.style.borderColor = '#2ecc71';
            }
        });
        setTimeout(() => startPatternMatch(document.getElementById('game-container')), 1500);
    } else {
        feedback.innerText = "Not quite, try looking at the sequence again! 😊";
        feedback.style.color = "#e74c3c";
    }
};

function startColorMatch(container) {
    const colors = [
        { name: 'Red', color: '#e74c3c' }, { name: 'Blue', color: '#3498db' }, { name: 'Green', color: '#2ecc71' },
        { name: 'Yellow', color: '#f1c40f' }, { name: 'Purple', color: '#9b59b6' }, { name: 'Orange', color: '#e67e22' }
    ];
    const target = colors[Math.floor(Math.random() * colors.length)];
    
    container.innerHTML = `
        <h3 style="text-align:center; margin-bottom: 30px;">Pick the <span style="color:${target.color}; font-weight:bold; font-size:28px;">${target.name.toUpperCase()}</span> block!</h3>
        <div style="display:flex; justify-content:center; gap:25px; flex-wrap:wrap; margin-top:20px;">
            ${colors.map(c => `
                <div onclick="window.checkColor('${c.name}', '${target.name}')" 
                     style="width:110px; height:110px; background-color:${c.color}; border-radius:24px; cursor:pointer; box-shadow: 0 8px 0 rgba(0,0,0,0.1);">
                </div>
            `).join('')}
        </div>
        <p id="feedback" style="text-align:center; font-size:24px; margin-top:30px; font-weight:bold; height:50px;"></p>
        <div class="control-box">
            <button class="cute-btn btn-pink" onclick="window.closeGame()"><span>🔙</span> Back</button>
            <button class="cute-btn btn-blue" onclick="window.startColorMatch(document.getElementById('game-container'))"><span>🔄</span> Shuffle</button>
            <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> All Done!</button>
        </div>
    `;
}

window.checkColor = function(selected, target) {
    const feedback = document.getElementById('feedback');
    if (selected === target) {
        feedback.innerText = "Correct! You're a Color Master! 🎨";
        feedback.style.color = "#2ecc71";
        gameScore += 10;
        document.getElementById('game-score').innerText = gameScore;
        setTimeout(() => startColorMatch(document.getElementById('game-container')), 1200);
    } else {
        feedback.innerText = "Oops! Not that one. Try again!";
        feedback.style.color = "#e74c3c";
    }
};

let flippedCards = [];
function startMemoryGame(container) {
    const items = ['😊', '😢', '🐶', '🐱'];
    const bonus = '⭐';
    let deck = [...items, ...items, bonus];
    deck.sort(() => Math.random() - 0.5);
    const cardGradients = [
        'linear-gradient(135deg, #ff7eb3, #ff758c)', 'linear-gradient(135deg, #4facfe, #00f2fe)',
        'linear-gradient(135deg, #43e97b, #38f9d7)', 'linear-gradient(135deg, #fa709a, #fee140)',
        'linear-gradient(135deg, #667eea, #764ba2)', 'linear-gradient(135deg, #f093fb, #f5576c)',
        'linear-gradient(135deg, #5ee7df, #b490ca)', 'linear-gradient(135deg, #c3cfe2, #c3cfe2)',
        'linear-gradient(135deg, #f6d365, #fda085)'
    ];
    flippedCards = [];
    container.innerHTML = `
        <h3 style="text-align:center; margin-bottom: 25px; color: var(--primary); font-size: 24px;">Find the 4 pairs + The Magic Star!</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 420px; width: 100%; margin: 0 auto;">
            ${deck.map((item, index) => `
                <div class="memory-card" id="card-${index}" onclick="window.flipCard(${index}, '${item}')" 
                     style="aspect-ratio: 1/1; background: ${cardGradients[index % cardGradients.length]}; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 60px; cursor: pointer; transition: all 0.4s; box-shadow: 0 8px 15px rgba(0,0,0,0.15);">
                     <span class="content hidden">${item}</span>
                </div>
            `).join('')}
        </div>
        <p id="feedback" style="text-align:center; font-size:22px; margin-top:25px; font-weight:bold; height:50px;"></p>
        <div class="control-box">
            <button class="cute-btn btn-pink" onclick="window.closeGame()"><span>🔙</span> Back</button>
            <button class="cute-btn btn-blue" onclick="window.startMemoryGame(document.getElementById('game-container'))"><span>🔄</span> Shuffle</button>
            <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> All Done!</button>
        </div>
    `;
}

window.flipCard = function(index, item) {
    const card = document.getElementById(`card-${index}`);
    const content = card.querySelector('.content');
    const feedback = document.getElementById('feedback');
    if (card.classList.contains('matched') || !content.classList.contains('hidden') || flippedCards.length >= 2) return;
    if (item === '⭐') {
        content.classList.remove('hidden');
        card.style.background = 'linear-gradient(135deg, #fff95b, #ff930f)';
        card.classList.add('matched');
        feedback.innerText = "You found the Magic Star! +50 Points! 🌟";
        feedback.style.color = "#f39c12";
        gameScore += 50;
        document.getElementById('game-score').innerText = gameScore;
        return;
    }
    content.classList.remove('hidden');
    card.style.background = '#ffffff';
    flippedCards.push({ index, item });
    if (flippedCards.length === 2) setTimeout(checkMatch, 800);
};

function checkMatch() {
    const [c1, c2] = flippedCards;
    const card1 = document.getElementById(`card-${c1.index}`);
    const card2 = document.getElementById(`card-${c2.index}`);
    const feedback = document.getElementById('feedback');
    if (c1.item === c2.item) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        card1.style.background = 'linear-gradient(135deg, #43e97b, #38f9d7)';
        card2.style.background = 'linear-gradient(135deg, #43e97b, #38f9d7)';
        feedback.innerText = "Match found! 🎉";
        feedback.style.color = "#2ecc71";
        gameScore += 20;
    } else {
        card1.querySelector('.content').classList.add('hidden');
        card2.querySelector('.content').classList.add('hidden');
        card1.style.background = '';
        card2.style.background = '';
        feedback.innerText = "Not a match, try again!";
        feedback.style.color = "#e74c3c";
    }
    document.getElementById('game-score').innerText = gameScore;
    flippedCards = [];
}

let selectedBrushColor = '#f1c40f';
function startColoringBook(container) {
    container.innerHTML = `
        <h3 style="text-align:center;">Choose a picture to color!</h3>
        <div style="display:flex; justify-content:center; gap:20px; margin-top:20px;">
            ${Object.keys(coloringTemplates).map(name => `
                <div onclick="window.selectTemplate('${name}')" class="card" style="cursor:pointer; width:120px; text-align:center;">
                    <span style="font-size:40px;">${name === 'House' ? '🏠' : name === 'Flower' ? '🌸' : '🚗'}</span>
                    <p>${name}</p>
                </div>
            `).join('')}
        </div>
    `;
}

window.selectTemplate = function(name) {
    const container = document.getElementById('game-container');
    const templateSvg = coloringTemplates[name];
    const referenceSvg = templateSvg.replace(/data-ref-fill="([^"]+)"/g, 'fill="$1"');
    const drawingSvg = templateSvg.replace(/data-ref-fill="([^"]+)"/g, 'fill="#fff" class="block-to-color" onclick="window.colorBlock(this)"');
    container.innerHTML = `
        <div style="display: flex; gap: 30px; align-items: flex-start; justify-content: center;">
            <div style="text-align:center; border: 2px solid #ddd; padding: 10px; border-radius: 15px; background: #fff; width: 120px;">
                <p style="font-size:12px; margin:0 0 5px 0;">Reference</p>
                <svg width="100" height="100" viewBox="0 0 200 200">${referenceSvg}</svg>
            </div>
            <div style="text-align:center; flex-grow: 1;">
                <svg width="350" height="350" viewBox="0 0 200 200" style="background:#fff; border-radius:20px; border: 4px dashed #aaa;">${drawingSvg}</svg>
            </div>
        </div>
        <div style="display:flex; justify-content:center; gap:10px; margin-top:20px; background: #fff; padding: 15px; border-radius: 50px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
            ${['#f1c40f', '#f39c12', '#e74c3c', '#34495e', '#95a5a6', '#2ecc71', '#3498db', '#ecf0f1', '#333'].map(c => `
                <div class="color-swatch" style="background-color:${c}; width: 45px; height: 45px;" onclick="window.selectPaletteColor('${c}', this)"></div>
            `).join('')}
        </div>
        <div class="control-box">
            <button class="cute-btn btn-pink" onclick="window.startColoringBook(document.getElementById('game-container'))"><span>🔙</span> Back</button>
            <button class="cute-btn btn-blue" onclick="window.selectTemplate('${name}')"><span>🔄</span> Reset</button>
            <button class="cute-btn btn-green" onclick="window.nextImage('${name}')"><span>➡️</span> Next</button>
            <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> Done</button>
        </div>
    `;
    const firstSwatch = document.querySelector('.color-swatch');
    if (firstSwatch) window.selectPaletteColor('#f1c40f', firstSwatch);
};

window.selectPaletteColor = function(color, element) {
    selectedBrushColor = color;
    document.querySelectorAll('.color-swatch').forEach(s => s.style.border = 'none');
    element.style.border = '3px solid #333';
};

window.colorBlock = function(element) {
    element.setAttribute('fill', selectedBrushColor);
    gameScore += 5;
    document.getElementById('game-score').innerText = gameScore;
};

window.nextImage = function(currentName) {
    const keys = Object.keys(coloringTemplates);
    const currentIndex = keys.indexOf(currentName);
    const nextIndex = (currentIndex + 1) % keys.length;
    window.selectTemplate(keys[nextIndex]);
};

function closeGame() {
    window.location.href = '/activities';
}

function restartGame() {
    startGame(activeGame);
}

async function finishGame() {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const res = await fetch('/activities/log-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            child_id: selectedChildId,
            activity_name: activeGame,
            score: gameScore,
            duration_seconds: duration
        })
    });
    if (res.ok) {
        alert(`Great Job! You scored ${gameScore} points! 🎉`);
        window.location.href = '/activities';
    }
}

let currentQuizType = "";
let currentQuestionIndex = 0;
let quizScore = 0;

function startNewQuiz(type) {
    if (!selectedChildId) return alert("Please select a child profile first.");
    currentQuizType = type;
    currentQuestionIndex = 0;
    quizScore = 0;
    document.getElementById('quiz-selection').classList.add('hidden');
    document.getElementById('quiz-area').classList.remove('hidden');
    document.getElementById('quiz-content').classList.remove('hidden');
    document.getElementById('quiz-results').classList.add('hidden');
    document.getElementById('current-quiz-name').innerText = type;
    loadQuizQuestion();
}

function loadQuizQuestion() {
    const questions = quizData[currentQuizType];
    const q = questions[currentQuestionIndex];
    document.getElementById('question-counter').innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    document.getElementById('quiz-question-text').innerText = q.question;
    const progress = (currentQuestionIndex / questions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    
    // Reset feedback
    const feedback = document.getElementById('quiz-feedback');
    if (feedback) feedback.innerText = "";

    const optionsGrid = document.getElementById('quiz-options-grid');
    optionsGrid.innerHTML = '';
    q.options.forEach(opt => {
        const div = document.createElement('div');
        div.className = 'card quiz-option';
        div.innerHTML = `<span>${opt.text.split(' ').pop()}</span><p>${opt.text.split(' ').slice(0, -1).join(' ')}</p>`;
        div.onclick = () => window.selectQuizOption(opt.correct, div);
        optionsGrid.appendChild(div);
    });
}

window.selectQuizOption = function(isCorrect, element) {
    const feedback = document.getElementById('quiz-feedback');
    if (isCorrect) {
        quizScore++;
        if (feedback) {
            feedback.innerText = "Correct! Great thinking! 🌟";
            feedback.style.color = "var(--success)";
        }
        element.style.borderColor = "var(--success)";
        element.style.background = "#e8f5e9";
        
        // Disable all options during the transition
        document.querySelectorAll('.quiz-option').forEach(opt => opt.onclick = null);

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData[currentQuizType].length) {
                loadQuizQuestion();
            } else {
                finishQuiz();
            }
        }, 1500);
    } else {
        if (feedback) {
            feedback.innerText = "Not quite. Let's try again! 👍";
            feedback.style.color = "#e74c3c";
        }
        element.style.borderColor = "#e74c3c";
        element.style.opacity = "0.7";
        // Do NOT increment index, allowing retry
    }
};

async function finishQuiz() {
    const total = quizData[currentQuizType].length;
    // Every question was eventually answered correctly
    const finalScore = total; 

    await fetch('/activities/log-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            child_id: selectedChildId,
            quiz_name: currentQuizType,
            score: finalScore,
            total_questions: total
        })
    });
    document.getElementById('progress-fill').style.width = `100%`;
    document.getElementById('quiz-content').classList.add('hidden');
    document.getElementById('quiz-results').classList.remove('hidden');
    document.getElementById('final-score-text').innerText = `Amazing! You completed all ${total} questions! 🎉`;
}

async function loadChildrenForDashboard() {
    if (!userId) return;
    const res = await fetch(`/auth/children/${userId}`);
    const children = await res.json();
    const select = document.getElementById('dashboard-child-select');
    if (!select) return;
    select.innerHTML = '<option value="">Select Child</option>';
    children.forEach(c => {
        const isSelected = selectedChildId == c.id ? 'selected' : '';
        select.innerHTML += `<option value="${c.id}" ${isSelected}>${c.name}</option>`;
    });
    if (selectedChildId) loadProgress();
}

function getLevelInfo(child) {
    let level = 1;
    if (typeof child === 'number') {
        level = child;
    } else if (child && typeof child === 'object') {
        level = child.level || 1;
    }
    
    if (level === 3) return { level: 3, name: "Level 3: Advanced (10+ or High-Risk)", desc: "Complex emotions and mood analysis.", theme: "purple" };
    if (level === 2) return { level: 2, name: "Level 2: Intermediate (7-9 or History)", desc: "Patterns and alphabetical logic.", theme: "sand" };
    return { level: 1, name: "Level 1: Basic (3-6)", desc: "Colors, shapes, and basic emotions.", theme: "orange" };
}

async function syncChildAge() {
    const childId = localStorage.getItem('selectedChildId');
    if (!childId || !userId) return;
    try {
        const res = await fetch(`/auth/children/${userId}`);
        const children = await res.json();
        const child = children.find(c => c.id == childId);
        if (child) {
            localStorage.setItem('selectedChildAge', child.age);
            localStorage.setItem('selectedChildSensory', child.sensory_level);
            applySensoryUI(child.sensory_level);
        }
    } catch (err) { console.error("Failed to sync child age:", err); }
}

async function loadProgress() {
    const select = document.getElementById('dashboard-child-select');
    if (!select) return;
    const childId = select.value;
    if (!childId) return;
    localStorage.setItem('selectedChildId', childId);
    const resChild = await fetch(`/auth/children/${userId}`);
    const children = await resChild.json();
    const child = children.find(c => c.id == childId);
    if (child) {
        localStorage.setItem('selectedChildAge', child.age);
        localStorage.setItem('selectedChildLevel', child.level || 1);
        const levelInfo = getLevelInfo(child);
        const levelDisplay = document.getElementById('dashboard-level-display');
        if (levelDisplay) {
            levelDisplay.innerHTML = `
                <div class="card theme-${levelInfo.theme}" style="margin-bottom: 30px;">
                    <h3>🌟 Current Level: ${levelInfo.name}</h3>
                    <p style="font-weight: 700; color: #4e342e;">${levelInfo.desc}</p>
                </div>
            `;
        }
    }
    const resAct = await fetch(`/dashboard/progress/${childId}`);
    const data = await resAct.json();
    const ctxAct = document.getElementById('activitiesChart');
    if (ctxAct) {
        new Chart(ctxAct.getContext('2d'), {
            type: 'bar',
            data: {
                labels: data.activities.map(a => a.name),
                datasets: [{ label: 'Avg Score', data: data.activities.map(a => a.avg_score), backgroundColor: '#8d6e63' }]
            }
        });
    }
    const ctxEmo = document.getElementById('emotionChart');
    if (ctxEmo) {
        new Chart(ctxEmo.getContext('2d'), {
            type: 'pie',
            data: {
                labels: data.emotions.map(e => e.emotion),
                datasets: [{ data: data.emotions.map(e => e.count), backgroundColor: ['#8d6e63', '#d6c6a2', '#a1887f', '#d7ccc8', '#bcaaa4', '#efebe9'] }]
            }
        });
    }
}

async function generateReport() {
    const select = document.getElementById('dashboard-child-select');
    if (!select) return;
    const childId = select.value;
    if (!childId) return alert("Select child.");
    const res = await fetch(`/dashboard/generate-report/${childId}`);
    const data = await res.json();
    const reportLink = document.getElementById('report-link');
    if (reportLink) reportLink.innerHTML = `<a href="${data.report_url}" target="_blank">View Report PDF</a>`;
}

async function saveDiary() {
    if (!userId) return alert("Login first.");
    const titleVal = document.getElementById('diary-title');
    const msgVal = document.getElementById('diary-message');
    if (!titleVal || !msgVal) return;
    const title = titleVal.value;
    const message = msgVal.value;
    const fileInput = document.getElementById('diary-upload');
    const file = fileInput ? fileInput.files[0] : null;
    const formData = new FormData();
    formData.append('parent_id', userId);
    formData.append('child_name', "Child");
    formData.append('title', title);
    formData.append('message', message);
    if (file) formData.append('file', file);
    const res = await fetch('/diary/add', { method: 'POST', body: formData });
    if (res.ok) {
        alert("Memory Saved!");
        loadDiary();
        titleVal.value = '';
        msgVal.value = '';
    }
}

async function loadDiary() {
    if (!userId) return;
    const res = await fetch(`/diary/${userId}`);
    const diary = await res.json();
    const list = document.getElementById('diary-timeline');
    if (!list) return;
    list.innerHTML = '';
    diary.forEach(e => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<h3>${e.title}</h3><p>${e.message}</p><em>${e.timestamp}</em>`;
        if (e.image_path) div.innerHTML += `<br><img src="/${e.image_path}" style="max-width:200px; border-radius:10px;">`;
        list.appendChild(div);
    });
}

function startMoodMatch(container) {
    const moods = [
        { name: 'Happy', emoji: '😊', color: '#f1c40f' }, { name: 'Sad', emoji: '😢', color: '#3498db' },
        { name: 'Angry', emoji: '😠', color: '#e74c3c' }, { name: 'Surprised', emoji: '😲', color: '#9b59b6' },
        { name: 'Scared', emoji: '😨', color: '#2ecc71' }, { name: 'Sleepy', emoji: '😴', color: '#95a5a6' }
    ];
    const shuffled = [...moods].sort(() => 0.5 - Math.random());
    const options = shuffled.slice(0, 3);
    const target = options[Math.floor(Math.random() * options.length)];
    container.innerHTML = `
        <h3 style="text-align:center; margin-bottom: 20px; color: var(--primary); font-size: 24px;">How is the friend feeling?</h3>
        <div style="text-align:center; margin-bottom: 40px;"><div style="font-size: 120px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));">${target.emoji}</div></div>
        <div style="display:flex; justify-content:center; gap:20px; flex-wrap:wrap; margin-top:20px;">
            ${options.map(m => `<div onclick="window.checkMood('${m.name}', '${target.name}')" class="card" style="width:140px; padding: 20px; cursor:pointer; border-radius: 20px; text-align:center; background: #fff; border: 3px solid #eee; transition: all 0.2s;"><h4 style="margin:0; font-size: 20px; color: var(--text);">${m.name}</h4></div>`).join('')}
        </div>
        <p id="feedback" style="text-align:center; font-size:24px; margin-top:30px; font-weight:bold; height:50px;"></p>
        <div class="control-box">
            <button class="cute-btn btn-pink" onclick="window.closeGame()"><span>🔙</span> Back</button>
            <button class="cute-btn btn-blue" onclick="window.startMoodMatch(document.getElementById('game-container'))"><span>🔄</span> Next One</button>
            <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> I'm Done!</button>
        </div>
    `;
}

window.checkMood = function(selected, target) {
    const feedback = document.getElementById('feedback');
    if (selected === target) {
        feedback.innerText = "Yes! That's exactly right! 🌟";
        feedback.style.color = "#2ecc71";
        gameScore += 15;
        document.getElementById('game-score').innerText = gameScore;
        setTimeout(() => startMoodMatch(document.getElementById('game-container')), 1500);
    } else {
        feedback.innerText = "Not quite. Look closely at the face! 😊";
        feedback.style.color = "#e74c3c";
    }
};

// --- Level 3 Advanced Game Functions ---

function startAbcSort(container) {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const lowercase = "abcdefghijklmnopqrstuvwxyz".split("");
    let currentSet = [];
    
    window.renderAbcSort = () => {
        // Pick 4 random pairs
        const indices = [];
        while(indices.length < 4) {
            const r = Math.floor(Math.random() * 26);
            if(!indices.includes(r)) indices.push(r);
        }
        
        const items = [];
        indices.forEach(i => {
            items.push({ val: uppercase[i], type: 'upper' });
            items.push({ val: lowercase[i], type: 'lower' });
        });
        
        items.sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <h3 style="text-align:center; margin-bottom: 20px;">Sort into Upper and Lower Case</h3>
            <div style="display: flex; justify-content: space-around; width: 100%; margin-bottom: 30px;">
                <div id="upper-bin" ondrop="window.drop(event, 'upper')" ondragover="window.allowDrop(event)" 
                     style="width: 200px; min-height: 250px; background: #e3f2fd; border: 4px dashed #2196f3; border-radius: 20px; padding: 15px; text-align: center;">
                    <h4 style="color: #1976d2;">UPPER CASE</h4>
                    <div class="bin-content" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;"></div>
                </div>
                <div id="lower-bin" ondrop="window.drop(event, 'lower')" ondragover="window.allowDrop(event)" 
                     style="width: 200px; min-height: 250px; background: #f1f8e9; border: 4px dashed #4caf50; border-radius: 20px; padding: 15px; text-align: center;">
                    <h4 style="color: #388e3c;">lower case</h4>
                    <div class="bin-content" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;"></div>
                </div>
            </div>
            <div id="source-bin" style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; background: #fff; padding: 20px; border-radius: 20px; border: 2px solid #eee; min-height: 100px; width: 80%;">
                ${items.map((item, i) => `
                    <div id="drag-${i}" draggable="true" ondragstart="window.drag(event)" data-type="${item.type}"
                         style="width: 50px; height: 50px; background: white; border: 2px solid #ccc; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: move; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        ${item.val}
                    </div>
                `).join('')}
            </div>
            <p id="feedback" style="text-align:center; font-size:24px; margin-top:30px; font-weight:bold; height:50px;"></p>
            <div class="control-box">
                <button class="cute-btn btn-blue" onclick="window.renderAbcSort()"><span>🔄</span> New Letters</button>
                <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> Done</button>
            </div>
        `;
    };

    window.allowDrop = (ev) => ev.preventDefault();
    window.drag = (ev) => {
        ev.dataTransfer.setData("text", ev.target.id);
        ev.dataTransfer.setData("type", ev.target.getAttribute("data-type"));
    };
    window.drop = (ev, binType) => {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("text");
        const itemType = ev.dataTransfer.getData("type");
        const draggedEl = document.getElementById(data);
        const feedback = document.getElementById('feedback');

        if (itemType === binType) {
            let bin = ev.target;
            if (!bin.classList.contains('bin-content')) {
                bin = bin.querySelector('.bin-content') || bin.closest('div').querySelector('.bin-content');
            }
            bin.appendChild(draggedEl);
            draggedEl.setAttribute("draggable", "false");
            draggedEl.style.cursor = "default";
            gameScore += 10;
            const scoreEl = document.getElementById('game-score');
            if (scoreEl) scoreEl.innerText = gameScore;
            
            const sourceBin = document.getElementById('source-bin');
            if (sourceBin && sourceBin.children.length === 0) {
                feedback.innerText = "Great sorting! 🌟";
                feedback.style.color = "var(--success)";
                setTimeout(window.renderAbcSort, 1500);
            }
        } else {
            feedback.innerText = "Try the other bin! 😊";
            feedback.style.color = "var(--danger)";
            setTimeout(() => feedback.innerText = "", 1500);
        }
    };

    window.renderAbcSort();
}

function startMissingLetter(container) {
    const words = [
        { word: 'APPLE', missing: 0, icon: '🍎' },
        { word: 'BREAD', missing: 2, icon: '🍞' },
        { word: 'CANDY', missing: 1, icon: '🍬' },
        { word: 'DRESS', missing: 3, icon: '👗' },
        { word: 'EARTH', missing: 4, icon: '🌍' },
        { word: 'FROGS', missing: 2, icon: '🐸' }
    ];

    window.renderMissingLetter = () => {
        const target = words[Math.floor(Math.random() * words.length)];
        const wordArr = target.word.split("");
        const correctLetter = wordArr[target.missing];
        wordArr[target.missing] = "_";
        
        // Generate options including correct one
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const options = [correctLetter];
        while(options.length < 4) {
            const r = alphabet[Math.floor(Math.random() * 26)];
            if(!options.includes(r)) options.push(r);
        }
        options.sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <h3 style="text-align:center; margin-bottom: 20px;">Fill in the missing letter!</h3>
            <div style="text-align:center; margin-bottom: 30px;">
                <span style="font-size: 80px; display: block; margin-bottom: 10px;">${target.icon}</span>
                <div style="font-size: 60px; letter-spacing: 15px; font-weight: 800; color: var(--primary);">
                    ${wordArr.join("")}
                </div>
            </div>
            <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                ${options.map(letter => `
                    <button onclick="window.checkMissingLetter('${letter}', '${correctLetter}')" 
                            class="cute-btn btn-blue" style="font-size: 30px; width: 70px; height: 70px; padding:0;">
                        ${letter}
                    </button>
                `).join('')}
            </div>
            <p id="feedback" style="text-align:center; font-size:24px; margin-top:30px; font-weight:bold; height:50px;"></p>
            <div class="control-box">
                <button class="cute-btn btn-blue" onclick="window.renderMissingLetter()"><span>🔄</span> Next Word</button>
                <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> Done</button>
            </div>
        `;
    };

    window.checkMissingLetter = (selected, target) => {
        const feedback = document.getElementById('feedback');
        if (selected === target) {
            feedback.innerText = "Excellent spelling! 🌟";
            feedback.style.color = "var(--success)";
            gameScore += 20;
            const scoreEl = document.getElementById('game-score');
            if (scoreEl) scoreEl.innerText = gameScore;
            setTimeout(window.renderMissingLetter, 1500);
        } else {
            feedback.innerText = "Try another letter! 😊";
            feedback.style.color = "var(--danger)";
        }
    };

    window.renderMissingLetter();
}

function startWordPictureMatch(container) {
    const items = [
        { word: 'Elephant', icon: '🐘' }, { word: 'Rocket', icon: '🚀' },
        { word: 'Guitar', icon: '🎸' }, { word: 'Pizza', icon: '🍕' },
        { word: 'Rainbow', icon: '🌈' }, { word: 'Bicycle', icon: '🚲' }
    ];

    window.renderWordPicture = () => {
        const target = items[Math.floor(Math.random() * items.length)];
        const options = [...items].sort(() => Math.random() - 0.5).slice(0, 4);
        if (!options.find(o => o.word === target.word)) {
            options[Math.floor(Math.random() * 4)] = target;
        }

        container.innerHTML = `
            <h3 style="text-align:center; margin-bottom: 20px;">Match the picture to the word!</h3>
            <div style="text-align:center; margin-bottom: 30px; background: #fff; padding: 20px; border-radius: 20px; border: 3px solid var(--secondary); display: inline-block;">
                <h2 style="font-size: 48px; margin:0; color: var(--primary);">${target.word.toUpperCase()}</h2>
            </div>
            <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 20px;">
                ${options.map(opt => `
                    <div onclick="window.checkWordPicture('${opt.word}', '${target.word}')" class="card" 
                         style="width: 140px; height: 140px; font-size: 70px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s;">
                        ${opt.icon}
                    </div>
                `).join('')}
            </div>
            <p id="feedback" style="text-align:center; font-size:24px; margin-top:30px; font-weight:bold; height:50px;"></p>
            <div class="control-box">
                <button class="cute-btn btn-blue" onclick="window.renderWordPicture()"><span>🔄</span> Next</button>
                <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> Done</button>
            </div>
        `;
    };

    window.checkWordPicture = (selected, target) => {
        const feedback = document.getElementById('feedback');
        if (selected === target) {
            feedback.innerText = "Perfect Match! 🌟";
            feedback.style.color = "var(--success)";
            gameScore += 15;
            const scoreEl = document.getElementById('game-score');
            if (scoreEl) scoreEl.innerText = gameScore;
            setTimeout(window.renderWordPicture, 1500);
        } else {
            feedback.innerText = "That's a different one! 😊";
            feedback.style.color = "var(--danger)";
        }
    };

    window.renderWordPicture();
}

function startObjectSearch(container) {
    const objects = [
        { name: 'Red Ball', icon: '🔴', color: 'red' }, { name: 'Blue Square', icon: '🟦', color: 'blue' },
        { name: 'Yellow Star', icon: '⭐', color: 'yellow' }, { name: 'Green Apple', icon: '🍏', color: 'green' },
        { name: 'Purple Heart', icon: '💜', color: 'purple' }, { name: 'Orange Orange', icon: '🍊', color: 'orange' }
    ];

    window.renderObjectSearch = () => {
        const target = objects[Math.floor(Math.random() * objects.length)];
        // Create a grid of 12 items
        const gridItems = [];
        for(let i=0; i<11; i++) {
            gridItems.push(objects[Math.floor(Math.random() * objects.length)]);
        }
        gridItems.push(target);
        gridItems.sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <h3 style="text-align:center; margin-bottom: 20px;">Find the <span style="color:${target.color}; text-decoration: underline;">${target.name}</span>!</h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; background: #fff; padding: 25px; border-radius: 30px; box-shadow: 0 10px 20px rgba(0,0,0,0.05);">
                ${gridItems.map((item, i) => `
                    <div onclick="window.checkObjectSearch('${item.name}', '${target.name}', this)" 
                         style="font-size: 50px; cursor: pointer; text-align: center; padding: 10px; border-radius: 15px; transition: background 0.2s;">
                        ${item.icon}
                    </div>
                `).join('')}
            </div>
            <p id="feedback" style="text-align:center; font-size:24px; margin-top:30px; font-weight:bold; height:50px;"></p>
            <div class="control-box">
                <button class="cute-btn btn-blue" onclick="window.renderObjectSearch()"><span>🔄</span> New Grid</button>
                <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> Done</button>
            </div>
        `;
    };

    window.checkObjectSearch = (selected, target, el) => {
        const feedback = document.getElementById('feedback');
        if (selected === target) {
            el.style.background = "#e8f5e9";
            el.style.transform = "scale(1.1)";
            feedback.innerText = "Found it! Well done! 🌟";
            feedback.style.color = "var(--success)";
            gameScore += 10;
            const scoreEl = document.getElementById('game-score');
            if (scoreEl) scoreEl.innerText = gameScore;
            setTimeout(window.renderObjectSearch, 1500);
        } else {
            el.style.opacity = "0.3";
            feedback.innerText = "Keep looking... 🔍";
            feedback.style.color = "var(--text)";
        }
    };

    window.renderObjectSearch();
}

function startSpatialPuzzle(container) {
    const puzzles = [
        { full: '🧩', parts: ['🟦', '🟩', '🟨'] }, 
        { full: '🏠', parts: ['📐', '🧱', '🚪'] },
        { full: '🌸', parts: ['🍃', '📍', '💗'] }
    ];

    window.renderSpatialPuzzle = () => {
        const target = puzzles[Math.floor(Math.random() * puzzles.length)];
        
        container.innerHTML = `
            <h3 style="text-align:center; margin-bottom: 20px;">Spatial Reasoning: Build the Object</h3>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 30px;">
                <div id="puzzle-target" style="width: 150px; height: 150px; background: #eee; border: 4px dashed #ccc; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 80px; color: #bbb;">
                    ?
                </div>
                <div style="display: flex; gap: 20px;">
                    ${target.parts.map(part => `
                        <div class="card" style="width: 80px; height: 80px; font-size: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer;"
                             onclick="window.addSpatialPiece(this, '${target.full}', ${target.parts.length})">
                            ${part}
                        </div>
                    `).join('')}
                </div>
            </div>
            <p id="feedback" style="text-align:center; font-size:24px; margin-top:30px; font-weight:bold; height:50px;"></p>
            <div class="control-box">
                <button class="cute-btn btn-blue" onclick="window.renderSpatialPuzzle()"><span>🔄</span> New Puzzle</button>
                <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> Done</button>
            </div>
        `;
        
        let piecesPlaced = 0;
        window.addSpatialPiece = (el, fullIcon, totalPieces) => {
            if (el.style.opacity === "0.5") return;
            el.style.opacity = "0.5";
            piecesPlaced++;
            gameScore += 5;
            const scoreEl = document.getElementById('game-score');
            if (scoreEl) scoreEl.innerText = gameScore;
            
            if (piecesPlaced >= totalPieces) {
                const feedback = document.getElementById('feedback');
                const puzzleTarget = document.getElementById('puzzle-target');
                if (feedback) {
                    feedback.innerText = "Puzzle Complete! 🌟";
                    feedback.style.color = "var(--success)";
                }
                if (puzzleTarget) {
                    puzzleTarget.innerText = fullIcon;
                    puzzleTarget.style.background = "#fff";
                    puzzleTarget.style.borderColor = "var(--success)";
                }
                setTimeout(window.renderSpatialPuzzle, 2000);
            }
        };
    };

    window.renderSpatialPuzzle();
}

function startAlphabetOrder(container) {
    const letters = "ABCDEFG".split("");
    
    window.renderAlphabetOrder = () => {
        const items = [...letters].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <h3 style="text-align:center; margin-bottom: 20px;">Put the letters in order! (A to G)</h3>
            <div id="target-row" style="display: flex; justify-content: center; gap: 10px; margin-bottom: 40px; min-height: 70px;">
                ${letters.map((_, i) => `
                    <div class="drop-target" data-index="${i}" ondrop="window.dropOrder(event, ${i})" ondragover="window.allowDrop(event)"
                         style="width: 60px; height: 60px; border: 3px dashed #ccc; border-radius: 10px; background: #fafafa; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #ddd;">
                        ${i+1}
                    </div>
                `).join('')}
            </div>
            <div id="source-row" style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; background: #fff; padding: 20px; border-radius: 20px; border: 2px solid #eee;">
                ${items.map((item, i) => `
                    <div id="drag-order-${i}" draggable="true" ondragstart="window.drag(event)" data-val="${item}"
                         style="width: 60px; height: 60px; background: white; border: 2px solid var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 28px; cursor: move; box-shadow: 0 4px 6px rgba(0,0,0,0.05); color: var(--primary); font-weight: bold;">
                        ${item}
                    </div>
                `).join('')}
            </div>
            <p id="feedback" style="text-align:center; font-size:24px; margin-top:30px; font-weight:bold; height:50px;"></p>
            <div class="control-box">
                <button class="cute-btn btn-blue" onclick="window.renderAlphabetOrder()"><span>🔄</span> Reset</button>
                <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> Done</button>
            </div>
        `;
    };

    window.dropOrder = (ev, targetIdx) => {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("text");
        const draggedEl = document.getElementById(data);
        if (!draggedEl) return;
        const val = draggedEl.getAttribute("data-val");
        const feedback = document.getElementById('feedback');

        if (val === letters[targetIdx]) {
            ev.target.innerText = val;
            ev.target.style.background = "#e8f5e9";
            ev.target.style.borderColor = "#4caf50";
            ev.target.style.color = "#2e7d32";
            ev.target.style.borderStyle = "solid";
            draggedEl.remove();
            gameScore += 15;
            const scoreEl = document.getElementById('game-score');
            if (scoreEl) scoreEl.innerText = gameScore;
            
            const sourceRow = document.getElementById('source-row');
            if (sourceRow && sourceRow.children.length === 0) {
                feedback.innerText = "Alphabet Master! 🌟";
                feedback.style.color = "var(--success)";
                setTimeout(window.renderAlphabetOrder, 2000);
            }
        } else {
            feedback.innerText = "That's not where " + val + " goes! 😊";
            feedback.style.color = "var(--danger)";
            setTimeout(() => feedback.innerText = "", 1500);
        }
    };

    window.renderAlphabetOrder();
}

function startJigsawPuzzle(container) {
    const images = [
        { icon: '🐶', name: 'Puppy' }, { icon: '🐱', name: 'Kitty' },
        { icon: '🦁', name: 'Lion' }, { icon: '🐘', name: 'Elephant' }
    ];

    window.renderJigsaw = () => {
        const target = images[Math.floor(Math.random() * images.length)];
        const parts = [1, 2, 3, 4];
        const shuffledParts = [...parts].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <h3 style="text-align:center; margin-bottom: 20px;">Complete the Jigsaw!</h3>
            <div id="jigsaw-board" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; width: 200px; height: 200px; margin: 0 auto 30px; background: #eee; padding: 5px; border-radius: 10px;">
                ${parts.map(p => `
                    <div class="jigsaw-slot" data-part="${p}" ondrop="window.dropJigsaw(event, ${p})" ondragover="window.allowDrop(event)"
                         style="width: 90px; height: 90px; background: #fff; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 40px; color: #eee;">
                        ${p}
                    </div>
                `).join('')}
            </div>
            <div id="jigsaw-pieces" style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                ${shuffledParts.map(p => `
                    <div id="piece-${p}" draggable="true" ondragstart="window.drag(event)" data-part="${p}"
                         style="width: 80px; height: 80px; background: var(--secondary); border: 2px solid var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 50px; cursor: move; color: white;">
                        ${target.icon}
                    </div>
                `).join('')}
            </div>
            <p id="feedback" style="text-align:center; font-size:24px; margin-top:30px; font-weight:bold; height:50px;"></p>
            <div class="control-box">
                <button class="cute-btn btn-blue" onclick="window.renderJigsaw()"><span>🔄</span> New Puzzle</button>
                <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> Done</button>
            </div>
        `;
    };

    window.dropJigsaw = (ev, targetPart) => {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("text");
        const draggedEl = document.getElementById(data);
        if (!draggedEl) return;
        const part = draggedEl.getAttribute("data-part");
        const feedback = document.getElementById('feedback');

        if (parseInt(part) === targetPart) {
            ev.target.innerHTML = draggedEl.innerHTML;
            ev.target.style.background = "var(--secondary)";
            ev.target.style.borderColor = "var(--primary)";
            ev.target.style.borderStyle = "solid";
            draggedEl.remove();
            gameScore += 20;
            const scoreEl = document.getElementById('game-score');
            if (scoreEl) scoreEl.innerText = gameScore;
            
            const pieces = document.getElementById('jigsaw-pieces');
            if (pieces && pieces.children.length === 0) {
                feedback.innerText = "Puzzle Solved! 🌟";
                feedback.style.color = "var(--success)";
                setTimeout(window.renderJigsaw, 2000);
            }
        } else {
            feedback.innerText = "Wrong spot! 😊";
            feedback.style.color = "var(--danger)";
            setTimeout(() => feedback.innerText = "", 1500);
        }
    };

    window.renderJigsaw();
}

function startAdvancedPatterns(container) {
    const sequences = [
        { pattern: ['🔴', '🔵', '🟢', '🔴', '🔵'], next: '🟢', options: ['🟢', '🟡', '🟠'] },
        { pattern: ['1', '2', '4', '8'], next: '16', options: ['10', '16', '12'] },
        { pattern: ['⬆️', '➡️', '⬇️', '⬅️', '⬆️'], next: '➡️', options: ['⬇️', '➡️', '⬆️'] }
    ];

    window.renderAdvancedPattern = () => {
        const target = sequences[Math.floor(Math.random() * sequences.length)];

        container.innerHTML = `
            <h3 style="text-align:center; margin-bottom: 30px;">Complete the Logic Pattern</h3>
            <div id="pattern-display" style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 40px; background: #f0f4f8; padding: 25px; border-radius: 30px; border: 2px solid #d1d9e6;">
                ${target.pattern.map(item => `<div style="font-size: 45px; font-weight: bold;">${item}</div>`).join('<div style="color:#999;">•</div>')}
                <div style="color:#999;">•</div>
                <div id="pattern-target" style="width: 70px; height: 70px; border: 4px solid var(--primary); border-radius: 15px; display: flex; align-items: center; justify-content: center; background: #fff; font-size: 35px; color: #ddd;">?</div>
            </div>
            <div style="display: flex; justify-content: center; gap: 20px;">
                ${target.options.map(opt => `
                    <button onclick="window.checkAdvancedPattern('${opt}', '${target.next}')" 
                            class="cute-btn btn-blue" style="font-size: 24px; min-width: 80px;">
                        ${opt}
                    </button>
                `).join('')}
            </div>
            <p id="feedback" style="text-align:center; font-size:24px; margin-top:30px; font-weight:bold; height:50px;"></p>
            <div class="control-box">
                <button class="cute-btn btn-blue" onclick="window.renderAdvancedPattern()"><span>🔄</span> New Challenge</button>
                <button class="cute-btn btn-orange" onclick="window.finishGame()"><span>✅</span> Done</button>
            </div>
        `;
    };

    window.checkAdvancedPattern = (selected, target) => {
        const feedback = document.getElementById('feedback');
        const patternTarget = document.getElementById('pattern-target');
        if (selected === target) {
            if (feedback) {
                feedback.innerText = "Brilliant Logic! 🌟";
                feedback.style.color = "var(--success)";
            }
            gameScore += 25;
            const scoreEl = document.getElementById('game-score');
            if (scoreEl) scoreEl.innerText = gameScore;
            if (patternTarget) {
                patternTarget.innerText = target;
                patternTarget.style.color = "#000";
                patternTarget.style.borderColor = "var(--success)";
            }
            setTimeout(window.renderAdvancedPattern, 2000);
        } else {
            if (feedback) {
                feedback.innerText = "Look closer at the sequence! 😊";
                feedback.style.color = "var(--danger)";
            }
        }
    };

    window.renderAdvancedPattern();
}

// Final Window Exports
window.startCamera = startCamera;
window.stopCamera = stopCamera;
window.capturePhoto = capturePhoto;
window.uploadEmotion = uploadEmotion;
window.confirmEmotion = confirmEmotion;
window.toggleCustomEmotion = toggleCustomEmotion;
window.saveCorrection = saveCorrection;
window.trainAI = trainAI;
window.startGame = startGame;
window.startNewQuiz = startNewQuiz;
window.saveDiary = saveDiary;
window.logout = logout;
window.register = register;
window.login = login;
window.addChild = addChild;
window.selectChild = selectChild;
window.deleteChild = deleteChild;
window.toggleAuth = toggleAuth;
window.syncChildAge = syncChildAge;
window.loadProgress = loadProgress;
window.generateReport = generateReport;
window.startAnimalColoring = startAnimalColoring;
window.selectAnimalTemplate = selectAnimalTemplate;
window.startLearnEmotions = startLearnEmotions;
window.startShapeMatch = startShapeMatch;
window.startPatternMatch = startPatternMatch;
window.startColorMatch = startColorMatch;
window.startMemoryGame = startMemoryGame;
window.startColoringBook = startColoringBook;
window.selectTemplate = selectTemplate;
window.selectPaletteColor = selectPaletteColor;
window.colorBlock = colorBlock;
window.nextImage = nextImage;
window.closeGame = closeGame;
window.restartGame = restartGame;
window.finishGame = finishGame;
window.startMoodMatch = startMoodMatch;
window.startAbcSort = startAbcSort;
window.startAlphabetOrder = startAlphabetOrder;
window.startMissingLetter = startMissingLetter;
window.startWordPictureMatch = startWordPictureMatch;
window.startObjectSearch = startObjectSearch;
window.startSpatialPuzzle = startSpatialPuzzle;
window.startJigsawPuzzle = startJigsawPuzzle;
window.startAdvancedPatterns = startAdvancedPatterns;
