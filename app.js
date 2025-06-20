// Phish song database for roulette - Based on Jordan's show history!
const phishSongs = [
    // Heavy hitters (40+ appearances)
    "Tweezer", "Chalk Dust Torture", "Down with Disease", "46 Days", "Harry Hood",
    "Character Zero", "Slave to the Traffic Light", "Tube", "Tweezer Reprise", "Ghost",
    "The Moma Dance", "Wolfman's Brother", "Wilson", "Fluffhead", "Possum", "You Enjoy Myself",

    // Frequent favorites (20-39 times)
    "Mike's Song", "Weekapaug Groove", "AC/DC Bag", "David Bowie", "Cavern", "Carini",
    "Punch You in the Eye", "Free", "Sample in a Jar", "Julius", "The Squirming Coil",
    "Maze", "Bathtub Gin", "Run Like an Antelope", "Golgi Apparatus", "Suzy Greenberg",
    "Bouncing Around the Room", "Heavy Things", "Farmhouse", "First Tube", "Sand",
    "Piper", "Limb By Limb", "Birds of a Feather", "Reba", "Split Open and Melt",
    "Divided Sky", "The Lizards", "Backwards Down the Number Line", "Joy", "Alaska",
    "Cities", "Simple", "Kill Devil Falls", "Everything's Right", "Llama", "Gumbo",
    "Bug", "Waste", "The Wedge", "Fee", "Stash",

    // Medium frequency songs
    "Runaway Jim", "Sparkle", "Horn", "Strange Design", "Theme From the Bottom",
    "Gotta Jibboo", "NICU", "My Sweet One", "Axilla", "Rift",
    "Esther", "Dinner and a Movie", "Stealing Time From the Faulty Plan", "Fuego",
    "Sigma Oasis", "Everything is Hollow", "Mercury", "Ruby Waves", "About to Run",
    "Blaze On", "Breath and Burning", "Martian Monster", "More", "No Men In No Man's Land",
    "Miss You", "Leaves", "Thread", "Steam", "Time Turns Elastic", "Twenty Years Later",
    "Undermind", "Walls of the Cave", "Wading in the Velvet Sea", "Billy Breathes",
    "Brian and Robert", "Cars Trucks Buses", "Contact", "Coil", "Cool It Down",
    "Demand", "Dog Faced Boy", "Faht", "Fast Enough for You", "Frankie Says",
    "Ginseng Sullivan", "Guelah Papyrus", "Halley's Comet", "I Am Hydrogen",

    // Rare gems and bust-outs
    "Lengthwise", "Loving Cup", "My Soul", "Prince Caspian", "Rock and Roll", "The Horse",
    "The Oh Kee Pa Ceremony", "Timber (Jerry the Mule)", "Vultures", "Weigh", "Also Sprach Zarathustra",
    "Amazing Grace", "Army of One", "Bell Boy", "Big Black Furry Creature from Mars",
    "Black-Eyed Katy", "Buried Alive", "Crowd Control", "Foam", "Glide", "Good Times Bad Times",
    "Grind", "Harpua", "I Never Needed You Like This Before", "Icculus", "Jennifer Dances",
    "Lawn Boy", "McGrupp and the Watchful Hosemasters", "Meatstick", "Money", "Mountains in the Mist",
    "My Friend, My Friend", "Ocelot", "Poor Heart", "Roggae", "Say It To Me S.A.N.T.O.S.",
    "Secret Smile", "Silent in the Morning", "Skin It Back", "Sleeping Monkey", "Taste",
    "The Curtain", "The Curtain With", "The Sloth", "Turtle in the Clouds",

    // Super rare bust-outs
    "Colonel Forbin's Ascent", "The Famous Mockingbird", "Narration", "The Man Who Stepped Into Yesterday",
    "And So To Bed", "Axilla (Part II)", "Big Ball Jam", "Bundle of Joy", "Crimes of the Mind",
    "Destiny Unbound", "Dog Log", "Eliza", "Flat Fee", "Gary Indiana", "Go Phish",
    "Happy Whip and Dung Song", "Heba", "Hold Your Head Up", "I Didn't Know", "If I Could",
    "Kung", "Letter to Jimmy Page", "Makisupa Policeman", "Manteca", "N02", "No Quarter",
    "Oblivious Fool", "On Your Way Down", "Pictures of Matchstick Men", "Prep School Hippie",
    "Purple Rain", "Quinn the Eskimo", "Revolution", "Ripple", "Rocky Raccoon", "Sanity",
    "Satin Doll", "Scarlet Begonias", "She Caught the Katy", "Snowball", "Swing Low Sweet Chariot",
    "Terrapin", "The Practical Song", "The Star-Spangled Banner", "Uncle Pen", "Walfredo",
    "Walk Away", "White Winter Hymnal", "Ya Mar", "Yarmouth Road"
];

