let token = canvas.tokens.controlled[0];
if (!token) {
  ui.notifications.warn("Oi! Select a token first!");
  return;
}

// Add code to se if the actor even knows the spell! Let's assume it does for now...

// Set the switch
let isDetecting = token.document.getFlag("world", "isDetecting");
if (isDetecting === undefined || !isDetecting) {
  // If Undefined or false, we need to get started detecting
  console.log("Lets go!");
  token.document.setFlag("world", "isDetecting", true);
  //startDetecting(token)
} else {
  // Else we are detecting, and should just stop
  token.document.setFlag("world", "isDetecting", false);
  console.log("Stoph it");
  //stopDetecting(token)
}
