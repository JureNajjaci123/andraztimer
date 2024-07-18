let timer = 3 * 3600; // 3 ure v sekundah
let interval;
let socket;

function startTimer() {
    interval = setInterval(() => {
        if (timer > 0) {
            timer--;
            document.getElementById("timer").innerText = formatTime(timer);
            sendTimeToOBS();
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

function addTime(seconds) {
    timer += seconds;
    document.getElementById("timer").innerText = formatTime(timer);
    sendTimeToOBS();
}

function formatTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

function pad(num) {
    return num < 10 ? '0' + num : num;
}

function sendTimeToOBS() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ timer: formatTime(timer) }));
    }
}

function connectWebSocket() {
    socket = new WebSocket('ws://localhost:4444'); // predpostavljamo, da je WebSocket strežnik za OBS na tem naslovu

    socket.onopen = function(event) {
        console.log('Connected to OBS WebSocket');
        sendTimeToOBS();
    };

    socket.onclose = function(event) {
        console.log('Disconnected from OBS WebSocket');
    };

    socket.onerror = function(error) {
        console.error('WebSocket Error:', error);
    };

    socket.onmessage = function(event) {
        console.log('WebSocket Message:', event.data);
    };
}

document.getElementById("timer").innerText = formatTime(timer);
connectWebSocket();
startTimer();
