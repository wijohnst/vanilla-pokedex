# Design Document

<img width="536" alt="Screen Shot 2023-01-28 at 10 03 19 AM" src="https://user-images.githubusercontent.com/12022922/215273683-02afb791-9791-4624-bfe5-157a50e41238.png">
_Pictured, a Pokédex_

## Objective

The objective of this project is to create a Pokédex application that allows users to easily search for and view information about different Pokemon

## Design

- The application will have a CSS-based layout that resembles a Pokédex and should include  a search bar for searching Pokemon.
- The main content area will display the results of a search, including the name, image, and basic stats of each Pokemon.
- The Pokédex should include a "Detail" button that when clicked will display additional information about the currently displayed Pokemon
- This information should include:
  - Height
  - Weight
  - Type
  - Moves

## Functionality

- The application will use the PokeAPI to fetch data about Pokemon.
- Users will be able to search for Pokemon by name or ID number.
- If a user searches for a resource that does not exist an message should be displayed indicating that a Pokemon with that name or ID number cannot be found
- If a Pokemon is located with the given name or ID number its sprite image and name should be displayed in the main view area

## Technical Requirements

- The application will be built with HTML, CSS, and vanilla JavaScript.
- Parcel will be used as the build tool to bundle the application for production.
- The PokeAPI will be used to fetch data about Pokemon.
- The application will be designed to be mobile-responsive.

## Testing

- The application will be tested on multiple devices and browsers to ensure compatibility and consistent performance.
- The application will be tested against the PokeAPI to ensure all data is being fetched and displayed correctly.

## Deployment

- The application will be deployed to Netlify

## PokeAPI

[This resource](https://pokeapi.co/) will be used to fetch data about individual Pokemon via the REST API and endpoints.

### Sample Endpoint

URI: [https://pokeapi.co/api/v2/pokemon/ditto](https://pokeapi.co/api/v2/pokemon/ditto)
