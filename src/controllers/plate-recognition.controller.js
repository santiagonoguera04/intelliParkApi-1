const {
  recognizeLicensePlate
} = require('../services/gemini.service');

const recognizePlate = async (req, res) => {
  try {
    const result = await recognizeLicensePlate({
      imageBase64: req.body.image_base64,
      mimeType: req.body.mime_type
    });

    return res.status(200).json({
      message: 'Placa reconocida correctamente.',
      data: result
    });
  } catch (error) {
    const statusCode = error.statusCode || 502;

    return res.status(statusCode).json({
      message: error.message || 'No fue posible analizar la imagen.'
    });
  }
};

module.exports = {
  recognizePlate
<<<<<<< HEAD
};
=======
};
>>>>>>> 442c87bec5a52c7c631215999c829dd8c5d64e7f
