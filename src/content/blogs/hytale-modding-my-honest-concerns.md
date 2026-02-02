---
title: Hytale Modding - My honest concerns
description: Hytale finally released, promising modding, but iz it true?
date: 2026-02-02
---

## Hytale

For those who don't know, [Hytale](https://hytale.com) is a video game created by Hypixel Studios (the people behind Minecraft's largest server: Hypixel), which has been in development for over 7 years, and has finally been released in public beta on January 13th 2026.

Minecraft was a big part of childhood, and was what pushed me into becoming a programmer, I started by making Minecraft mods and plugins using Java.
So you can imagine how excited I was for this new game to release, especially because of the promises around great modding support.

Unfortunately, now that the game has released, and we can see how the game and it's modding support works, I have came to realize a few major problems with the way it's been designed, and unless these problems are addressed and fixed, I am unable to imagine a thriving modding community at the level Minecraft has.

## The good

First, to not be all that negative, I have to give credit to Hypixel Studios for the things they did get right when designing the game and the way modding works.

### The Entity Component System

An Entity Component System (ECS) is a somewhat old concept that has only recently became popular in the game development world, it's a way to architecture the game by composing entities out of various components, and then running systems to update components efficiently.
This is opposed to the more common approach (that Minecraft uses) which is Object-oriented programming (OOP) which creates hierarchies of entities, leading to less modularity and horrible performance.

Although Hytale's ECS is written in Java, which prevents most performance optimizations, it's still way better than OOP, both in terms of performance and in terms of developer experience.

### Official modding

Unlike Minecraft which has multiple 3rd-party providers for modding (Forge, Fabric, Spigot, and more), Hytale has a single official API.

This leads to 2 main benefits: users don't have to choose which provider to use (limiting them to only mods written for that provider) and developers don't have to port their mods to multiple providers to be more widely available.

## The bad

 I do hope Hytale succeeds, and it is a beta after all so things aren't perfect, but my concern is their next plans for modding seem to focus on less relevant things rather than solving the major issues.

### No client modding

Hytale modding is completely server-side, similar to Minecraft plugins or server-side mods.

This means that a mod's code is run solely on the server and not on the client's computer, while assets such as textures, models, sounds and configs are sent to the client to be used.

I think the logic behind this is to allow Hytale to release the original unobfuscated server source code (which Minecraft only recently done), but disallowing in their ToS any client-side modifications and reverse engineering, to still keep half of their game "private".

### Only one version

Hytale forces the client to always use the latest version, unlike Minecraft which allows going back to older versions.

Their logic is that server owners and modders only need to take into consideration the latest version of the client, which saves time.

## The ugly

At first glance, these decisions seem good and beneficial, but upon further consideration, they are actually detrimental to a thriving modding community.

### High latency lag

The largest issue with everything being on the server, is every time the client wants to do something, it must do a roundtrip by sending a request to the server and awaiting for a response, this is what ping is, how long it takes for a roundtrip.

My average ping on Minecraft is 200-300ms, that's 1/4 of a second or equivalent to 4fps, imagine how annoying it'd be to have to wait that long between pressing a button to move, to actually moving on the screen, it'd be unplayable.

Luckily there is a solution for this -- prediction (of movement), the client AND the server both calculate the location, then, the client moves there on the screen immediately, without waiting for the server.
Then once the server responds, the client checks if the results are too much out of sync, in which case it uses the server position.

Fortunately both Minecraft and Hytale implement this (if you ever got "lag backed", this is why).

But unlike Minecraft which does it for movement, blocks, chests, and more, Hytale does it to a more limited set of hardcoded things like movement, but not blocks and UIs.

Usually this wouldn't be an issue, mod creators can fix this by creating their own mod that runs on both the client and server, where the client version does the prediction, making it feel instant, unfortunately this is impossible with Hytale, this means that mods like Refined Storage will have a 1/4 of a second delay each time you try to put/take a block from the inventory, very annoying.

Another limitation of no client side modding support is the inability of adding things like custom key bindings, this can be added by Hytale, but again, with a  delay due to server roundtrip latency.

### Per-clieant customizations

Minecraft has plenty of client-side mods which allow customizing the client in a way that doesn't effect the server, this is most often used for visual effects using resource packs, shaders or additional HUD elements.

This is unfortunately impossible in Hytale beyond the few hardcoded settings that exist, due to mods being server side only, it means that at best servers can control a single global texture pack for all players that play it, but there is no individual personalized resource packs, and shaders are completely impossible.

Even community-made client-side mods by reverse engineering the client can't exist because Hytale explicitly prohibited it in their ToS and made it illegal to do.

### Version chasing

In practice, rather than helping players and modders save time, targeting only one client version causes a huge problem.

Players can't play servers that don't support the latest version of the client, If there is a breaking change to the client-server protocol, which will almost certainly happen every large version update, then players won't be able to play.

