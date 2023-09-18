main()

async function main() {
    // Get Selected
    let selected = canvas.tokens.controlled;
    if (selected.length > 1) {
        ui.notifications.error("Please select only one token")
        return;
    }
    let selected_actor = selected[0].actor;
    // Get Target
    let targets = Array.from(game.user.targets)
    if (targets.length == 0 || targets.length > 1) {
        ui.notifications.error("Please target one token");
        return;
    }
    let target_actor = targets[0].actor;

    // console.log("Powerful Strike",)

    // console.log("target_Actor AC: ", target_actor.armorClass?.value)

    // Select Weapon
    // Why Filter instead of Find?
    let actorWeapons = selected_actor.items.filter(item => item.type == "weapon" && item.isHeld)
    // console.log("Actor weapons: ", actorWeapons)

    if (actorWeapons.length == 0) {
        ui.notification.error("No weapon held");
        return;
    }
    else if (actorWeapons.length == 1) {
        let wep = selected_actor.system.actions.find(x => x.item._id == actorWeapons[0].id)
        await rollAttack(wep, null, target_actor);

        // // Roll Attack
        // let newRollString = `1d20 + ${wep.totalModifier}`

        // // console.log("New rolls string: ", newRollString)

        // let roll = await new Roll(newRollString).roll();
        // // console.log("Roll: ", roll)

        // // See if Attack is Greater than their armor, if so
        // let result = roll.total
        // // console.log(result)

        // // Print Chat with Button to Roll Damage
        // let chatTemplate = ""

        // let armor = target_actor.armorClass?.value ? target_actor.armorClass?.value : 0;
        // if (result >= armor + 10) {
        //     chatTemplate = `
        //     <p> Rolled: <b>${result}!</b></p>
        //     <p> The strike is true resulting in a </p>
        //     <p> tremendous blow against ${target_actor.name}</p>
        //     <p> It's a Critical Hit! </p>
        //     <p> <button id="rollCriticalDamage">Roll Damage</button></p>
        //     `
        // }
        // else if (result >= armor) {
        //     chatTemplate = `
        //     <p> Rolled: <b>${result}!</b></p>            
        //     <p> ${target_actor.name} is too </p>
        //     <p> slow to get away from the blow. </p>            
        //     <p> It's a Hit! </p>
        //     <p> <button id="rollDamage">Roll Damage</button></p>
        //     `
        // } else {
        //     chatTemplate = `
        //     <p> Rolled: <b>${result}!</b> </p>
        //     <p> ${target_actor.name} easilly deflect the strike </p>            
        //     <p> It's a Miss! </p>
        //     `
        // }
        // ChatMessage.create({
        //     speaker: {
        //         alias: selected_actor.name
        //     },
        //     content: chatTemplate,
        //     roll: roll
        // })

        // // Roll Damage
        // Hooks.once('renderChatMessage', (chatItem, html) => {
        //     html.find("#rollDamage").click(() => {
        //         wep.damage.call()
        //     })
        // })

        // // Roll Critical Damage
        // Hooks.once('renderChatMessage', (chatItem, html) => {
        //     html.find("#rollCriticalDamage").click(() => {
        //         wep.critical.call()
        //     })
        // })
    }
    else {

        let actorActions = selected_actor.system.actions
        console.log("Actor actions: ", actorActions)

        let weaponOptions = ""
        for (let item of actorWeapons) {
            weaponOptions += `<option value=${item._id}>${item.data._source.name} | ATK: ${actorActions.find(action => action.item._id == item._id).totalModifier}</option>`
        }
        console.log("Weapon options: ", weaponOptions)


        let dialogTemplate = `
        <h1> Pick a weapon </h1>
        <div style="display:flex">
            <div  style="flex:1"><select id="weapon">${weaponOptions}</select></div>
            <span style="flex:1">Mod <input  id="mod" type="number" style="width:50px;float:right" value=0 /></span>    
            </div>
        `

        new Dialog({
            title: "Roll Attack",
            content: dialogTemplate,
            buttons: {
                rollAtk: {
                    label: "Roll Attack",
                    callback: async (html) => {
                        let wepID = html.find("#weapon")[0].value;
                        let wep = actorActions.find(x => x.item._id == wepID)
                        let modifier = html.find("#mod")[0].value;

                        // Roll Attack
                        let newRollString = `1d20 + ${wep.totalModifier} + ${modifier}`

                        console.log("New rolls string: ", newRollString)

                        let roll = await new Roll(newRollString).roll();
                        console.log("Roll: ", roll)

                        // See if Attack is Greater than their armor, if so
                        let result = roll.total
                        console.log(result)

                        // Print Chat with Button to Roll Damage
                        let chatTemplate = ""

                        let armor = target_actor.armorClass?.value ? target_actor.armorClass?.value : 0;
                        if (result >= armor + 10) {
                            chatTemplate = `
                            <p> Rolled: ${result} against ${armor} Target Armor </p>
                            <p> It was a Critical Hit! </p>
                            <p> <button id="rollCriticalDamage">Roll Damage</button></p>
                            `
                        }
                        else if (result >= armor) {
                            chatTemplate = `
                            <p> Rolled: ${result} against ${armor} Target Armor </p>
                            <p> It was a Hit! </p>
                            <p> <button id="rollDamage">Roll Damage</button></p>
                            `
                        } else {
                            chatTemplate = `
                            <p> Rolled: ${result} against ${armor} Target Armor </p>
                            <p> It was a Miss! </p>
                            `
                        }
                        ChatMessage.create({
                            speaker: {
                                alias: selected_actor.name
                            },
                            content: chatTemplate,
                            roll: roll
                        })

                        // Roll Damage
                        Hooks.once('renderChatMessage', (chatItem, html) => {
                            html.find("#rollDamage").click(() => {
                                wep.damage.call()
                            })
                        })

                        // Roll Critical Damage
                        Hooks.once('renderChatMessage', (chatItem, html) => {
                            html.find("#rollCriticalDamage").click(() => {
                                wep.critical.call()
                            })
                        })
                    }
                },
                close: {
                    label: "Close"
                }
            }
        }).render(true)
    }
}