// Jordan's actual opener history
const jordanOpeners = {
    // Most Likely Openers (5+ times)
    mostLikely: [
        { song: "Mike's Song", count: 9 },
        { song: "AC/DC Bag", count: 8 },
        { song: "The Moma Dance", count: 8 },
        { song: "Buried Alive", count: 7 },
        { song: "Crowd Control", count: 7 },
        { song: "Fluffhead", count: 6 },
        { song: "Wilson", count: 6 },
        { song: "Carini", count: 5 },
        { song: "Punch You in the Eye", count: 5 },
        { song: "Runaway Jim", count: 5 }
    ],
    // Rare Openers (only opened once)
    rare: [
        "1999", "Also Sprach Zarathustra", "Axilla", "Backwards Down the Number Line",
        "Bathtub Gin", "Bouncing Around the Room", "Box of Rain", "Can't Always Listen",
        "Carolina", "Cathy's Clown", "Character Zero", "Cities", "David Bowie",
        "Dinner and a Movie", "Divided Sky", "Dogs Stole Things", "Down with Disease",
        "Everything is Hollow", "Farmhouse", "Fat Man in the Bathtub", "First Tube",
        "Fuego", "Golgi Apparatus", "Gotta Jibboo", "Grind", "Harry Hood", "Hello My Baby",
        "I Never Needed You Like This Before", "Loving Cup", "Maze", "My Soul",
        "No Men In No Man's Land", "O Canada", "Olivia's Pool", "Say It To Me S.A.N.T.O.S.",
        "See That My Grave Is Kept Clean", "Set Your Soul Free", "Skin It Back",
        "Strawberry Fields Forever", "Strawberry Letter 23", "Stray Dog", "Sunday Morning",
        "Suzy Greenberg", "The Curtain", "The Curtain With", "The Dogs", "The Lizards",
        "Tube", "Turtle in the Clouds", "Walfredo", "Way Down in the Hole",
        "We Are Come to Outlive Our Brains", "White Winter Hymnal"
    ],
    // Songs Jordan has seen many times but NEVER as openers
    neverOpener: [
        "Tweezer (56 times but never opened!)",
        "You Enjoy Myself (28 times but never opened!)",
        "Ghost (43 times but never opened!)",
        "Slave to the Traffic Light (44 times but never opened!)",
        "Harry Hood (46 times, only opened once!)",
        "Possum (35 times but never opened!)",
        "Split Open and Melt (25 times but never opened!)",
        "Reba (22 times but never opened!)"
    ],
    // Special milestone-worthy openers
    milestone: [
        "You Enjoy Myself", "Fluffhead", "Mike's Song", "Wilson", "The Lizards",
        "Possum", "AC/DC Bag", "Divided Sky", "Golgi Apparatus", "David Bowie"
    ]
};

// Global variables
let currentSetlist = [];

// Tab switching functionality
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Song roulette function
function spinSongRoulette() {
    const rouletteElement = document.getElementById('rouletteSong');
    let spins = 0;
    const maxSpins = 20;

    const spinInterval = setInterval(() => {
        const randomSong = phishSongs[Math.floor(Math.random() * phishSongs.length)];
        rouletteElement.textContent = randomSong;
        spins++;

        if (spins >= maxSpins) {
            clearInterval(spinInterval);
            rouletteElement.style.color = '#00ff88';
            showNotification(`The universe predicts: ${randomSong}!`);
        }
    }, 100);
}

// Opener predictor function
function predictOpener(type) {
    let prediction = '';
    let message = '';

    switch(type) {
        case 'likely':
            const likelyOpeners = jordanOpeners.mostLikely;
            const pick = likelyOpeners[Math.floor(Math.random() * likelyOpeners.length)];
            prediction = pick.song;
            message = `${prediction} - Jordan has seen this open ${pick.count} times! 📈`;
            break;

        case 'rare':
            prediction = jordanOpeners.rare[Math.floor(Math.random() * jordanOpeners.rare.length)];
            message = `${prediction} - Only opened once in Jordan's 199 shows! 🦄`;
            break;

        case 'never':
            prediction = jordanOpeners.neverOpener[Math.floor(Math.random() * jordanOpeners.neverOpener.length)];
            message = `${prediction} - Would be a first-time opener for Jordan! 🎭`;
            break;

        case 'milestone':
            prediction = jordanOpeners.milestone[Math.floor(Math.random() * jordanOpeners.milestone.length)];
            message = `${prediction} - Perfect for show #200! 🎊`;
            break;
    }

    showNotification(message);
}

