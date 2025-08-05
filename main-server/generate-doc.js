import express from "express";
import ExpressSwaggerGenerator from 'express-swagger-generator';
import swiggerOptions from './config/swagger.options.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
import jsonToYaml from 'json2yaml';
import fs from 'fs';
import swaggerConverter from 'swagger2openapi';

const expressSwaggerGenerator = ExpressSwaggerGenerator(express());
const swaggerDoc = expressSwaggerGenerator(swiggerOptions(__dirname));

// Удаление пустого required
const removeEmptyRequired = (rootObj) => {
    for (const key in rootObj) {
        if (rootObj.hasOwnProperty(key) && key === 'required' && rootObj[key].length === 0) {
            delete rootObj[key];
        }

        if (typeof rootObj[key] === 'object') {
            removeEmptyRequired(rootObj[key]);
        }
    }
};

removeEmptyRequired(swaggerDoc);

// Запись данных в файл Swagger документации
fs.writeFileSync('./docs/docs_swagger2.yaml', jsonToYaml.stringify(swaggerDoc));

// Конвертация объекта Swagger 2 в Open API 3 (Swagger 3)
swaggerConverter.convertObj(swaggerDoc, {}, (err, options) => {
    if (err) {
        // Обработка ошибок
        console.error(err);
    } else {
        // Формирование выходных данных
        const output = jsonToYaml.stringify(options.openapi);
        // Запись выходных данных
        fs.writeFileSync('./docs/docs.yaml', output);
        process.exit(0);
    }
});