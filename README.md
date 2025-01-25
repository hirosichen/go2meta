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

# go2meta

Build VR experiences with React, A-Frame, and TypeScript. Import your 3D models and create interactive VR environments with minimal code.

## Features

- VR environment with custom scene loading
- WebVR-based teleportation system
- Built with A-Frame and React
- TypeScript support
- Development tools with hot reload

## Installation

```bash
git clone https://github.com/hirosichen/go2meta.git
cd go2meta
npm install
```

## Development

Start development server with SSL (required for VR):
```bash
npm run dev:ssl
```

Access at `https://localhost:3001`

## Customize Your VR Scene

1. Export your 3D scene as .glb
2. Place in `public` as `scene.glb`
3. Configure in `a-gltf-model`:

```html
<a-gltf-model
  src="/scene.glb"
  position="0 0 0"
  scale="1 1 1"
  class="teleportable"
  nav-mesh>
</a-gltf-model>
```

### Teleportation Areas
Add `teleportable` class to enable teleporting:

```html
<a-box
  class="teleportable"
  static-body
  nav-mesh>
</a-box>
```

## Controls

Left Controller:
- Trigger: Teleport
- X Button: Debug view

## Why go2meta?

- No subscription fees
- Full customization freedom
- Simple 500-line codebase
- Build on open standards
- Own your content

## Requirements

- Node.js 18+
- npm 9+
- VR headset (Meta Quest recommended)

## License

MIT

## Contributing

Issues and PRs welcome at [github.com/hirosichen/go2meta](https://github.com/hirosichen/go2meta)

## License

MIT
