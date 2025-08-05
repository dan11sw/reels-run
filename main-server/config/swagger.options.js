// Объект с настройками
const options = (dirname) => {
    return {
        // Определения для Swagger'a
        swaggerDefinition: {
            // Основная информация, которая будет размещена на странице документации
            info: {
                description: 'Данный сервис определяет основные пользовательские функции',
                title: 'Основной игровой сервис',
                version: '1.0.0',
                contact: {
                    email: "swdaniel@yandex.ru"
                }
            },
            // Хост, по которому будет доступна документация (должен быть равен адресу, на котором запускается приложение)
            host: 'localhost:5000',
            // Базовый путь
            basePath: '/',
            // Возможные форматы приёма данных для обработки запросов
            produces: [
                "application/json",
                "application/xml"
            ],
            // Доступные схемы взаимодействия с API
            schemes: ['http', 'https'],
            // Определения для безопасности
            securityDefinitions: {
                // Поддержка JWT
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: "",
                }
            },
            // Ссылка на внешнюю документацию
            externalDocs: {
                description: 'Ссылка на внешнюю документацию',
                url: 'http://localhost:5000/api-docs'
            },
        },
        // Маршруты, по которым доступна документация
        route: {
            url: '/docs/swagger2',
            docs: '/swagger.json',
        },
        // Базовая директория
        basedir: dirname,
        // Файлы, которые будут просматриваться при генерации документации
        files: ['./routers/*.js', './dtos/**/*.js', './models/**/*.js', './exceptions/*.js']
    };
}

// Экспорт опций из файла
export default options;