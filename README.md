# VR Experience Builder

Build your own customizable VR experiences with physics, teleportation, and object interactions in just 500 lines of code.

## Features

- Full VR environment with physics system
- Grab and manipulate objects in VR
- Teleportation system with visual indicators
- Customizable scenes via .glb model loading
- Debug system for development
- Built with A-Frame, React, and TypeScript

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- A VR headset (Meta Quest recommended)

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd [your-repo-name]

# Install dependencies
npm install

# Start development server with SSL (required for VR)
npm run dev:ssl
```

Access the experience at `https://localhost:3001`

### Running in Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Customizing Your VR Experience

### Replacing the Scene

1. Export your 3D scene as a .glb file
2. Place it in the `public` directory as `scene.glb`
3. Adjust the scale/position in the `a-gltf-model` component:

```html
<a-gltf-model
  src="/scene.glb"
  position="0 0 0"
  scale="1 1 1"
  rotation="0 0 0"
  static-body="shape: mesh"
  class="teleportable"
  nav-mesh>
</a-gltf-model>
```

### Teleportation Areas

Add the `teleportable` class to any surface where you want to enable teleportation:

```html
<a-box
  class="teleportable"
  static-body="shape: box"
  nav-mesh>
</a-box>
```

### Interactive Objects

Make objects grabbable by adding the `grabbable` class:

```html
<a-box 
  class="grabbable"
  dynamic-body="shape: box; mass: 1">
</a-box>
```

## Controls

- Left Controller:
  - Trigger: Teleport
  - X Button: Toggle debug view
- Right Controller:
  - Trigger: Grab objects
  - Joystick: Adjust grabbed object distance

## Why Build Your Own?

- **Full Ownership**: No monthly subscription fees or platform dependencies
- **Customization**: Complete control over your VR environment
- **Simple Architecture**: Only 500 lines of core code
- **Open Source**: Extend and modify as needed
- **No Lock-in**: Your content stays yours

## Development

### Debug Mode

Press the X button on the left controller to toggle debug view, showing:
- Object positions
- Interaction status
- Raycast information

### Project Structure

```
src/
  ├── App.tsx        # Main VR scene and components
  ├── components/    # Custom A-Frame components
  └── assets/        # Static assets
```

### Adding Custom Components

Register new A-Frame components in `App.tsx`:

```typescript
AFRAME.registerComponent('my-component', {
  init: function() {
    // Component logic
  }
});
```

## License

MIT
