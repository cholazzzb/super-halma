renderer <- store

renderer -> onClick Command -> EventBus -> service -> store

HUD React Chakra -> onClick -> EventBus -> service -> store

HUD React Chakra <- store

# Key Separation Principles:
## EventBus
- Handles asynchronous communication between components
- Decouples event producers from consumers
- Used for broadcasting state changes and game events
- Should NOT contain business logic
## Services
- Contains core business logic
- Manages state changes
- Validates operations
- Emits events through EventBus
- Should be stateless (state is managed by state management)
## Commands
- Represents user actions/intentions
- Provides undo/redo capability
- Encapsulates operation parameters
- Can be queued and executed in sequence
- Should be atomic and reversible