// Lot food spinner function
function spinLotFood() {
    const lotFood = [
        { item: "Lot Dog", emoji: "🌭" },
        { item: "Grilled Cheese", emoji: "🧀" },
        { item: "Burrito", emoji: "🌯" },
        { item: "Ice Cold Fatty", emoji: "🧊" },
        { item: "Pretzel", emoji: "🥨" },
        { item: "Merch", emoji: "👕" }
    ];

    const resultElement = document.getElementById('lotFoodResult');
    let spins = 0;
    const maxSpins = 20;

    const spinInterval = setInterval(() => {
        const randomFood = lotFood[Math.floor(Math.random() * lotFood.length)];
        resultElement.innerHTML = `${randomFood.emoji} ${randomFood.item}`;
        spins++;

        if (spins >= maxSpins) {
            clearInterval(spinInterval);
            resultElement.style.color = '#00ff88';
            showNotification(`You're buying: ${randomFood.item}! ${randomFood.emoji}`);
        }
    }, 100);
}

// Venue click handler
function venueClick(element) {
    const venues = {
        'Dick\'s': 'Colorado Labor Day tradition! 🏔️',
        'Jones Beach': 'Where it all began! Long Island summer nights 🌊',
        'MGM Grand': 'Vegas shows = Late night magic! 🎰',
        'Tweeter Center': 'Camden waterfront vibes 🌸',
        'Watkins Glen': 'Magna Ball & Coventry - Historic festivals! 🏁',
        'Atlantic City': 'Shows on the beach! 🏖️',
        'Fenway Park': 'Playing where the Red Sox play! ⚾',
        'Forest Hills': 'The milestone show destination! 🎯'
    };

    const text = element.textContent.trim();
    const venueKey = Object.keys(venues).find(key => text.includes(key));
    if (venueKey && venues[venueKey]) {
        showNotification(venues[venueKey]);
    }
}

// Glow stick throwing
// Glow stick colors and shadows (match these with your CSS .glow-stick:nth-child definitions)
const glowStickStyles = [
    { background: 'linear-gradient(to bottom, #ff0088, #ff44aa)', boxShadow: '0 0 15px #ff0088' }, // Pink
    { background: 'linear-gradient(to bottom, #00ff88, #44ffaa)', boxShadow: '0 0 15px #00ff88' }, // Green
    { background: 'linear-gradient(to bottom, #0088ff, #44aaff)', boxShadow: '0 0 15px #0088ff' }, // Blue
    { background: 'linear-gradient(to bottom, #ffeb3b, #fff176)', boxShadow: '0 0 15px #ffeb3b' }  // Yellow
];

