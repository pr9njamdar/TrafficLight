const canvas = document.getElementById('trafficLightCanvas');
const ctx = canvas.getContext('2d');

// Define the states and their transitions
const states = {
    Green: {
        next: 'Yellow',
        duration: 5000, // 5 seconds
        color: '#4dff4d',
        position: 320
    },
    Yellow: {
        next: 'Red',
        duration: 2000, // 2 seconds
        color: '#ffff4d',
        position: 200
    },
    Red: {
        next: 'Green',
        duration: 5000, // 5 seconds
        color: '#ff4d4d',
        position: 80
    }
};

// Current state and timer
let currentState = 'Green';
let timer = states[currentState].duration / 1000;

// Mock API function
// Asynchronus action within State Machine....
async function mockApiCall(state) {
    console.log(`Making an API call for the ${state} light...`);
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`API call for the ${state} light completed.`);
            resolve();
        }, 1000); // Simulate a 1-second API call
    });
}

// Draw a circle for a traffic light
function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// Draw the timer
function drawTimer(time) {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(time, canvas.width / 2, 40); // Display timer at the top
}

// Draw the entire traffic light
function drawTrafficLight(activeState, time) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Base positions for the lights
    const lightPositions = {
        Red: { x: canvas.width / 2, y: 80 },
        Yellow: { x: canvas.width / 2, y: 200 },
        Green: { x: canvas.width / 2, y: 320 }
    };

    // Draw inactive lights
    Object.keys(lightPositions).forEach(state => {
        const position = lightPositions[state];
        drawCircle(position.x, position.y, 40, 'grey');
    });

    // Draw active light
    const activePosition = lightPositions[activeState];
    drawCircle(activePosition.x, activePosition.y, 40, states[activeState].color);

    // Draw the timer
    drawTimer(time);
}

// State transition and timer countdown logic
async function transitionToNextState() {
    drawTrafficLight(currentState, timer); // Draw the initial state with the timer

    // Perform the API call before transitioning
   await mockApiCall(currentState);

    // Countdown every second
    const interval = setInterval(() => {
        timer--;
        drawTrafficLight(currentState, timer);

        if (timer <= 0) {
            clearInterval(interval); // Stop countdown when timer hits 0
            currentState = states[currentState].next; // Move to the next state
            timer = states[currentState].duration / 1000; // Reset the timer for the new state
            transitionToNextState(); // Recursively transition to the next state
        }
    }, 1000);
}

// Start the traffic light
transitionToNextState();



