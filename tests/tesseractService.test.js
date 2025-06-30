import { jest } from '@jest/globals';

const worker = {
  loadLanguage: jest.fn(),
  initialize: jest.fn(),
  recognize: jest.fn().mockResolvedValue({ data: { text: 'txt' } }),
  terminate: jest.fn(),
};

jest.unstable_mockModule('tesseract.js', () => ({
  createWorker: jest.fn(() => worker),
}));

let processImageWithTesseract;

beforeAll(async () => {
  ({ processImageWithTesseract } = await import('../src/services/tesseractService.js'));
});

beforeEach(() => {
  jest.clearAllMocks();
});

test('processImageWithTesseract returns recognized text', async () => {
  const text = await processImageWithTesseract('img');
  expect(text).toBe('txt');
  expect(worker.loadLanguage).toHaveBeenCalledWith('eng');
  expect(worker.initialize).toHaveBeenCalledWith('eng');
  expect(worker.recognize).toHaveBeenCalledWith('img');
  expect(worker.terminate).toHaveBeenCalled();
});


test('processImageWithTesseract supports custom language', async () => {
  await processImageWithTesseract('img', 'spa');
  expect(worker.loadLanguage).toHaveBeenCalledWith('spa');
  expect(worker.initialize).toHaveBeenCalledWith('spa');
});