// Glow stick confetti throwing
function throwGlowStick(clickedStickElement) {
    const numberOfConfetti = 75; // Number of confetti pieces
    const confettiContainer = document.getElementById('floatingElements');

    // Brief feedback animation for the clicked stick
    const originalAnimation = clickedStickElement.style.animation;
    clickedStickElement.style.animation = 'glowStickClickFeedback 0.3s ease-in-out';
    setTimeout(() => {
        clickedStickElement.style.animation = originalAnimation; // Restore original bounce
    }, 300);

    const originRect = clickedStickElement.getBoundingClientRect();
    // Calculate origin relative to the viewport, as floatingElements is fixed
    const originX = originRect.left + (originRect.width / 2);
    const originY = originRect.top + (originRect.height / 2);

    for (let i = 0; i < numberOfConfetti; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-glow-stick';

        const styleChoice = glowStickStyles[Math.floor(Math.random() * glowStickStyles.length)];
        confetti.style.background = styleChoice.background;
        confetti.style.boxShadow = styleChoice.boxShadow;

        // Set initial position at the center of the clicked stick
        confetti.style.left = `${originX}px`;
        confetti.style.top = `${originY}px`;

        // Randomize animation properties using CSS custom properties
        // Spread confetti in a ~180-degree arc upwards
        const angle = (Math.random() * Math.PI) - (Math.PI / 2); // -PI/2 to PI/2 (straight up to sides)
        const spreadDistance = window.innerHeight * 1.0 + (Math.random() * window.innerHeight * 0.5); // Fly 100-150% of screen height

        const confettiX = Math.cos(angle - Math.PI/2) * spreadDistance * (Math.random() * 0.5 + 0.5); // Adjust spread width
        const confettiY = Math.sin(angle - Math.PI/2) * spreadDistance;
        const confettiRot = (Math.random() - 0.5) * 1080; // Rotate up to 3 full turns
        const duration = Math.random() * 1.5 + 2.0; // Duration 2s to 3.5s

        confetti.style.setProperty('--confetti-x', `${confettiX}px`);
        confetti.style.setProperty('--confetti-y', `${confettiY}px`);
        confetti.style.setProperty('--confetti-rot', `${confettiRot}deg`);
        confetti.style.animationDuration = `${duration}s`;
        // Optional: Stagger start times slightly for a more natural burst
        // confetti.style.animationDelay = `${Math.random() * 0.1}s`;

        confettiContainer.appendChild(confetti);

        // Remove confetti after animation to prevent DOM clutter
        confetti.addEventListener('animationend', () => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        });
    }

    showNotification('hell yeah!');
}

// Setlist builder functions
function addSong() {
    const songInput = document.getElementById('songInput');
    const songName = songInput.value.trim();

    if (songName) {
        currentSetlist.push(songName);
        updateSetlistDisplay();
        songInput.value = '';
    }
}

function updateSetlistDisplay() {
    const display = document.getElementById('setlistDisplay');
    if (currentSetlist.length === 0) {
        display.innerHTML = '<p style="color: rgba(255, 255, 255, 0.6);">Your predicted setlist will appear here...</p>';
    } else {
        display.innerHTML = currentSetlist.map(song =>
            `<span style="display: inline-block; background: linear-gradient(45deg, #0088ff, #00ff88); color: white; padding: 6px 12px; margin: 3px; border-radius: 15px; font-size: 0.9rem;">${song}</span>`
        ).join('');
    }
}

function saveSetlist() {
    const predictorName = document.getElementById('predictorName').value || 'Anonymous';

    if (currentSetlist.length === 0) {
        showNotification('Please add some songs first!');
        return;
    }

    const setlistCard = document.createElement('div');
    setlistCard.className = 'message-card';
    setlistCard.innerHTML = `
        <div class="message-header">
            <div class="message-author">${predictorName}</div>
            <div class="message-date">Setlist Prediction</div>
        </div>
        <div class="message-content">
            <strong>My prediction for Show #200:</strong><br>
            <div style="margin-top: 15px;">
                ${currentSetlist.map(song => `<span style="display: inline-block; background: linear-gradient(45deg, #0088ff, #00ff88); color: white; padding: 6px 12px; margin: 3px; border-radius: 15px; font-size: 0.9rem;">${song}</span>`).join('')}
            </div>
        </div>
    `;

    document.getElementById('setlistWall').insertBefore(setlistCard, document.getElementById('setlistWall').firstChild);

    currentSetlist = [];
    updateSetlistDisplay();
    document.getElementById('predictorName').value = '';

    showNotification('Setlist prediction saved!');
}

// Photo upload handler
function handlePhotoUpload(event) {
    const files = event.target.files;
    const gallery = document.getElementById('photos-gallery');

    if (files.length > 0) {
        if (gallery.innerHTML.includes('Uploaded photos will appear here')) {
            gallery.innerHTML = '<h3 style="color: #00ff88; margin-bottom: 20px;">📷 Photo Gallery</h3>';
        }

        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const photoHTML = `
                        <div style="display: inline-block; margin: 10px; text-align: center;">
                            <img src="${e.target.result}" style="max-width: 200px; max-height: 200px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                            <p style="margin: 5px 0; font-size: 0.9em; color: #666;">${file.name}</p>
                        </div>
                    `;
                    gallery.innerHTML += photoHTML;
                };
                reader.readAsDataURL(file);
            }
        });

        showNotification(`${files.length} photo(s) uploaded! 📸`);
    }
}

