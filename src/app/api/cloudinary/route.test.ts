import { POST } from './route';
import { v2 as cloudinary } from 'cloudinary';

// Mock de Next.js server
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));

// Mock de Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
    },
  },
}));

// Mock de variables de entorno
const mockEnv = {
  CLOUDINARY_CLOUD_NAME: 'test-cloud',
  CLOUDINARY_API_KEY: 'test-key',
  CLOUDINARY_API_SECRET: 'test-secret',
};

Object.assign(process.env, mockEnv);

describe('/api/upload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('debe subir una imagen exitosamente', async () => {
      // Arrange
      const mockImageBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//2Q==';
      const mockUploadResponse = {
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v123456789/eventos/sample.jpg',
        public_id: 'eventos/sample',
      };

      (cloudinary.uploader.upload as jest.Mock).mockResolvedValue(mockUploadResponse);

      const mockRequest = {
        json: jest.fn().mockResolvedValue({ image: mockImageBase64 }),
      } as any;

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        url: mockUploadResponse.secure_url,
      });
      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(mockImageBase64, {
        folder: 'eventos',
      });
    });

    it('debe retornar error 400 cuando no se proporciona imagen', async () => {
      // Arrange
      const mockRequest = {
        json: jest.fn().mockResolvedValue({}),
      } as any;

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: 'No image provided',
      });
      expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
    });

    it('debe retornar error 400 cuando la imagen está vacía', async () => {
      // Arrange
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ image: '' }),
      } as any;

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: 'No image provided',
      });
      expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
    });

    it('debe retornar error 400 cuando la imagen es null', async () => {
      // Arrange
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ image: null }),
      } as any;

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: 'No image provided',
      });
      expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
    });

    it('debe manejar errores de Cloudinary y retornar error 500', async () => {
      // Arrange
      const mockImageBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//2Q==';
      const mockError = new Error('Cloudinary upload failed');

      (cloudinary.uploader.upload as jest.Mock).mockRejectedValue(mockError);

      const mockRequest = {
        json: jest.fn().mockResolvedValue({ image: mockImageBase64 }),
      } as any;

      // Spy en console.log
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        error: 'Upload failed',
        details: mockError,
      });
      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(mockImageBase64, {
        folder: 'eventos',
      });
      expect(consoleSpy).toHaveBeenCalledWith(mockError);

      // Cleanup
      consoleSpy.mockRestore();
    });

    it('debe manejar JSON inválido y retornar error 500', async () => {
      // Arrange
      const mockRequest = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as any;

      // Spy en console.log
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData.error).toBe('Upload failed');
      expect(responseData.details).toBeInstanceOf(Error);
      expect(consoleSpy).toHaveBeenCalled();

      // Cleanup
      consoleSpy.mockRestore();
    });

    it('debe usar la carpeta "eventos" para el upload', async () => {
      // Arrange
      const mockImageBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//2Q==';
      const mockUploadResponse = {
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v123456789/eventos/sample.jpg',
      };

      (cloudinary.uploader.upload as jest.Mock).mockResolvedValue(mockUploadResponse);

      const mockRequest = {
        json: jest.fn().mockResolvedValue({ image: mockImageBase64 }),
      } as any;

      // Act
      await POST(mockRequest);

      // Assert
      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
        mockImageBase64,
        expect.objectContaining({
          folder: 'eventos',
        })
      );
    });

    it('debe retornar solo la URL segura en la respuesta exitosa', async () => {
      // Arrange
      const mockImageBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//2Q==';
      const mockUploadResponse = {
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v123456789/eventos/sample.jpg',
        public_id: 'eventos/sample',
        version: 123456789,
        format: 'jpg',
        // Otros campos que Cloudinary podría devolver
        width: 800,
        height: 600,
      };

      (cloudinary.uploader.upload as jest.Mock).mockResolvedValue(mockUploadResponse);

      const mockRequest = {
        json: jest.fn().mockResolvedValue({ image: mockImageBase64 }),
      } as any;

      // Act
      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Assert
      expect(responseData).toEqual({
        url: mockUploadResponse.secure_url,
      });
      // Verificar que no se incluyan otros campos
      expect(responseData.public_id).toBeUndefined();
      expect(responseData.version).toBeUndefined();
      expect(responseData.format).toBeUndefined();
    });
  });
});