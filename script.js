// Navigation functionality
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Drawing Canvas functionality
let canvas, ctx, isDrawing = false, lastX = 0, lastY = 0;

function initCanvas() {
    canvas = document.getElementById('drawingCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 300;
    
    // Set initial styles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    if (e.type === 'touchstart') {
        isDrawing = true;
        [lastX, lastY] = [x, y];
    } else if (e.type === 'touchmove' && isDrawing) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        [lastX, lastY] = [x, y];
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveDrawing() {
    const link = document.createElement('a');
    link.download = 'ai-friend-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Color picker and brush size
document.addEventListener('DOMContentLoaded', function() {
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    
    if (colorPicker) {
        colorPicker.addEventListener('change', function() {
            ctx.strokeStyle = this.value;
        });
    }
    
    if (brushSize) {
        brushSize.addEventListener('input', function() {
            ctx.lineWidth = this.value;
        });
    }
});

// Quiz functionality
const quizQuestions = [
    {
        question: "What does AI stand for?",
        options: ["Artificial Intelligence", "Amazing Ideas", "Awesome Internet", "Active Imagination"],
        correct: 0
    },
    {
        question: "Which of these is an AI tool?",
        options: ["ChatGPT", "Calculator", "Camera", "Clock"],
        correct: 0
    },
    {
        question: "What can AI help you do?",
        options: ["Tell stories", "Draw pictures", "Play games", "All of the above"],
        correct: 3
    },
    {
        question: "How do computers think?",
        options: ["Like humans", "Following step-by-step instructions", "With emotions", "Randomly"],
        correct: 1
    },
    {
        question: "What is a sequence in programming?",
        options: ["A type of computer", "Step-by-step instructions", "A game", "A color"],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;

function initQuiz() {
    showQuestion();
}

function showQuestion() {
    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');
    
    if (!questionEl || !optionsEl || currentQuestion >= quizQuestions.length) {
        showQuizResults();
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    questionEl.textContent = question.question;
    
    optionsEl.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('div');
        button.className = 'quiz-option';
        button.textContent = option;
        button.addEventListener('click', () => selectAnswer(index));
        optionsEl.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    const options = document.querySelectorAll('.quiz-option');
    const correctIndex = quizQuestions[currentQuestion].correct;
    
    options.forEach((option, index) => {
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex && selectedIndex !== correctIndex) {
            option.classList.add('incorrect');
        }
        option.style.pointerEvents = 'none';
    });
    
    if (selectedIndex === correctIndex) {
        score++;
    }
    
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 2000);
}

function showQuizResults() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;
    
    const percentage = Math.round((score / quizQuestions.length) * 100);
    quizContainer.innerHTML = `
        <h3>Quiz Complete! 🎉</h3>
        <p>You got ${score} out of ${quizQuestions.length} questions correct!</p>
        <p>That's ${percentage}%!</p>
        <button class="btn btn-primary" onclick="resetQuiz()">Try Again</button>
    `;
    
    if (percentage >= 80) {
        addConfetti();
    }
}

function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    initQuiz();
}

function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

// Progress tracking
function updateProgress(stage, progress) {
    const progressFill = document.querySelector(`[data-stage="${stage}"] .progress-fill`);
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
        progressFill.setAttribute('data-progress', progress);
    }
}

// Checkbox functionality for progress
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
            const totalCount = checkboxes.length;
            const progress = Math.round((checkedCount / totalCount) * 100);
            
            // Update progress for bonus stage
            updateProgress('bonus', progress);
            
            // Save to localStorage
            localStorage.setItem('activityProgress', progress);
        });
        
        // Load saved state
        const savedProgress = localStorage.getItem('activityProgress');
        if (savedProgress) {
            updateProgress('bonus', parseInt(savedProgress));
        }
    });
});

// Modal functionality
const modal = document.getElementById('activityModal');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.close');