In practice this means that Hytale not only forces clients to not play older versions, they also force server owners to always run and update to the latest server version, which forces modders to update their mods to the latest version.

This is a huge problem for a bunch of reasons:

Minecraft mods/modpacks usually target every other major version, this gives mods more time to improve their mods before immediately having to work on porting to the new versions.

Mods that were abandoned and not updated to newer versions will not be playable, which is a huge issue considering the most played Minecraft modpacks (SkyFactory, GregTech, FTB) use older Minecraft versions, and have not been updated to the latest one.

Having access to older versions means that if Hytale ever makes a change the community dislikes, they can still go back and play older versions they enjoy more, similar to how some Minecraft players still play 1.8 because they prefer that PvP style.

### Lack of Big mods & modpacks

All the previous issues will likely lead to this problem, there won't be many competent developers willing to invest massive amounts of time to make high quality mods for the community.

And I don't blame them, why would you spend so much time if you have to constantly update your mods to newer versions instead of improving them, have your mods feel laggy due to high latency and have players forget them if you ever stop updating them to the latest version, and all of that, for free.
You may as well take that effort and put it into Minecraft modding.

There will certainly be attempts to replicate mods like RS/AE2, Create, Mekanism, 
Botania and others, but they will be made by less experienced beginners and will probably be inefficient and worse than their Minecraft equivalents.

### No content for players

Hytale is still in beta, and doesn't have much content yet, it only took me a few days (20-30 hours of playtime) to explore about 75% of the content (on my first and casual playthrough).

Usually this isn't a problem, except that Hytale's Community are mostly Minecraft players, the same people who expect endless content for a $20 game.

There is a reason I was able to play Minecraft almost daily for an entire decade without getting bored, and that reason is mods.

The base game eventually gets boring, there are only so many things you can do, and Hytale knows it, which is why they advertise their "Great modding capabilities" so much, they are counting on modders creating content for them for players to play.

If there are no competent modders to create popular high quality mods, then there is no content, if there is no content, players will eventually get bored and move on to other games, no players, means the game will die.

I really hope this doesn't happen, but at the current state of things, I can't see how it won't happen.

## Solutions

Let's end this on a more positive note -- what can Hytale do to fix these issues and convince modders it's worth their time?

### Multiple versions

Let's start with the easy problem - only one version, the fix is extremely simple, just add a dropdown in the launcher to select previous client versions.
Of course, I don't expect Hytale to support all these versions, by neither does Minecraft, just have them available to download, and even add a "Unsupported" text next to them.
An even nicer option would be to allow separate game profiles which contain both versions, world and settings, but this can be left as a responsibility for 3rd-party launchers (like Modrinth, and Prism in Minecraft).

### Client-side modding

For the other problem of client side modding, it's a bit more complicated and technical but still doable.

Hytale seems to have 2 main requirements that prevented it from doing client-side modding like Minecraft: security and  copyright/IP.

Minecraft client mods are inherently insecure, they have access to the client's computer, allowing malicious mods like rats, ransomware and otherwise to effect your system.

So how do we allow code execution, without opening ourselves to security, while also not exposing any details about the client code to avoid copyright/IP issues?

It's simple! Just copy what websites do!
Websites also run code on a User's computer, and yet if you go to a malicious website, they can't hack you,  the solution is by running a sandboxed programming language and then only allowing it to access an API, which decides what it is or isn't allowed to do.
In the web world, this is done using JavaScript and web APIs.

JavaScript is terribly designed, so Hytale can use something else like Lua,  then Hytale needs to write a comprehensive API allowing lua code to access all game related values on the client (player position, entities, chunks UIs, assets, etc).

This solves the security issues, lua is sandboxed and thus any malicious code can't do anything harmful, and because they only expose things via an API, Hytale doesn't have to share the client's source code.

Then, to fix both server-side latency and client-side customization: Lua scripts can be sent to the client the same way assets like textures are currently sent, this allows server-side mods to write their own client-side predictions avoiding latency, or alternatively, players can install scripts locally to only modify their client without effecting the server.

And when Hytale was owned by Riot games (before Hytale was purchased back by it's original founder Simon), they were planning on using Lua for what seemed like a very similar system to what I was proposing.

But unfortunately instead of working on that, Hytale seem to want to focus on a very complex visual scripting system for client side modding, which not only will take significantly longer to implement than what I proposed, it'd also be significantly limited and most programmers are more productive and prefer writing code in text rather than a visual scripting system.

## Conclusions

Hytale seems like a very promising game that can finally give a new fresh take on the Minecraft genre, but in its current state it has major flaws in terms of modding ability, but I believe it can be resolved by implementing my suggested solutions.

And as always, if you wish to talk to me about this topic, programming or anything else, you can contact me on discord at Kyren223 or email `contact @ kyren dot codes`.
