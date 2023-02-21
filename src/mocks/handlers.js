import { rest } from 'msw';

export const handlers = [
  rest.get('/https://pokeapi.co/api/v2/pokemon/', (req, res, ctx) => {
    return res(
      ctx.json({
        welcomeMessage: 'Hello World!',
      })
    );
  }),
];
