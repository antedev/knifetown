//Initates a hook, that checks if a detecting actor is moving around, and then triggers the activate magic stuff

Hooks.on("updateToken", (token, changes) => {
  // Check if the token has the isSpecial flag and it's set to true
  console.log(token)
  if (token.document.getFlag("world", "isDetecting")) {
    if (changes.x > 0 || changes.y > 0) {
      // Your custom logic to do something when isSpecial is true
      // For example, emit a message or add a status effect
      console.log(`${tokenData.name} is detecting and moved`);
    } else {
      // If isSpecial is not true, you can put any other logic here
      console.log(`${tokenData.name} is detecting but not moving.`);
    }
  } else {
    console.log(`${tokenData.name} is not detecting.`);
  }
});
