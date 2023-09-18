let token = canvas.tokens.controlled[0];
if (!token) {
  ui.notifications.warn("Oi! Select a token first!");
  return;
}

let isPrepared = token.actor.items.filter((item) => item.type === "spell" && item.spellcasting.isPrepared).find((spell) => spell.name === "Detect Magic")
if(isPrepared === undefined) {
    ui.notifications.warn("Oi! You don't know how to Detect Magic!!");
    return;
}

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
