const AWS = require('aws-sdk');

// Настраиваем соединение с Yandex Object Storage
const s3 = new AWS.S3({
    endpoint: 'https://storage.yandexcloud.net',
    // Эти ключи берутся из "Переменных окружения" функции, 
    // которые вы настроите в консоли Яндекса
    accessKeyId: process.env.ACCESS_KEY_ID,       
    secretAccessKey: process.env.SECRET_ACCESS_KEY, 
    region: 'ru-central1',
    httpOptions: {
        timeout: 10000,
        connectTimeout: 10000
    }
});

module.exports.handler = async function (event, context) {
    // 1. Настройка CORS (чтобы ваш сайт мог отправлять данные)
    const headers = {
        'Access-Control-Allow-Origin': '*', // Разрешаем доступ с любого сайта
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Если браузер делает предварительную проверку (OPTIONS), отвечаем "ОК"
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: headers,
            body: ''
        };
    }

    try {
        // 2. Распаковка полученных данных
        let requestBody;
        // Яндекс может прислать данные в base64, если они большие
        if (event.isBase64Encoded) {
            requestBody = JSON.parse(Buffer.from(event.body, 'base64').toString('utf8'));
        } else {
            requestBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        }

        const id = requestBody.fileName || 'unknown';
        // Очистка ID от спецсимволов для безопасности имени файла
        const cleanId = id.replace(/[^a-zA-Z0-9_-]/g, ''); 
        
        // Данные самого опроса
        const content = requestBody.fileData;
        
        // Имя бакета берем из настроек функции
        const bucketName = process.env.BUCKET_NAME; 

        if (!content || !bucketName) {
             throw new Error('No content or bucket name provided');
        }

        // 3. Сохранение файла в Бакет (Object Storage)
        const params = {
            Bucket: bucketName,
            Key: `data/${cleanId}_${Date.now()}.csv`, // Имя файла: data/USER_время.csv
            Body: content,
            ContentType: 'text/csv'
        };

        // Ждем пока Яндекс подтвердит сохранение
        await s3.putObject(params).promise();

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ status: 'success' })
        };

    } catch (error) {
        console.error("Error saving file:", error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ status: 'error', message: error.message })
        };
    }
};
