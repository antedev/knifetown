let detectionActive = game.scenes
  .filter((x) => x.active == true)[0]
  .getFlag("core", "detectionActive");
console.log(detectionActive);
if (detectionActive === undefined || !detectionActive) {
  // If Undefined or false, we need to get started detecting
  console.log("Let's find some loot")
  game.scenes
    .filter((x) => x.active == true)[0]
    .setFlag("core", "detectionActive", true);

  hookId = Hooks.on("updateToken", (token, changes) => {
    // Check if the token has the isDetecting flag set to true, and hit has moved
    if (token.getFlag("world", "isDetecting")) {
      if (changes.x > 0 || changes.y > 0) {
        detectMagic(token);
      } 
    }
  });

  //Save the HookId
  game.scenes
    .filter((x) => x.active == true)[0]
    .setFlag("core", "detectionHook", hookId);
} else {

    // Else we are detecting, and should just stop
  console.log("Stop searching")

  game.scenes
    .filter((x) => x.active == true)[0]
    .setFlag("core", "detectionActive", false);
  // Unregister the hook.
  hookId = game.scenes
    .filter((x) => x.active == true)[0]
    .getFlag("core", "detectionHook");

  if (hookId) {
    Hooks.off("updateToken", hookId);
  } else {
    console.log("Hook didn't exist, couldn't kill it");
  }
}


// Find all Loot och NPC tokens, if they are within range, check their inventory to see if they got som juicy magic loot
async function detectMagic(token) {
  let spellRange = 30;

  console.log("Any magic around?");
  for (const target of canvas.tokens.placeables) {
    
    if (target.actor.type == "loot" || target.actor.type == "npc") {
      const distance = await canvas.grid.measureDistance(token, target);
      if (distance <= spellRange) {
        for (const inv of target.actor.inventory) {
          for (const lootTrait of inv.traits) {
            if (lootTrait == "magical") {
              await new Sequence()
                .effect()
                    .file("jb2a.detect_magic.circle.blue")
                    .atLocation(token.center)
                    .playbackRate(2)
                .sound()
                    .file("worlds/playground/data/playlists/radar-beep-fx_140bpm.wav")
                    .fadeInAudio(500)
                    .fadeOutAudio(500)
                .play();
              return true;
            }
          }
        }
      }
    }
  }
  console.log("Nah,no loot");
}