// Video upload handler
function handleVideoUpload(event) {
    const files = event.target.files;
    const gallery = document.getElementById('videos-gallery');

    if (files.length > 0) {
        if (gallery.innerHTML.includes('Uploaded videos will appear here')) {
            gallery.innerHTML = '<h3 style="color: #ff0088; margin-bottom: 20px;">🎬 Video Gallery</h3>';
        }

        Array.from(files).forEach(file => {
            if (file.type.startsWith('video/')) {
                const videoURL = URL.createObjectURL(file);
                const videoHTML = `
                    <div style="display: inline-block; margin: 10px; text-align: center;">
                        <video controls style="max-width: 300px; max-height: 200px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                            <source src="${videoURL}" type="${file.type}">
                            Your browser does not support the video tag.
                        </video>
                        <p style="margin: 5px 0; font-size: 0.9em; color: #666;">${file.name}</p>
                    </div>
                `;
                gallery.innerHTML += videoHTML;
            }
        });

        showNotification(`${files.length} video(s) uploaded! 🎥`);
    }
}

// Create floating orbs
function createFloatingOrb() {
    const orb = document.createElement('div');
    orb.className = 'floating-orb';
    orb.style.left = Math.random() * window.innerWidth + 'px';
    orb.style.animationDelay = Math.random() * 5 + 's';
    orb.style.animationDuration = (Math.random() * 10 + 10) + 's';

    document.getElementById('floatingElements').appendChild(orb);

    setTimeout(() => orb.remove(), 15000);
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: linear-gradient(45deg, #00ff88, #0088ff);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        font-weight: 700;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
        animation: slideIn 0.5s ease;
        border: 2px solid rgba(255, 255, 255, 0.2);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Form event listeners
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const author = document.getElementById('authorName').value;
            const content = document.getElementById('messageContent').value;

            const messageCard = document.createElement('div');
            messageCard.className = 'message-card';
            messageCard.innerHTML = `
                <div class="message-header">
                    <div class="message-author">${author}</div>
                    <div class="message-date">${new Date().toLocaleDateString()}</div>
                </div>
                <div class="message-content">${content}</div>
            `;

            document.getElementById('messageWall').insertBefore(messageCard, document.getElementById('messageWall').firstChild);

            this.reset();
            showNotification('Message added successfully!');
        });
    }

    const memoryForm = document.getElementById('memoryForm');
    if (memoryForm) {
        memoryForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const author = document.getElementById('memoryAuthor').value;
            const show = document.getElementById('memoryShow').value;
            const content = document.getElementById('memoryContent').value;

            const showText = show ? `<em style="color: #4ecdc4;">${show}</em><br>` : '';
            const memoryCard = document.createElement('div');
            memoryCard.className = 'message-card';
            memoryCard.innerHTML = `
                <div class="message-header">
                    <div class="message-author">${author}</div>
                    <div class="message-date">Memory</div>
                </div>
                <div class="message-content">${showText}${content}</div>
            `;

            document.getElementById('memoryWall').insertBefore(memoryCard, document.getElementById('memoryWall').firstChild);

            this.reset();
            showNotification('Memory added successfully!');
        });
    }

    // Song input enter key
    const songInput = document.getElementById('songInput');
    if (songInput) {
        songInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addSong();
            }
        });
    }

    // Define the food spinner as a global function
    window.spinFood = function() {
        const lotFood = [
            "🌭 Lot Dog",
            "🧀 Grilled Cheese",
            "🌯 Burrito",
            "🧊 Ice Cold Fatty",
            "🥨 Pretzel",
            "👕 Merch"
        ];

        const resultElement = document.getElementById('lotFoodResult');
        if (!resultElement) return;

        // Simple random selection
        const randomChoice = lotFood[Math.floor(Math.random() * lotFood.length)];
        resultElement.innerHTML = randomChoice;
        resultElement.style.color = '#00ff88';

        showNotification(`You're buying: ${randomChoice}!`);
    };

    // Create floating orbs periodically
    setInterval(createFloatingOrb, 2000);

    // Add initial floating orbs
    for (let i = 0; i < 5; i++) {
        setTimeout(createFloatingOrb, i * 500);
    }

    // Add click effects to stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', () => {
            const statFacts = [
                "That's almost 4,000 individual songs heard!",
                "At 20+ songs per show, that's incredible!",
                "From 2000 to 2025 - what a journey!",
                "60 shows at MSG alone - amazing dedication!",
                "30% of all shows at The Garden!",
                "25 years of following the band!"
            ];
            const randomFact = statFacts[Math.floor(Math.random() * statFacts.length)];
            showNotification(randomFact);
        });
    });
});
