const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');

    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, `${basename}-${uniqueSuffix}${extension}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, and documents are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Upload single file
router.post('/single', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('Single file upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file'
    });
  }
});

// Upload multiple files
router.post('/multiple', authenticateToken, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`
    }));

    res.json({
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Multiple files upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files'
    });
  }
});

// Upload product images (authenticated artisan only)
router.post('/product-images', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    // Check if user is an artisan
    if (!req.user.roles.includes('artisan')) {
      return res.status(403).json({
        success: false,
        message: 'Only artisans can upload product images'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    // Validate image files
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const uploadedImages = [];

    for (const file of req.files) {
      const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedImageTypes.test(file.mimetype);

      if (!mimetype || !extname) {
        // Delete invalid file
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error deleting invalid file:', unlinkError);
        }
        continue; // Skip invalid files
      }

      uploadedImages.push({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`
      });
    }

    if (uploadedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid images uploaded. Only JPEG, PNG, GIF, and WebP are allowed.'
      });
    }

    res.json({
      success: true,
      message: `${uploadedImages.length} product images uploaded successfully`,
      data: uploadedImages
    });
  } catch (error) {
    console.error('Product images upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload product images'
    });
  }
});

// Upload artisan portfolio files (authenticated artisan only)
router.post('/portfolio', authenticateToken, upload.array('files', 10), async (req, res) => {
  try {
    // Check if user is an artisan
    if (!req.user.roles.includes('artisan')) {
      return res.status(403).json({
        success: false,
        message: 'Only artisans can upload portfolio files'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`
    }));

    res.json({
      success: true,
      message: `${uploadedFiles.length} portfolio files uploaded successfully`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Portfolio upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload portfolio files'
    });
  }
});

// Delete uploaded file
router.delete('/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads', filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file
    await fs.unlink(filePath);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
});

// Get upload statistics (authenticated user)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const uploadDir = path.join(__dirname, '../../uploads');

    let totalFiles = 0;
    let totalSize = 0;

    try {
      const files = await fs.readdir(uploadDir);

      for (const file of files) {
        const filePath = path.join(uploadDir, file);
        const stats = await fs.stat(filePath);
        totalFiles++;
        totalSize += stats.size;
      }
    } catch (error) {
      // Directory doesn't exist or is empty
      totalFiles = 0;
      totalSize = 0;
    }

    res.json({
      success: true,
      data: {
        totalFiles,
        totalSize,
        totalSizeMB: Math.round((totalSize / (1024 * 1024)) * 100) / 100
      }
    });
  } catch (error) {
    console.error('Get upload stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get upload statistics'
    });
  }
});

module.exports = router;
