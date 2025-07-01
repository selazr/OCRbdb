import { jest } from '@jest/globals';

const parsed = { text: 'txt' };

jest.unstable_mockModule('pdf-parse', () => ({
  default: jest.fn().mockResolvedValue(parsed)
}));

let extractTextFromPDF;

beforeAll(async () => {
  ({ extractTextFromPDF } = await import('../src/services/pdfService.js'));
});

test('extractTextFromPDF returns parsed text', async () => {
  const text = await extractTextFromPDF(Buffer.from('data'));
  expect(text).toBe('txt');
});
