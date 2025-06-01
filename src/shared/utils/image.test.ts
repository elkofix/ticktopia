import { uploadImageToCloudinary } from './image';

// Mock global de fetch
global.fetch = jest.fn() as jest.Mock;

describe('uploadImageToCloudinary', () => {
  const mockBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==';

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('should upload image successfully and return URL', async () => {
    // Configurar el mock de fetch para simular una respuesta exitosa
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: 'https://cloudinary.com/image.jpg' }),
    });

    const result = await uploadImageToCloudinary(mockBase64Image);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/cloudinary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: mockBase64Image }),
    });

    expect(result).toBe('https://cloudinary.com/image.jpg');
  });

  it('should throw an error when the response is not ok', async () => {
    // Configurar el mock de fetch para simular una respuesta fallida
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(uploadImageToCloudinary(mockBase64Image))
      .rejects
      .toThrow('Failed to upload image');

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when fetch fails', async () => {
    // Configurar el mock de fetch para simular un error de red
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(uploadImageToCloudinary(mockBase64Image))
      .rejects
      .toThrow('Network error');

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when response JSON is invalid', async () => {
    // Configurar el mock de fetch para simular una respuesta con JSON inválido
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => { throw new Error('Invalid JSON'); },
    });

    await expect(uploadImageToCloudinary(mockBase64Image))
      .rejects
      .toThrow('Invalid JSON');
  });
});