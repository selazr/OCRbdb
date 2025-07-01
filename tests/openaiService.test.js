import { jest } from '@jest/globals';

jest.unstable_mockModule('axios', () => ({
  default: { post: jest.fn() }
}));

const extractMock = jest.fn();
jest.unstable_mockModule('../src/services/pdfService.js', () => ({
  extractTextFromPDF: extractMock
}));

let processImageWithGPT4o;
let analyzeTableTextWithGPT4o;
let processPDFWithGPT4o;
let axios;

beforeAll(async () => {
  ({ default: axios } = await import('axios'));
  ({ processImageWithGPT4o, analyzeTableTextWithGPT4o, processPDFWithGPT4o } = await import('../src/services/openaiService.js'));
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

describe('analyzeTableTextWithGPT4o', () => {
  beforeEach(() => {
    axios.post.mockReset();
  });

  test('parses JSON response', async () => {
    axios.post.mockResolvedValue({ data: { choices: [{ message: { content: '{"a":1}' } }] } });
    const result = await analyzeTableTextWithGPT4o('txt');
    expect(result).toEqual({ a: 1 });
  });

  test('returns raw string when JSON parse fails', async () => {
    axios.post.mockResolvedValue({ data: { choices: [{ message: { content: 'not json' } }] } });
    const result = await analyzeTableTextWithGPT4o('txt');
    expect(result).toBe('not json');
  });
});

describe('processPDFWithGPT4o', () => {
  beforeEach(() => {
    axios.post.mockReset();
    extractMock.mockReset();
  });

  test('extracts text and parses JSON response', async () => {
    extractMock.mockResolvedValue('pdf text');
    axios.post.mockResolvedValue({ data: { choices: [{ message: { content: '{"a":1}' } }] } });
    const buffer = Buffer.from('data');
    const result = await processPDFWithGPT4o(buffer);
    expect(extractMock).toHaveBeenCalledWith(buffer);
    expect(result).toEqual({ a: 1 });
  });
});
