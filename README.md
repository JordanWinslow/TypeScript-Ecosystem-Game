# Ecosystem Simulator Programmed Entirely in Vanilla TypeScript HTML and CSS
Created by Jordan Winslow and inspired by Conway's Game of Life.

Live Demo: https://typescript-ecosystem-simulator.netlify.app/

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjIxNzYzODNkOWRiMGUzYjcwZjBiODI5YzI5YjM4YTk3ZTUyYTI4YyZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/TI82DhPznZtWh3jnB5/giphy.gif)

## Game Mechanics
#### Animal Desires: 
- **Thirst:**
    Water is the highest priority for all animals. Animals have a thirst range of 0-10. Once their thirst goes above 5, they lose health each round they do not find water.

- **Hunger:**
    Hunger is the second-most priority for animals. Animals have a hunger range of 0-10. Once their hunger goes above 5, they lose health each round they do not find food.

- **Reproduction:**
    Once an animal's hunger and thirst is taken care of, their reproductive urges take over and they begin looking for another animal who is also looking to mate. If two animals of the same species who have the desire to reproduce are within 1 space of eachother they will create a new animal.

#### Pathfinding:
Animals look for their closest current desire (food, water, mate) and try to navigate along an optimal path to that desire, moving around obstacles that get in their way (trees, water, other animals)

#### Health:
Animals have a health range of 0-10 that will begin to decrease each round if their hunger or thirst values get too high. Once their health reaches 0, they die.

#### Death:
When an animal dies, it leaves behind a tombstone with their name and the last desire they had before passing away.

#### Obstacles:
Water, Animals and Trees are obstacles that Animals can not move through. Grass and dead animals are not obstacles and can freely be moved over.

### Why did I make this?
This project was designed to teach the fundamentals of JavaScript and TypeScript as well as a solid foundation for Front End Development on the web. It covers numerous real-life use cases for manipulating complex data, forms, and internal browser APIs. This is also a great project for Back End developers as it covers the fundamentals of JavaScript Classes and OOP.

### By coding along with Jordan you will learn:

- Programming theory and "best practices" such as knowing when and (more importantly) when NOT to create abstractions, when and how to refactor, and how to make code easily-readable for your coworkers and future self
- JavaScript fundamentals such as closures, callback functions, conditional branching, loops, Object/Array methods, event listeners and much, much more!
- Advanced JavaScript such as performance optimization in nested loops, live debugging, and the tricky parts that most developers get stuck on during their first few years on the job
- Functional programming paradigms to keep code readable and maintainable
- Practical approach to Object Oriented programming (when and when NOT to use it)
- HTML Fundamentals such as the DOM (Document Object Model), forms and important browser APIs
- CSS Fundamentals such as specificity, flexbox and contained scroll behavior
- Advanced CSS such as pseudo classes and attribute selectors
- Hands-on explanation of why we don't create design libraries and rendering engines from scratch and instead choose to stand on the shoulders of giants such as bootstrap, materialUI, and tailwind for styling, and React/Vue/Angular/etc. for our rendering framework!
