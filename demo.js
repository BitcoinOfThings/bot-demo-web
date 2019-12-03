// Called after form input is processed
function startConnect() {
    // Generate a random client ID
    clientID = "bot-demo-ws-" + parseInt(Math.random() * 100);

    // Fetch the hostname/IP address and port number from the form
    host = document.getElementById("host").value;
    port = document.getElementById("port").value;
    isSSL = document.getElementById("usessl").checked
    usessl = (isSSL && port === "8884")
    username = "demo"
    password = "demo"

    // Print output for the user in the messages div
    document.getElementById("messages").innerHTML 
    += '<span>Connecting to: ' + host + ' on port: ' + port + '</span><br/>';
    let secureMessage = ''
    if (usessl) {
        secureMessage = 'Using encrypted connection with SSL.'
    } else {
        secureMessage = 'All communication is in PLAIN TEXT including usernames, passwords and message content and is therefore UNSECURE!'
    }
    document.getElementById("messages").innerHTML 
    += '<span>' + secureMessage + '</span><br/>';

    document.getElementById("messages").innerHTML 
    += '<span>Using clientID : ' + clientID + '</span><br/>';

    // Initialize new Paho client connection
    client = new Paho.Client(host, Number(port), clientID)

    // Set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // Connect the client, if successful, call onConnect function
    client.connect({ 
        useSSL: true,
        userName: username,
        password: password,
        onSuccess: onConnect
    });
}

// Called when the client connects
function onConnect() {
    topic = document.getElementById("topic").value

    document.getElementById("messages").innerHTML 
    += '<span>Connected. Now subscribing to: ' + topic + '</span><br/>';

    client.subscribe(topic);
}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
    console.log("onConnectionLost: Connection Lost");
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost: " + responseObject.errorMessage);
    }
}

// Called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived: " + message.payloadString);
    document.getElementById("messages").innerHTML += '<span>Topic: ' + message.destinationName + '  | ' + message.payloadString + '</span><br/>';
    updateScroll(); 
}

// Called when the disconnection button is pressed
function startDisconnect() {
    client.disconnect();
    document.getElementById("messages").innerHTML += '<span>Disconnected</span><br/>';
    updateScroll();
}

// Updates #messages div to auto-scroll
// Scroll to bottom of window
function updateScroll() {
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
}
