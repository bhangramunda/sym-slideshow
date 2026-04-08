# Extending the App

## Adding a New Slide Type

1. **Create the component** in `src/components/`:

   ```jsx
   // src/components/MyNewSlide.jsx
   export default function MyNewSlide({ scene, isActive }) {
     return (
       <div className="w-full h-full flex items-center justify-center">
         <h1>{scene.title}</h1>
       </div>
     );
   }
   ```

2. **Register in Scene.jsx** — add a case to the slide type dispatcher:

   ```jsx
   case 'my-new-type':
     return <MyNewSlide scene={scene} isActive={isActive} />;
   ```

3. **Add editor fields in Editor.jsx** — add the type to the slide type dropdown and add form fields for any type-specific properties.

4. **Update the help modal** in `HelpModal.jsx` if the slide type has unique behavior.

## Adding a New Setting

1. Add the setting to the default settings object in `App.jsx` and `Editor.jsx`
2. Add a UI control (toggle, dropdown, slider) in the Editor settings panel
3. Pass the setting through to `Scene.jsx` or the relevant slide component
4. The setting auto-persists via `useSupabaseSync` (no extra save logic needed)

## Adding a New Animation Style

1. Add the style definition to `BUILD_STYLES` in `BuildAnimation.jsx`:

   ```jsx
   myStyle: {
     initial: { opacity: 0, y: 20 },
     animate: { opacity: 1, y: 0 },
     transition: { duration: 0.5 }
   }
   ```

2. Add the style name to the build style dropdown in `Editor.jsx`
3. Test with all build scopes (components, elements, sections)

## Adding a New Gradient Theme

1. Add the theme to `src/utils/gradientThemes.js`:

   ```javascript
   export const themes = {
     // ...existing themes
     myTheme: {
       name: 'My Theme',
       colors: ['#color1', '#color2', '#color3'],
       angle: 135
     }
   };
   ```

2. The theme picker in the editor will automatically include it.

## Key Files to Modify

| Task | Files |
|------|-------|
| New slide type | `Scene.jsx`, `Editor.jsx`, new component file |
| New setting | `App.jsx`, `Editor.jsx`, consuming component |
| New animation | `BuildAnimation.jsx`, `Editor.jsx` |
| New theme | `gradientThemes.js` |
| Database changes | `supabase-migrations/`, `database.md` |
| Styling changes | `tailwind.config.js`, `index.css` |
