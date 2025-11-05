# TODO: Add Fade In Animations and Game Photo to Mini Arcade Game

## Tasks
- [ ] Add fade in animation CSS keyframes and styles for sections
- [ ] Update script.js to trigger fade in on scroll for sections
- [ ] Add game photo (screenshot placeholder) to Mini Arcade Game project card in HTML
- [ ] Test animations and image display

## Information Gathered
- Portfolio has multiple sections (Hero, About, Experience, Skills, Projects, Contact)
- CSS already has some animations (fadeInUp, fadeInLeft) but not general fade in for sections
- script.js has IntersectionObserver for adding 'animate' class to sections
- Projects section has project cards; Mini Arcade Game card currently has overlay with link icon, no image
- Need to add a game photo to show the mini arcade game website is ready

## Plan
- Add CSS keyframe for fadeIn animation
- Add .section.animate { animation: fadeIn 1s ease-out; } to trigger on scroll
- In index.html, for Mini Arcade Game project card, add <img> tag with placeholder game screenshot src
- Ensure image fits within project-image container and is responsive

## Dependent Files
- styles.css: Add fadeIn keyframe and animation class
- script.js: Already has observer, may need minor adjustment if needed
- index.html: Add img tag to Mini Arcade Game project card

## Followup Steps
- Open page in browser to verify fade in animations work on scroll
- Check that game photo displays correctly in project card
- Adjust animation timing or image if needed
