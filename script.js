
const lessons = {
    greetings: [
        {
            question: "How do you say 'నమస్కారం' in English?",
            options: ["Hello", "Goodbye", "Sorry"],
            answer: "Hello",
            sentence: "Hello! How are you?"
        },
        {
            question: "'ధన్యవాదాలు' అంటే ఏమిటి?",
            options: ["Please", "Thank you", "Welcome"],
            answer: "Thank you",
            sentence: "Thank you for helping me."
        },
        {
            question: "'మీ పేరు ఏమిటి?' ను English లో ఎలా అడుగుతారు?",
            options: [
                "Where are you?",
                "How old are you?",
                "What is your name?"
            ],
            answer: "What is your name?",
            sentence: "What is your name?"
        }
    ],

    shopping: [
        {
            question: "How do you ask 'దీని ధర ఎంత?'",
            options: [
                "How much is this?",
                "Where is this?",
                "What is your name?"
            ],
            answer: "How much is this?",
            sentence: "How much is this?"
        },
        {
            question: "'నాకు ఇది కావాలి' ను English లో చెప్పండి.",
            options: [
                "I don't know.",
                "I want this.",
                "I lost this."
            ],
            answer: "I want this.",
            sentence: "I want this, please."
        },
        {
            question: "Complete: Can I ___ by card?",
            options: ["pay", "eat", "speak"],
            answer: "pay",
            sentence: "Can I pay by card?"
        }
    ],

    travel: [
        {
            question: "'బస్ స్టాప్ ఎక్కడ ఉంది?' ను English లో చెప్పండి.",
            options: [
                "Where is the bus stop?",
                "Where is my house?",
                "What time is it?"
            ],
            answer: "Where is the bus stop?",
            sentence: "Where is the bus stop?"
        },
        {
            question: "Complete: I want to ___ a ticket.",
            options: ["drink", "buy", "sleep"],
            answer: "buy",
            sentence: "I want to buy a ticket."
        },
        {
            question: "'నాకు సహాయం కావాలి' ను English లో చెప్పండి.",
            options: [
                "I am hungry.",
                "I am happy.",
                "I need help."
            ],
            answer: "I need help.",
            sentence: "Excuse me, I need help."
        }
    ]
};

let currentLesson = "";
let currentQuestion = 0;
let correctAnswers = 0;
let hearts = 3;
let answered = false;

function getNumber(key) {
    return Number(localStorage.getItem(key)) || 0;
}

function updateDashboard() {
    const xp = getNumber("manaXP");
    const completed = getNumber("manaCompleted");
    const streak = getNumber("manaStreak");

    const points = document.getElementById("points");
    const streakElement = document.getElementById("streak");
    const progressXP = document.getElementById("progressXP");
    const completedLessons = document.getElementById("completedLessons");
    const streakProgress = document.getElementById("streakProgress");

    if (points) points.textContent = xp;
    if (streakElement) streakElement.textContent = streak;
    if (progressXP) progressXP.textContent = xp;
    if (completedLessons) completedLessons.textContent = completed;
    if (streakProgress) streakProgress.textContent = streak;
}

function updateXP(amount) {
    const xp = getNumber("manaXP") + amount;
    localStorage.setItem("manaXP", xp);
    updateDashboard();
}

function startLearning() {
    document.getElementById("lessons").scrollIntoView({
        behavior: "smooth"
    });
}

function openLesson(name) {
    if (!lessons[name]) {
        alert("ఈ పాఠం అందుబాటులో లేదు!");
        return;
    }

    currentLesson = name;
    currentQuestion = 0;
    correctAnswers = 0;
    hearts = 3;
    answered = false;

    showQuestion();
}

function showQuestion() {
    const lesson = lessons[currentLesson];
    const question = lesson[currentQuestion];

    const overlay = document.getElementById("lessonOverlay");

    if (!overlay) {
        createLessonOverlay();
    }

    document.getElementById("lessonTitle").textContent =
        "పాఠం " + (currentQuestion + 1) + " / " + lesson.length;

    document.getElementById("heartCount").textContent = "❤️".repeat(hearts);

    document.getElementById("questionText").textContent = question.question;

    document.getElementById("feedback").textContent = "";

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    document.getElementById("nextBtn").disabled = true;

    question.options.forEach(function(option) {
        const button = document.createElement("button");
        button.textContent = option;
        button.className = "answer-option";

        button.onclick = function() {
            checkAnswer(option, button);
        };

        optionsContainer.appendChild(button);
    });

    document.getElementById("lessonOverlay").style.display = "flex";
    answered = false;
}

function createLessonOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "lessonOverlay";

    overlay.innerHTML = `
        <div class="lesson-box">
            <button id="closeLesson" class="close-button">✕</button>
            <h2 id="lessonTitle"></h2>
            <p id="heartCount">❤️❤️❤️</p>
            <h3 id="questionText"></h3>
            <div id="options"></div>
            <p id="feedback"></p>
            <button id="nextBtn" disabled>తదుపరి ➜</button>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("closeLesson").onclick = function() {
        overlay.style.display = "none";
    };

    document.getElementById("nextBtn").onclick = function() {
        if (hearts <= 0) {
            openLesson(currentLesson);
        } else {
            currentQuestion++;

            if (currentQuestion < lessons[currentLesson].length) {
                showQuestion();
            } else {
                lessonComplete();
            }
        }
    };
}

function checkAnswer(selected, button) {
    if (answered) return;

    answered = true;

    const question = lessons[currentLesson][currentQuestion];
    const feedback = document.getElementById("feedback");
    const nextBtn = document.getElementById("nextBtn");

    if (selected === question.answer) {
        button.style.background = "#b7f7c1";
        feedback.textContent = "సరైన సమాధానం! 🎉 +10 XP";
        correctAnswers++;
        updateXP(10);
    } else {
        button.style.background = "#ffcccc";
        hearts--;

        feedback.textContent =
            "తప్పు సమాధానం! సరైన సమాధానం: " + question.answer;
    }

    document.getElementById("heartCount").textContent = "❤️".repeat(hearts);

    document.querySelectorAll(".answer-option").forEach(function(option) {
        option.disabled = true;

        if (option.textContent === question.answer) {
            option.style.background = "#b7f7c1";
        }
    });

    nextBtn.disabled = false;

    if (hearts <= 0) {
        nextBtn.textContent = "మళ్లీ ప్రయత్నించండి";
    } else if (currentQuestion === lessons[currentLesson].length - 1) {
        nextBtn.textContent = "ఫలితాలు చూడు";
    } else {
        nextBtn.textContent = "తదుపరి ➜";
    }
}

function lessonComplete() {
    const completed = getNumber("manaCompleted");
    localStorage.setItem("manaCompleted", completed + 1);

    const today = new Date().toDateString();
    const lastDay = localStorage.getItem("manaLastDay");

    if (lastDay !== today) {
        let streak = getNumber("manaStreak");

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDay === yesterday.toDateString()) {
            streak++;
        } else {
            streak = 1;
        }

        localStorage.setItem("manaStreak", streak);
        localStorage.setItem("manaLastDay", today);
    }

    updateDashboard();

    document.querySelector(".lesson-box").innerHTML = `
        <h2>అద్భుతం! 🎉</h2>
        <h3>మీరు పాఠాన్ని పూర్తి చేశారు!</h3>
        <p>సరైన సమాధానాలు: ${correctAnswers}</p>
        <p>సంపాదించిన XP: ${correctAnswers * 10}</p>
        <button onclick="closeLesson()">కొనసాగించండి</button>
    `;
}

function closeLesson() {
    document.getElementById("lessonOverlay").style.display = "none";
    updateDashboard();
}

function speakSentence() {
    const sentence = document.getElementById("practiceSentence").textContent;

    if (!("speechSynthesis" in window)) {
        document.getElementById("practiceMessage").textContent =
            "మీ బ్రౌజర్‌లో వాయిస్ సదుపాయం అందుబాటులో లేదు.";
        return;
    }

    const speech = new SpeechSynthesisUtterance(sentence);
    speech.lang = "en-US";
    speech.rate = 0.85;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);

    document.getElementById("practiceMessage").textContent =
        "వినండి, తర్వాత మీరు కూడా పలకండి! 🔊";
}

function nextSentence() {
    const sentences = [
        "Hello! How are you?",
        "I am learning English.",
        "Could you please help me?",
        "Thank you for your time.",
        "I would like a cup of tea."
    ];

    let index = getNumber("manaSentenceIndex");
    index = (index + 1) % sentences.length;

    localStorage.setItem("manaSentenceIndex", index);

    document.getElementById("practiceSentence").textContent =
        sentences[index];

    document.getElementById("practiceMessage").textContent =
        "కొత్త వాక్యాన్ని వినడానికి స్పీకర్ బటన్ నొక్కండి.";
}

function openAssistant() {
    let overlay = document.getElementById("assistantOverlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "assistantOverlay";

        overlay.innerHTML = `
            <div class="assistant-box">
                <button id="closeAssistant" class="close-button">✕</button>
                <h2>🤖 మీ English సహాయకుడు</h2>
                <p>English గురించి ఏదైనా అడగండి!</p>
                <div id="assistantMessages">
                    <p><b>సహాయకుడు:</b> Hello! అంటే నమస్కారం. 😊</p>
                </div>
                <input id="assistantInput"
                    type="text"
                    placeholder="మీ ప్రశ్న ఇక్కడ టైప్ చేయండి...">
                <button id="askButton">అడగండి</button>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById("closeAssistant").onclick = function() {
            overlay.style.display = "none";
        };

        document.getElementById("askButton").onclick = askAssistant;

        document.getElementById("assistantInput").addEventListener(
            "keydown",
            function(event) {
                if (event.key === "Enter") askAssistant();
            }
        );
    }

    overlay.style.display = "flex";
}

function askAssistant() {
    const input = document.getElementById("assistantInput");
    const messages = document.getElementById("assistantMessages");

    const question = input.value.trim().toLowerCase();

    if (!question) return;

    const userMessage = document.createElement("p");
    userMessage.textContent = "మీరు: " + input.value;
    messages.appendChild(userMessage);

    let answer = "";

    if (question.includes("hello") || question.includes("నమస్కారం")) {
        answer = "Hello అంటే నమస్కారం. ఉదా
```
