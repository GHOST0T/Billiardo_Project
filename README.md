graph TD
    %% Base Layer
    Index[index.html] -->|Initial Entry| Main[main.js]
    Style[style.css] -->|Viewport Isolation| Index

    %% Core Orchestrator
    subgraph Core_Orchestrator [The Macro Orchestrator]
        Main -->|Instantiates| Table[Table.js]
        Main -->|Instantiates| Physics[Physics.js]
        Main -->|Instantiates & Arrays| Ball[Ball.js]
        Main -->|Instantiates| Cue[Cue.js]
    end

    %% View & Physics Flow
    subgraph Simulation_Engine [The Physics & View Pipe]
        Table -->|Procedural Generation| Room[createRoomEnvironment]
        Cue -->|Pivot Isolation Group| MoveTo[moveTo - Position Fix]
        Physics -->|1. Overlap Correction| Matrix[Dynamic Mass Matrix]
        Physics -->|2. Elastic Impulse Resolution| Momentum[Linear Velocity Exchange]
        Ball -->|Quaternion Rotation| Texture[Canvas Texture Auto-Update]
        Ball -->|Velocity & Spin Adjust| Friction[Effective Friction Decay]
    end

    %% Event Loops
    Main -->|Animation Request Frame| SubSteps[Sub-stepping Integration Loop: dt = 1/180s]
    SubSteps -->|Iterates 3x per Frame| Physics
    SubSteps -->|Updates Coordinates| Ball

    %% Style Declarations
    style Index fill:#1a1c23,stroke:#5c6370,stroke-width:2px,color:#fff
    style Main fill:#2e3440,stroke:#81a1c1,stroke-width:2px,color:#fff
    style Physics fill:#4c566a,stroke:#bf616a,stroke-width:2px,color:#fff
    style Ball fill:#4c566a,stroke:#a3be8c,stroke-width:2px,color:#fff
    style Cue fill:#4c566a,stroke:#ebcb8b,stroke-width:2px,color:#fff
    style Table fill:#4c566a,stroke:#b48ead,stroke-width:2px,color:#fff