function showActivityModal(activityType) {
    const content = getActivityContent(activityType);
    modalContent.innerHTML = content;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function getActivityContent(activityType) {
    const activities = {
        'story-time': `
            <h2>📚 AI Storytime with ChatGPT</h2>
            <p>Ask ChatGPT to tell you a story with your name in it!</p>
            <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>Try these prompts:</h3>
                <ul style="text-align: left; margin-left: 20px;">
                    <li>"Can you tell me a story about a lion who wanted to fly?"</li>
                    <li>"Make up a story where [Your Name] finds a magic paintbrush!"</li>
                    <li>"Create a funny story about [Your Name] and a talking dog!"</li>
                    <li>"Tell me a story about a robot who learns to dance"</li>
                </ul>
            </div>
            <div style="background: #fff5f5; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p><strong>Activity:</strong> After the story, let your child draw scenes from it!</p>
            </div>
            <a href="https://chat.openai.com" target="_blank" class="btn btn-primary">Visit ChatGPT</a>
        `,
        'picture-maker': `
            <h2>🎨 Silly Art with DALL·E</h2>
            <p>Use DALL·E to create amazing pictures just by describing them!</p>
            <div style="background: #fff5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>Fun ideas to try:</h3>
                <ul style="text-align: left; margin-left: 20px;">
                    <li>"A penguin eating spaghetti on a trampoline"</li>
                    <li>"A rainbow-colored elephant dancing"</li>
                    <li>"A robot making pancakes in a treehouse"</li>
                    <li>"A dragon playing with a ball of yarn"</li>
                    <li>"A cat wearing a superhero cape"</li>
                </ul>
            </div>
            <div style="background: #f0fff4; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p><strong>Activity:</strong> Print and color the pictures together!</p>
            </div>
            <a href="https://openai.com/dall-e-2" target="_blank" class="btn btn-primary">Visit DALL·E</a>
        `,
        'quick-draw': `
            <h2>✏️ Guessing Game with Quick, Draw!</h2>
            <p>Draw and see if AI can guess what you're drawing! It's like playing Pictionary with a computer.</p>
            <div style="background: #f0fff4; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>Try drawing:</h3>
                <ul style="text-align: left; margin-left: 20px;">
                    <li>A cat</li>
                    <li>A house</li>
                    <li>A tree</li>
                    <li>Your favorite animal</li>
                    <li>A car</li>
                    <li>A flower</li>
                </ul>
            </div>
            <div style="background: #fff3e0; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p><strong>Learning:</strong> Watch how the computer learns from your drawings!</p>
            </div>
            <a href="https://quickdraw.withgoogle.com" target="_blank" class="btn btn-primary">Play Quick, Draw!</a>
        `,
        'scratch-jr': `
            <h2>🧩 Code a Game with Scratch Jr or Scratch</h2>
            <p>Make your own animations and games with drag-and-drop coding!</p>
            <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>Project ideas:</h3>
                <ul style="text-align: left; margin-left: 20px;">
                    <li>A cat that meows and walks across the screen</li>
                    <li>A car that drives and honks its horn</li>
                    <li>Two characters having a conversation</li>
                    <li>A bouncing ball game</li>
                    <li>A dance party with multiple characters</li>
                </ul>
            </div>
            <div style="background: #f0f8ff; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p><strong>Skills learned:</strong> Sequencing, logic, and creative problem-solving!</p>
            </div>
            <a href="https://www.scratchjr.org" target="_blank" class="btn btn-primary">Visit Scratch Jr</a>
        `,
        'lightbot': `
            <h2>🤖 Puzzle Bot with Lightbot</h2>
            <p>Solve programming puzzles with a cute robot! Learn about sequences and loops.</p>
            <div style="background: #fff5e6; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>What you'll learn:</h3>
                <ul style="text-align: left; margin-left: 20px;">
                    <li>How to give step-by-step instructions</li>
                    <li>Using loops to repeat actions</li>
                    <li>Problem-solving skills</li>
                    <li>Logical thinking</li>
                    <li>Pattern recognition</li>
                </ul>
            </div>
            <div style="background: #f0fff4; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p><strong>Perfect for:</strong> Kids who love puzzles and logical thinking!</p>
            </div>
            <a href="https://lightbot.com" target="_blank" class="btn btn-primary">Play Lightbot</a>
        `,
        'data-detective': `
            <h2>🔍 Snack Sorting (Data Detective Game)</h2>
            <p>Practice sorting and organizing like a computer!</p>
            <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>Activities to try:</h3>
                <ul style="text-align: left; margin-left: 20px;">
                    <li>Sort your toys by color, then by size</li>
                    <li>Count different types of snacks in your pantry</li>
                    <li>Make a chart of your family's favorite colors</li>
                    <li>Organize your books by thickness</li>
                    <li>Group M&Ms by color and count each group</li>
                </ul>
            </div>
            <div style="background: #fff3e0; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p><strong>Question:</strong> What patterns did you notice? Turn your findings into a chart!</p>
            </div>
        `,
        'teachable-machine': `
            <h2>🎓 Train a Model with Teachable Machine</h2>
            <p>Teach an AI to recognize different things using your camera!</p>
            <div style="background: #f0fff4; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>Fun projects to try:</h3>
                <ul style="text-align: left; margin-left: 20px;">
                    <li><strong>Emotion Detector:</strong> Train it to recognize happy vs. sad faces</li>
                    <li><strong>Pet Classifier:</strong> Teach it the difference between cats and dogs</li>
                    <li><strong>Object Sorter:</strong> Train it to recognize different toys</li>
                    <li><strong>Sound Classifier:</strong> Teach it different musical instruments</li>
                    <li><strong>Color Detector:</strong> Train it to recognize different colors</li>
                </ul>
            </div>
            <div style="background: #f0f8ff; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p><strong>Learning:</strong> See how AI learns from examples you provide!</p>
            </div>
            <a href="https://teachablemachine.withgoogle.com" target="_blank" class="btn btn-primary">Visit Teachable Machine</a>
        `,
        'voiceflow': `
            <h2>💬 Create a Voice Assistant with Voiceflow</h2>
            <p>Build your own AI assistant! Give it a personality and teach it to help people.</p>
            <div style="background: #fff5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>AI character ideas:</h3>
                <ul style="text-align: left; margin-left: 20px;">
                    <li><strong>Study Buddy:</strong> Helps with homework and asks quiz questions</li>
                    <li><strong>Pet Care Assistant:</strong> Reminds you to feed your pet</li>
                    <li><strong>Joke Teller:</strong> Tells funny jokes and riddles</li>
                    <li><strong>Story Creator:</strong> Helps you write creative stories</li>
                    <li><strong>Weather Helper:</strong> Gives weather updates and clothing suggestions</li>
                </ul>
            </div>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p><strong>Advanced:</strong> Create conversations and decision trees!</p>
            </div>
            <a href="https://voiceflow.com" target="_blank" class="btn btn-primary">Visit Voiceflow</a>
        `,
        'ai-art-gallery': `
            <h2>🎨 AI Art Gallery</h2>
            <p>Use DALL·E to create art on different themes and build your own gallery!</p>
            <div style="background: #fff5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>Gallery themes to try:</h3>
                <ul style="text-align: left; margin-left: 20px;">
                    <li>"Magic forest with glowing mushrooms"</li>
                    <li>"Robot zoo with mechanical animals"</li>
                    <li>"Underwater city with fish people"</li>
                    <li>"Space playground with floating equipment"</li>
                    <li>"Candy land with edible buildings"</li>
                </ul>
            </div>
            <div style="background: #f0fff4; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p><strong>Display:</strong> Print your favorite images and create a gallery wall!</p>
            </div>
            <a href="https://openai.com/dall-e-2" target="_blank" class="btn btn-primary">Create Art!</a>
        `,
        'storybook-project': `
            <h2>📚 AI Storybook Project</h2>
            <p>Co-write a 5-page picture book using ChatGPT + DALL·E. Print and read it as bedtime stories.</p>
            <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>Steps:</h3>
                <ol style="text-align: left; margin-left: 20px;">
                    <li>Ask ChatGPT to create a story outline with 5 scenes</li>
                    <li>Generate images with DALL·E for each page</li>
                    <li>Print and assemble your book</li>
                    <li>Read together as a family</li>
                </ol>
            </div>
            <div style="background: #fff5f5; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <h3>Story prompts to try:</h3>
                <ul style="text-align: left; margin-left: 20px;">
                    <li>"A robot who learns to paint"</li>
                    <li>"A magical library where books come to life"</li>
                    <li>"A friendship between a cat and a bird"</li>
                </ul>
            </div>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p><strong>Materials needed:</strong> Paper, printer, scissors, glue, markers for decoration</p>
            </div>
        `,
        'robot-game': `
            <h2>🎲 Board Game: "Robot Helper"</h2>
            <p>Design a board game where your robot must help grandma find her cat.</p>
            <div style="background: #fff5e6; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>Materials needed:</h3>
                <ul style="text-align: left; margin-left: 20px;">
                    <li>Poster board or cardboard</li>
                    <li>Markers and stickers</li>
                    <li>Dice or spinner</li>
                    <li>Small toys for game pieces</li>
                    <li>Construction paper for cards</li>
                </ul>
            </div>
            <div style="background: #f0f8ff; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <h3>Game elements to include:</h3>
                <ul style="text-align: left; margin-left: 20px;">
                    <li>Robot character that moves around the board</li>
                    <li>Obstacles and helpers along the way</li>
                    <li>Special cards with robot commands</li>
                    <li>Goal: Find the cat and bring it home</li>
                </ul>
            </div>
            <div style="background: #f0fff4; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p><strong>Learning:</strong> Practice programming concepts through play!</p>
            </div>
        `,
        'treasure-box': `
            <h2>📦 AI Treasure Box</h2>
            <p>Decorate a real box. Fill with "data cards" (colors, numbers, feelings). Use for sorting and storytelling games.</p>
            <div style="background: #fff3e0; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>What to include:</h3>
                <ul style="text-align: left; margin-left: 20px;">
                    <li>Color cards (red, blue, green, yellow, purple, orange)</li>
                    <li>Number cards (1-10)</li>
                    <li>Emotion cards (happy, sad, excited, surprised, angry)</li>
                    <li>Object cards (cat, car, tree, house, flower, star)</li>
                    <li>Action cards (run, jump, dance, sleep, eat)</li>
                </ul>
            </div>
            <div style="background: #f0f8ff; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <h3>Games to play:</h3>
                <ul style="text-align: left; margin-left: 20px;">
                    <li>Sort cards by category</li>
                    <li>Create stories using random cards</li>
                    <li>Pattern matching games</li>
                    <li>Memory games</li>
                </ul>
            </div>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p><strong>Materials:</strong> Shoebox, construction paper, markers, scissors, glue</p>
            </div>
        `
    };
    
    return activities[activityType] || '<h2>Activity</h2><p>This activity is coming soon!</p>';
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

window.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initMobileMenu();
    initProgressBar();
    initScrollAnimations();
    initSmoothScrolling();
    initActiveNavigation();
    initCanvas();
    initQuiz();
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll('.stage-card, .activity-card, .tool-card, .tip-card, .family-project-card, .big-idea-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Progress tracking for stages
    const stageCards = document.querySelectorAll('.stage-card');
    stageCards.forEach((card, index) => {
        const stage = index + 1;
        const progress = Math.min(100, Math.random() * 30 + 20); // Random progress for demo
        updateProgress(stage, progress);
    });
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Add some fun interactive elements
function addConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Add confetti animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// Progress bar functionality
function initProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const slides = document.querySelectorAll('.slide');
    
    if (progressFill && slides.length > 0) {
        function updateProgress() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressFill.style.width = Math.min(scrollPercent, 100) + '%';
        }
        
        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial call
    }
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll([
        '.animate-fade-in',
        '.animate-fade-in-delay',
        '.animate-fade-in-delay-2',
        '.animate-fade-in-delay-3',
        '.animate-slide-up',
        '.animate-slide-up-delay',
        '.animate-slide-up-delay-2',
        '.animate-slide-up-delay-3',
        '.animate-slide-right',
        '.animate-slide-left',
        '.animate-slide-left-delay',
        '.animate-slide-left-delay-2',
        '.animate-fade-in-up',
        '.animate-scale-in',
        '.animate-bounce',
        '.animate-bounce-delay',
        '.animate-bounce-delay-2'
    ].join(','));
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'none';
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        animatedElements.forEach(element => {
            // Set initial state
            element.style.opacity = '0';
            element.style.transform = getInitialTransform(element);
            observer.observe(element);
        });
    }
}

