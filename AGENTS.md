# Agent Guidelines for 2048 Project

This document contains important information for AI agents and developers working on this project.

## Cache Busting

**IMPORTANT:** Whenever you make changes to CSS or JavaScript files, you MUST update the cache buster version in `index.html`.

### Current Cache Buster Locations

- **CSS**: Line 7 in `index.html`
  ```html
  <link href="style/main.css?v=1.0.0" rel="stylesheet" type="text/css">
  ```

### Cache Busting Convention

1. **For each new branch**: Increment the version parameter when making CSS changes
2. **Version format**: Use semantic versioning (e.g., `v=1.0.0`, `v=1.0.1`, `v=1.1.0`)
3. **When to increment**:
   - Patch version (1.0.X): Minor CSS fixes or tweaks
   - Minor version (1.X.0): New features or significant style changes
   - Major version (X.0.0): Complete redesign or breaking changes

### Example Workflow

```bash
# Make CSS changes in style/main.css or style/main.scss
# Then update the version in index.html:
# v=1.0.0 → v=1.0.1

git add index.html style/
git commit -m "Update styles and increment cache buster version"
```

## Project Structure

```
2048/
├── index.html           # Main HTML file with cache buster parameters
├── style/
│   ├── main.css         # Compiled CSS (update cache buster when changed)
│   └── main.scss        # SCSS source file
├── js/
│   ├── application.js   # Main application entry point
│   ├── game_manager.js  # Core game logic
│   ├── settings_manager.js  # Settings persistence
│   ├── sound_manager.js     # Audio effects
│   ├── particle_manager.js  # Visual effects
│   └── [other modules]
└── meta/                # Mobile app icons and assets
```

## Branch Naming Convention

All agent branches should follow the pattern:
```
claude/<descriptive-name>-<session-id>
```

Example: `claude/add-cas-cache-buster-LObAx`

## Git Workflow

1. **Develop** on the designated branch (never on main/master)
2. **Commit** with clear, descriptive messages
3. **Push** using: `git push -u origin <branch-name>`
4. **Never** push to a different branch without explicit permission

### Push Retry Policy

If push fails due to network errors:
- Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s)
- For 403 errors: Verify branch name starts with `claude/` and ends with correct session ID

## Important Files

- **index.html**: Main entry point, contains all script and style references
- **style/main.scss**: SCSS source (compile to main.css)
- **style/main.css**: Compiled CSS (referenced in index.html)
- **Rakefile**: Contains appcache update tasks

## Features

This 2048 implementation includes:
- **Settings Panel**: Dark mode, sound effects, particle effects
- **Sound System**: Audio feedback for moves, merges, win/lose
- **Particle Effects**: Visual effects for tile merges
- **Local Storage**: Persists game state and settings
- **Mobile Support**: Touch controls and responsive design
- **Stats Tracking**: Move counter and best score

## Testing Checklist

Before pushing changes:
1. Test on desktop browsers (Chrome, Firefox, Safari)
2. Test on mobile devices or mobile viewport
3. Verify settings persist after page reload
4. Check that CSS changes are visible (cache buster working)
5. Ensure no console errors
6. Verify game mechanics still work correctly

## Common Tasks

### Updating Styles
1. Edit `style/main.scss`
2. Compile to `style/main.css` (if using SCSS compiler)
3. Increment version in `index.html` line 7
4. Test in browser (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)

### Adding New JavaScript Features
1. Create or modify JS files in `js/` directory
2. Add script tag in `index.html` if new file
3. Follow existing patterns (constructor functions, prototypes)
4. Test thoroughly before committing

### Mobile Testing
- Use browser DevTools mobile viewport simulation
- Test touch events and gestures
- Verify viewport meta tags are working
- Check that layout doesn't overflow on small screens

## Notes for AI Agents

- This is a vanilla JavaScript project (no build tools, no frameworks)
- Code style uses ES5 syntax with constructor functions
- Always read files before editing them
- Prefer editing existing files over creating new ones
- Don't add unnecessary features or over-engineer solutions
- Keep changes focused and minimal
