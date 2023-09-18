let token = canvas.tokens.controlled[0];
if (!token) {
    ui.notifications.warn("Oi! Select a token first!");
    return
}

// Add code to se if the actor even knows the spell! Let's assume it does for now... 

// Set the switch 
let isDetecting = token.document.getFlag('world', 'isDetecting');
if (isDetecting === undefined || !isDetecting) {
    // If Undefined or false, we need to get started detecting
    startDetecting(token)
} else {
    // Else we are detecting, and should just stop
    stopDetecting(token)
} 

//Register hook 


function startDetecting(token) {
    token.document.setFlag('world', 'isDetecting', true)
    let hookId = Hooks.on("updateToken", (token, changes) => {
        // Save the Hook-ID
        token.document.setFlag('world','hookId', hookId)
        if (changes.x > 0 || changes.y > 0) {
            setMagicAura(detectMagic())
        }
    });

}

function stopDetecting(token) {
    token.document.setFlag('world', 'isDetecting', false)
    Hooks.off( token.document.getFlag('world','hookId', hookId))
}

function detectMagic() {

    let spellRange = 30

    // Basic scale and distance variables
    const gridScaleFactor = canvas.grid.grid.options.dimensions.distance / canvas.grid.grid.options.dimensions.size;
    let relativeDistanceX, relativeDistanceY, relativeDistance;

    for (const token of canvas.tokens.placeables) {

        // Find all loot tokens, go through the Inventory in them and find all items with the magical trait. If found, calculate the distance
        if (token.actor.type == "loot") {
            for (const inv of token.actor.inventory) {
                for (const loot of inv.traits) {
                    if (loot == "magical") {
                        relativeDistanceX = Math.abs(korgaToken.center.x - token.center.x);
                        relativeDistanceY = Math.abs(korgaToken.center.y - token.center.y);
                        relativeDistance = Math.floor(Math.sqrt(relativeDistanceX ** 2 + relativeDistanceY ** 2) * gridScaleFactor);

                        // There is magic around!
                        if (relativeDistance <= spellRange) { 
                            console.log("We got magic loot!")
                            return true 
                        } else {
                            console.log("No magix")
                        }
                    }
                }
            }
        }
    }
}

async function setMagicAura(magicAround) {
    if (magicAround) {
        await token.document.update({
            light: {
                color: "#C000C0",
                bright: 30,
                animation: {
                    speed: 1,
                    intensity: 2,
                    reverse: false,
                    type: "torch",
                },
            },
        });
    } else {
        await token.document.update({
            light: {
                color: "#000000",
                bright: 0,
                animation: {
                    speed: 5,
                    intensity: 5,
                    reverse: false,
                },
                
            },
        });
    }
}