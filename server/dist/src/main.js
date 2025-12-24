"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function validateEnvironment() {
    const required = ['JWT_SECRET', 'DATABASE_URL'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        console.error('❌ FATAL: Missing required environment variables:');
        missing.forEach(key => console.error(`   - ${key}`));
        console.error('\nApplication cannot start without these variables.');
        console.error('Please check your .env file or environment configuration.\n');
        process.exit(1);
    }
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        console.error('❌ FATAL: JWT_SECRET must be at least 32 characters long');
        console.error('Current length:', process.env.JWT_SECRET.length);
        process.exit(1);
    }
    console.log('✅ Environment validation passed');
}
async function bootstrap() {
    var _a;
    validateEnvironment();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const allowedOrigins = ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.length === 0 && process.env.NODE_ENV !== 'production') {
                return callback(null, true);
            }
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                console.warn(`⚠️  Blocked CORS request from unauthorized origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('AURA ONE API')
        .setDescription('The AURA ONE hospital operating system API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(3001, '0.0.0.0');
    console.log(`🚀 AURA ONE Server running on: ${await app.getUrl()}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 CORS origins: ${allowedOrigins.join(', ') || 'All (development mode)'}`);
}
bootstrap();
//# sourceMappingURL=main.js.map