function getInitialTransform(element) {
    if (element.classList.contains('animate-fade-in') || 
        element.classList.contains('animate-fade-in-delay') ||
        element.classList.contains('animate-fade-in-delay-2') ||
        element.classList.contains('animate-fade-in-delay-3') ||
        element.classList.contains('animate-fade-in-up')) {
        return 'translateY(30px)';
    } else if (element.classList.contains('animate-slide-up') ||
               element.classList.contains('animate-slide-up-delay') ||
               element.classList.contains('animate-slide-up-delay-2') ||
               element.classList.contains('animate-slide-up-delay-3') ||
               element.classList.contains('animate-bounce') ||
               element.classList.contains('animate-bounce-delay') ||
               element.classList.contains('animate-bounce-delay-2')) {
        return 'translateY(50px)';
    } else if (element.classList.contains('animate-slide-right')) {
        return 'translateX(-50px)';
    } else if (element.classList.contains('animate-slide-left') ||
               element.classList.contains('animate-slide-left-delay') ||
               element.classList.contains('animate-slide-left-delay-2')) {
        return 'translateX(50px)';
    } else if (element.classList.contains('animate-scale-in')) {
        return 'scale(0.8)';
    }
    return 'translateY(30px)';
}

// Smooth scrolling for scroll indicator
function initSmoothScrolling() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const nextSlide = document.querySelector('#slide2');
            if (nextSlide) {
                nextSlide.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Active navigation highlighting
function initActiveNavigation() {
    const sections = document.querySelectorAll('.slide');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length > 0 && navLinks.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const currentSection = entry.target.id;
                        
                        // Remove active class from all nav links
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                        });
                        
                        // Add active class to current nav link
                        const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
                        if (activeLink) {
                            activeLink.classList.add('active');
                        }
                    }
                });
            },
            {
                threshold: 0.6,
                rootMargin: '0px 0px -20% 0px'
            }
        );
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
}

