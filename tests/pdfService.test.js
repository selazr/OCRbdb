import { jest } from '@jest/globals';

const parsed = { text: 'txt' };

jest.unstable_mockModule('pdf-parse', () => ({
  default: jest.fn().mockResolvedValue(parsed)
}));

let extractTextFromPDF;
let extractPagesFromPDF;

beforeAll(async () => {
  ({ extractTextFromPDF, extractPagesFromPDF } = await import('../src/services/pdfService.js'));
});

test('extractTextFromPDF returns parsed text', async () => {
  const text = await extractTextFromPDF(Buffer.from('data'));
  expect(text).toBe('txt');
});

test('extractPagesFromPDF splits pages', async () => {
  parsed.text = 'a\fb';
  const pages = await extractPagesFromPDF(Buffer.from('data'));
  expect(pages).toEqual(['a', 'b']);
});
