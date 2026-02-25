# Specification

## Summary
**Goal:** Build "Apex Racers," a high-quality 3D browser car racing game with single-player offline mode, local split-screen multiplayer, and a persistent leaderboard.

**Planned changes:**
- Set up a 3D race track scene using React Three Fiber/Three.js with road surface, barriers, trees, grandstands, night sky, and dynamic lighting with shadows
- Create three distinct 3D car models: Nissan GT-R (gunmetal/red), Porsche 911 (silver/gold), BMW M5 (black/red), each with unique performance stats
- Implement arcade-style car physics with keyboard controls (WASD for P1, arrow keys for P2)
- Add AI-controlled opponent cars that follow the track path and complete laps
- Build single-player race mode: player vs. 2+ AI opponents, set lap count, finish screen with placement
- Build local split-screen multiplayer mode: screen divided into two independent viewports, each with its own camera and HUD
- Create main menu with Single Player, Local Multiplayer, Car Selection, and Leaderboard options
- Build car selection screen showing all three cars with side-profile previews and stats
- Implement in-race HUD per viewport: speed (km/h), lap counter (e.g., Lap 2/3), race position
- Apply dark motorsport UI theme with neon red/gold accents, bold racing fonts, and animated screen transitions
- Implement Motoko backend with stable storage for best lap times per car/mode
- Build leaderboard screen displaying top lap times with car name and timestamp

**User-visible outcome:** Players can select a car, race against AI in single-player mode or compete locally in split-screen multiplayer, view a styled HUD during races, and check persistent best lap times on a leaderboard — all within a visually rich 3D racing game in the browser.
