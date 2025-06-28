# ArchiveNet Frontend

A stunning Next.js frontend for the ArchiveNet MCP server with dark theme, glassmorphism effects, and modern animations.

## Features

- 🌙 **Dark Theme**: Beautiful dark mode design with glassmorphism effects
- ✨ **Animations**: Smooth animations powered by Framer Motion
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 📱 **Responsive**: Fully responsive design for all devices
- 🚀 **Performance**: Optimized for speed and user experience

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
client/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with glassmorphism effects
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── animated-text.tsx # Text animation component
│   ├── feature-card.tsx  # Feature showcase cards
│   ├── glass-card.tsx    # Glassmorphism card component
│   └── particles.tsx     # Floating particles effect
├── lib/                  # Utilities
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Design Features

### Glassmorphism Effects
- **Glass Cards**: Translucent cards with backdrop blur
- **Floating Elements**: Animated background particles
- **Gradient Text**: Beautiful gradient text effects
- **Glow Effects**: Subtle glow animations

### Animations
- **Page Transitions**: Smooth enter animations
- **Hover Effects**: Interactive hover states
- **Scroll Animations**: Elements animate on scroll
- **Floating Particles**: Background particle system

### Components
- **Feature Cards**: Showcase key features with icons
- **Animated Text**: Staggered text animations
- **Glass Cards**: Reusable glassmorphism containers
- **Interactive Buttons**: Multiple button variants with effects

## Customization

### Colors
The color scheme is defined in `tailwind.config.ts` and uses CSS custom properties for easy theming.

### Animations
Animation variants are defined in individual components using Framer Motion.

### Glassmorphism
Glass effects are implemented as Tailwind utilities in `globals.css`:
- `.glass` - Standard glass effect
- `.glass-strong` - More pronounced glass effect
- `.glass-subtle` - Subtle glass effect

## Building for Production

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see the LICENSE file for details.