# Technical Assessment — The Customizable Coffee Shop

## Step 1
## Initial Master Data
You are building the ordering engine for a highly customizable coffee shop. A customer composes a beverage from:
* **Base Drinks:** Coffee, Tea, Milk
* **Syrups:** Vanilla, Caramel, Chocolate
* **Toppings:** Whipped Cream, Cinnamon, Marshmallows
* **Sizes:** Small, Medium, Large

The system must let a customer pick a base, add any combination of syrups and toppings (including duplicates - e.g. a double vanilla), choose a size, and place an order that reports an itemized description and a final price.

## Step 2
## Functional requirements:
## Sprint 1
The system must let a customer pick a base, add any combination of syrups and toppings (including duplicates - e.g. a double vanilla), choose a size, and place an order that reports an itemized description

* Task 1 - Build a drink from a base + any number of syrups/toppings + exactly one size.
* Task 2 - Produce a human-readable description of the finished drink (e.g. "Large Coffee, Vanilla, Vanilla, Whipped Cream").
* Task 3 - Place an order containing one or more drinks and return an itemized receipt with a grand total.
<!-- ## Sprint 2
that reports an itemized description and a final price.
* Task 1 - Compute the final price according to the pricing rules. -->

## Step 3
## Assignment Objectives
Propose a software design for the customizable coffee shop system. Your submission should include:
1. A high-level class diagram or description of the architecture.
2. The choice of programming language and explanation for why it was chosen.
3. Implementation of a design approach that allows for flexible adding of ingredients (e.g., syrups, toppings) and dynamic pricing calculations without creating an excessive number of subclasses.
4. Code snippets demonstrating how to create a base drink and customize it with multiple ingredients.
5. Explanation of the benefits of your chosen design approach in terms of maintainability and extensibility.