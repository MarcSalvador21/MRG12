let lives = 3;
let currentNodeKey = "start";
let activeInterval = null;

const story = {
    start: {
        loc: "USA - BACKYARD", image: "backyard.jpg",
        text: "You and Leo are playing in the tall grass. Suddenly, a tattered man appears at the gate. He shoves a brass compass into your hands. 'The girl... find her,' he croaks before vanishing.",
        options: [{ text: "EXAMINE COMPASS", next: "the_leap" }, { text: "IGNORE HIM", wrong: true }]
    },
    the_leap: {
        loc: "TIMELINE RIFT", image: "binary_code.png",
        text: "The needles spin wildly. The world dissolves into falling green code. You grab Leo's arm as the floor vanishes. Do you hold on?",
        options: [{ text: "HOLD ON TIGHT", next: "germany_forest" }, { text: "LET GO", wrong: true }]
    },
    germany_forest: {
        loc: "GERMANY - 1944", image: "forest.jpg",
        text: "Snow falls. A girl in a cloak stands over you. Suddenly, shouting breaks the silence. German soldiers emerge from the trees, rifles leveled. They drag you and Leo toward a dark camp.",
        options: [{ text: "SUBMIT", next: "interrogation_1" }, { text: "FIGHT BACK", wrong: true }]
    },
    interrogation_1: {
        loc: "INTERROGATION CAMP", image: "forest.jpg",
        text: "A cold officer slams a heavy file on a wooden table. Question 1: 'Where did you get that compass?'",
        options: [{ text: "A STRANGER", next: "interrogation_2" }, { text: "I STOLE IT", next: "interrogation_2" }]
    },
    interrogation_2: {
        loc: "INTERROGATION CAMP", image: "forest.jpg",
        text: "Question 2: 'Who is the girl to you? Why was she waiting?'",
        options: [{ text: "I DON'T KNOW", next: "interrogation_3" }, { text: "SHE IS A FRIEND", next: "interrogation_3" }]
    },
    interrogation_3: {
        loc: "INTERROGATION CAMP", image: "forest.jpg",
        text: "Question 3: 'How did you teleport into our woods?'",
        options: [{ text: "THE COMPASS", next: "interrogation_4" }, { text: "IT WAS LUCK", wrong: true }]
    },
    interrogation_4: {
        loc: "INTERROGATION CAMP", image: "forest.jpg",
        text: "Question 4: 'Where is the rest of your unit hiding?'",
        options: [{ text: "WE ARE ALONE", next: "interrogation_5" }, { text: "IN THE BACKYARD", next: "interrogation_5" }]
    },
    interrogation_5: {
        loc: "INTERROGATION CAMP", image: "forest.jpg",
        text: "Final Question: 'Do you want to survive this night?'",
        options: [{ text: "YES", next: "the_jail" }, { text: "NO", wrong: true }]
    },
    the_jail: {
        loc: "PRISON CELL", image: "forest.jpg",
        text: "They throw you and Leo into a freezing cell. The girl is there. She touches the iron bars—they glow green and turn to dust. 'Move! The portal is near!'",
        options: [{ text: "ESCAPE", next: "the_sacrifice" }]
    },
    the_sacrifice: {
        loc: "THE PORTAL GATE", image: "forest.jpg",
        text: "Soldiers open fire as you reach the shimmering rift. The girl jumps in front of a bullet meant for you. 'GO!' she screams, pushing you into the light.",
        options: [{ text: "JUMP THROUGH", next: "victory_loop" }]
    },
    victory_loop: {
        loc: "USA - BACKYARD", image: "backyard.jpg",
        text: "You emerge tattered and old. You see your younger self and Leo playing. You realize you are the man from the gate. Complete the loop.",
        options: [{ text: "GIVE COMPASS", next: "start" }]
    }
};

window.onload = () => {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        document.getElementById('loader-progress').style.width = Math.min(progress, 100) + "%";
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('launcher').style.display = 'none';
                document.getElementById('start-screen').style.display = 'flex';
            }, 800);
        }
    }, 150);
};

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-window').style.display = 'block';
    renderGame();
}

function renderGame() {
    if (lives <= 0) {
        alert("GAME OVER: TIMELINE DESTROYED");
        lives = 3; currentNodeKey = "start";
    }

    const node = story[currentNodeKey];
    const textElement = document.getElementById("text-output");
    const container = document.getElementById("choice-container");

    // Clear interval to stop text scrambling
    if (activeInterval) clearInterval(activeInterval);
    
    textElement.innerHTML = "";
    container.innerHTML = "";
    document.getElementById("scene-image").src = node.image;
    document.getElementById("loc-display").innerText = `LOCATION: ${node.loc}`;
    document.getElementById("lives-display").innerText = `${lives * 33}%`; // Roblox HP style

    let i = 0;
    activeInterval = setInterval(() => {
        if (i < node.text.length) {
            textElement.innerHTML += node.text.charAt(i);
            i++;
        } else {
            clearInterval(activeInterval);
            activeInterval = null;
            showChoices(node.options);
        }
    }, 30);
}

function showChoices(options) {
    const container = document.getElementById("choice-container");
    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.innerText = opt.text;
        btn.onclick = () => {
            if (opt.wrong) {
                triggerWrongChoice();
            } else {
                currentNodeKey = opt.next;
                renderGame();
            }
        };
        container.appendChild(btn);
    });
}

function triggerWrongChoice() {
    lives--;
    const body = document.getElementById("game-body");
    body.classList.add("wrong-choice-active"); // Roblox damage effect
    setTimeout(() => {
        body.classList.remove("wrong-choice-active");
        renderGame();
    }, 400);
}