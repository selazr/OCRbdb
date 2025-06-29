import { jest } from '@jest/globals';

jest.unstable_mockModule('axios', () => ({
  default: { post: jest.fn() }
}));

let processImageWithGPT4o;
let axios;

beforeAll(async () => {
  ({ default: axios } = await import('axios'));
  ({ processImageWithGPT4o } = await import('../src/services/openaiService.js'));
});

describe('processImageWithGPT4o', () => {
  beforeEach(() => {
    axios.post.mockReset();
  });

  test('parses JSON response', async () => {
    axios.post.mockResolvedValue({ data: { choices: [{ message: { content: '{"a":1}' } }] } });
    const result = await processImageWithGPT4o('img');
    expect(result).toEqual({ a: 1 });
  });

  test('returns raw string when JSON parse fails', async () => {
    axios.post.mockResolvedValue({ data: { choices: [{ message: { content: 'not json' } }] } });
    const result = await processImageWithGPT4o('img');
    expect(result).toBe('not json');
  });
});