// Chart animation for slide 1
function animateCharts() {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    chartBars.forEach(bar => {
        if (bar.classList.contains('growing')) {
            bar.style.height = '90%';
        } else if (bar.classList.contains('shrinking')) {
            bar.style.height = '30%';
        }
    });
}

// Initialize chart animations when slide 1 is visible
function initChartAnimations() {
    const slide1 = document.querySelector('#slide1');
    
    if (slide1) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(animateCharts, 500);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        observer.observe(slide1);
    }
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    const slides = document.querySelectorAll('.slide');
    const currentSlideIndex = getCurrentSlideIndex();
    
    switch(e.key) {
        case 'ArrowDown':
        case 'PageDown':
            e.preventDefault();
            if (currentSlideIndex < slides.length - 1) {
                scrollToSlide(currentSlideIndex + 1);
            }
            break;
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            if (currentSlideIndex > 0) {
                scrollToSlide(currentSlideIndex - 1);
            }
            break;
        case 'Home':
            e.preventDefault();
            scrollToSlide(0);
            break;
        case 'End':
            e.preventDefault();
            scrollToSlide(slides.length - 1);
            break;
    }
});

function getCurrentSlideIndex() {
    const slides = document.querySelectorAll('.slide');
    const scrollTop = window.pageYOffset;
    
    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const slideTop = slide.offsetTop;
        const slideHeight = slide.offsetHeight;
        
        if (scrollTop >= slideTop - 100 && scrollTop < slideTop + slideHeight - 100) {
            return i;
        }
    }
    return 0;
}

function scrollToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    if (index >= 0 && index < slides.length) {
        slides[index].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add touch/swipe support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const currentSlideIndex = getCurrentSlideIndex();
    const slides = document.querySelectorAll('.slide');
    
    if (touchStartY - touchEndY > swipeThreshold) {
        // Swiped up - go to next slide
        if (currentSlideIndex < slides.length - 1) {
            scrollToSlide(currentSlideIndex + 1);
        }
    } else if (touchEndY - touchStartY > swipeThreshold) {
        // Swiped down - go to previous slide
        if (currentSlideIndex > 0) {
            scrollToSlide(currentSlideIndex - 1);
        }
    }
}

// Initialize additional animations
function initAdditionalAnimations() {
    // Animate skill cards on hover
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animate tool items on hover
    const toolItems = document.querySelectorAll('.tool-item');
    toolItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Animate CTA items
    const ctaItems = document.querySelectorAll('.cta-item');
    ctaItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Add parallax effect to backgrounds
function initParallaxEffect() {
    const slides = document.querySelectorAll('.slide');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        slides.forEach((slide, index) => {
            const speed = 0.5;
            const yPos = -(scrollTop * speed);
            slide.style.backgroundPosition = `center ${yPos}px`;
        });
    });
}

// Initialize all additional features
document.addEventListener('DOMContentLoaded', function() {
    initChartAnimations();
    initAdditionalAnimations();
    initParallaxEffect();
});

// Add loading animation
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
    
    // Trigger initial animations
    const firstSlideElements = document.querySelectorAll('#slide1 [class*="animate-"]');
    firstSlideElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        }, index * 200);
    });
});

// Add window resize handler
window.addEventListener('resize', function() {
    // Recalculate progress bar on resize
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressFill.style.width = Math.min(scrollPercent, 100) + '%';
    }
});

// Add social link functionality
function initSocialLinks() {
    const linkedinLink = document.querySelector('.social-link.linkedin');
    const emailLink = document.querySelector('.social-link.email');
    
    if (linkedinLink) {
        linkedinLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Replace with your actual LinkedIn URL
            window.open('https://linkedin.com/in/victor-adekunle', '_blank');
        });
    }
    
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Replace with your actual email
            window.location.href = 'mailto:victor.adekunle@example.com?subject=Digital Skills Inquiry&body=Hi Victor, I saw your presentation on digital skills and would like to connect.';
        });
    }
}

// Initialize social links
document.addEventListener('DOMContentLoaded', function() {
    initSocialLinks();
});

// Add scroll-based navbar background changes
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Initialize navbar effects
document.addEventListener('DOMContentLoaded', function() {
    initNavbarEffects();
});

// Add performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll listeners
const optimizedScrollHandler = debounce(function() {
    // Progress bar update
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressFill.style.width = Math.min(scrollPercent, 100) + '%';
    }
    
    // Navbar effects
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const scrollTop = window.pageYOffset;
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler); 