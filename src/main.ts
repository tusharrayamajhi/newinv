import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { swaggerUser } from './swagger/swagger.user';
import { swaggerController } from './swagger/swaggercontroller';
import { Request, Response } from 'express';

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Helper function to create Swagger documents
  const createSwaggerDocument = (title: string, description: string, version: string, tags: string[]) => {
    const config = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt'
      );

    tags.forEach(tag => config.addTag(tag));

    const document = SwaggerModule.createDocument(app, config.build());

    // Filter routes based on tags
    document.paths = Object.keys(document.paths).reduce((filteredPaths, path) => {
      const pathItem = document.paths[path];
      const methods = Object.keys(pathItem).filter(method => {
        const operation = pathItem[method];
        return operation.tags.some(tag => tags.includes(tag));
      });

      if (methods.length > 0) {
        filteredPaths[path] = methods.reduce((filteredPathItem, method) => {
          filteredPathItem[method] = pathItem[method];
          return filteredPathItem;
        }, {});
      }

      return filteredPaths;
    }, {});

    // Filter tags based on the specified tags
    document.tags = document.tags.filter(tag => tags.includes(tag.name));

    return document;
  };

  // Define Swagger setups for each role
  const roles = [
    {
      role: swaggerUser.superAdmin,
      title: 'My inventory management API for superadmin',
      description: 'Inventory management system',
      tags: Object.keys(swaggerController).map(key => `${swaggerUser.superAdmin}${swaggerController[key]}`),
      path: '/api/superAdmin/docs',
      filter: swaggerUser.superAdmin
    },
    {
      role: swaggerUser.admin,
      title: 'My inventory management API for admin',
      description: 'Inventory management system',
      tags: Object.keys(swaggerController).map(key => `${swaggerUser.admin}${swaggerController[key]}`),
      path: '/api/admin/docs',
      filter: swaggerUser.admin
    },
    {
      role: swaggerUser.other,
      title: 'My inventory management API for other',
      description: 'Inventory management system',
      tags: Object.keys(swaggerController).map(key => `${swaggerUser.other}${swaggerController[key]}`),
      path: '/api/other/docs',
      filter: swaggerUser.other
    }
  ];

  roles.forEach(({ title, description, tags, path, filter }) => {
    const document = createSwaggerDocument(
      title,
      description,
      '1.0',
      tags
    );
    SwaggerModule.setup(path, app, document, {
      swaggerOptions: {
        docExpansion: 'none',
        operationsSorter: 'alpha',
        deepLinking: true,
        showRequestDuration: true,
        filter: filter,
      },
      customCssUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
      ],
      customSiteTitle: `${title} Documentation`,
      customfavIcon: 'https://example.com/favicon.ico',
    });
  });

  // API landing page with Tailwind CSS design
  expressApp.get('/api', (req: Request, res: Response) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>API Docs Navigation</title>
          <script src="https://cdn.tailwindcss.com"></script> <!-- Include Tailwind CSS -->
        </head>
        <body class="bg-gray-100 font-sans antialiased">
          <div class="container mx-auto px-4 py-8">
            <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">API Documentation</h1>
            <div class="bg-white shadow-lg rounded-lg p-6">
              <p class="text-xl text-gray-700 mb-4">Choose the appropriate API documentation:</p>
              <ul class="space-y-4">
                <li>
                  <a href="/api/superAdmin/docs" class="block p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">Super Admin Documentation</a>
                </li>
                <li>
                  <a href="/api/admin/docs" class="block p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">Admin Documentation</a>
                </li>
                <li>
                  <a href="/api/other/docs" class="block p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-300">Role-Based User Documentation</a>
                </li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `);
  });
  app.enableCors()
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

bootstrap();

