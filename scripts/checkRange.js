async function main() {
  // Get the controlled actor (if any)
  const controlledToken = canvas.tokens.controlled[0];

  // Get the selected target token (if any) from game.user.targets
  const targets = Array.from(game.user.targets);
  if (targets.length === 0) {
    ui.notifications.error("No target token selected.");
    return;
  }
  const targetToken = targets[0];

  // Validate controlled actor and selected target token
  if (!controlledToken) {
    ui.notifications.error("Controlled actor not found.");
    return;
  }

  if (!targetToken) {
    ui.notifications.error("Target token not found.");
    return;
  }

  // Calculate distance
  const distance = await canvas.grid.measureDistance(controlledToken, targetToken);
  console.log("Distance: ", distance)

  // Display the distance
  ChatMessage.create({
    content: `${controlledToken.name} is ${distance.toFixed(1)} feet away from ${targetToken.name}.`,
  });
}

main();