async function rollAttack(weaponActor, attackModifier, targetActor) {
        console.log("Entering rollAttack function")
    // Roll Attack
    let newRollString = `1d20 + ${weaponActor.totalModifier}`;
    console.log("newRollString:" + newRollString);

    if (attackModifier != null && attackModifier != 0) {
        newRollString += ` + ${attackModifier}`
    }

    let roll = await new Roll(newRollString).roll();
    
    // See if Attack is Greater than their armor, if so
    let result = roll.total

    // Print Chat with Button to Roll Damage
    let chatTemplate = ""

    let armor = targetActor.armorClass?.value ? targetActor.armorClass?.value : 0;

    // TODO: Check if there are modifiers that should be applied to the AC value. like flat footed?  

    if (result >= armor + 10) {
        chatTemplate = `
            <p> Rolled: <b>${result}!</b></p>
            <p> The strike is true resulting in a </p>
            <p> tremendous blow against ${targetActor.name}</p>
            <p> It's a Critical Hit! </p>
            <p> <button id="rollCriticalDamage">Roll Damage</button></p>
            `
    }
    else if (result >= armor) {
        chatTemplate = `
            <p> Rolled: <b>${result}!</b></p>            
            <p> ${targetActor.name} is too </p>
            <p> slow to get away from the blow. </p>            
            <p> It's a Hit! </p>
            <p> <button id="rollDamage">Roll Damage</button></p>
            `
    } else {
        chatTemplate = `
            <p> Rolled: <b>${result}!</b> </p>
            <p> ${targetActor.name} easilly deflect the strike </p>            
            <p> It's a Miss! </p>
            `
    }
    ChatMessage.create({
        speaker: {
            alias: weaponActor.name
        },
        content: chatTemplate,
        roll: roll
    })

    // Roll Damage
    Hooks.once('renderChatMessage', (chatItem, html) => {
        html.find("#rollDamage").click(() => {
            weaponActor.damage.call()
        })
    })

    // Roll Critical Damage
    Hooks.once('renderChatMessage', (chatItem, html) => {
        html.find("#rollCriticalDamage").click(() => {
            weaponActor.critical.call()
        })
    })
}

async function weaponSelectionsDialogue(actorActions, actorWeapons) {
    let weaponOptions = ""
    for (let item of actorWeapons) {
        weaponOptions += `<option value=${item._id}>${item.data._source.name} | ATK: ${actorActions.find(action => action.item._id == item._id).totalModifier}</option>`
    }

    let dialogTemplate = `
    <h1> Pick a weapon </h1>
    <div style="display:flex">
        <div  style="flex:1"><select id="weapon">${weaponOptions}</select></div>
        <span style="flex:1">Mod <input  id="mod" type="number" style="width:50px;float:right" value=0 /></span>    
        </div>
    `

    new Dialog({
        title: "Roll Attack",
        content: dialogTemplate,
        buttons: {
            rollAtk: {
                label: "Roll Attack",
                callback: async (html) => {
                    let wepID = html.find("#weapon")[0].value;
                    let wep = actorActions.find(x => x.item._id == wepID)
                    let modifier = html.find("#mod")[0].value;
                    var weaponAndModifier =
                    {
                        weaponActor: wep,
                        attackModifier: modifier
                    }
                    return weaponAndModifier;
                },
                close: {
                    label: "Close"
                }
            }
        }
    }).render(true)

}