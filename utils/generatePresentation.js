const pptxgen = require('pptxgenjs');

function generatePresentation() {
  let pptx = new pptxgen();

  // Slide 1: Title
  pptx.addSlide().addText([
    { text: 'LMS Project', options: { fontSize: 32, bold: true } },
    { text: '\n(نظام إدارة تعلم)', options: { fontSize: 20 } },
    { text: '\nAPI & Authentication Overview', options: { fontSize: 18, italic: true } }
  ], { x: 1, y: 1, w: 8, h: 3, align: 'center' });

  // Slide 2: Project Structure
  pptx.addSlide().addText([
    { text: 'Project Structure', options: { fontSize: 24, bold: true } },
    { text: '\n- app.js: Main app setup (middlewares, routers, CORS, Swagger UI)', options: { fontSize: 16 } },
    { text: '\n- server.js: Server entry point', options: { fontSize: 16 } },
    { text: '\n- routes/: API route files', options: { fontSize: 16 } },
    { text: '\n- controller/: Controllers (user, auth, error)', options: { fontSize: 16 } },
    { text: '\n- services/: Business logic (user.service.js)', options: { fontSize: 16 } },
    { text: '\n- entities/: TypeORM EntitySchemas', options: { fontSize: 16 } },
    { text: '\n- utils/: Passport strategies, helpers', options: { fontSize: 16 } },
    { text: '\n- swagger.yaml: API documentation (OpenAPI/Swagger)', options: { fontSize: 16 } }
  ], { x: 0.5, y: 0.5, w: 9, h: 5 });

  // Slide 3: Authentication & User Flow
  pptx.addSlide().addText([
    { text: 'Authentication & User Flow', options: { fontSize: 24, bold: true } },
    { text: '\n- Manual Signup/Login: /users/signup, /users/login', options: { fontSize: 16 } },
    { text: '\n- Social Login: Google & Facebook OAuth', options: { fontSize: 16 } },
    { text: '\n- Password Management: update, forgot, reset', options: { fontSize: 16 } },
    { text: '\n- Logout: /users/logout', options: { fontSize: 16 } }
  ], { x: 0.5, y: 0.5, w: 9, h: 5 });

  // Slide 4: Security
  pptx.addSlide().addText([
    { text: 'Security', options: { fontSize: 24, bold: true } },
    { text: '\n- CORS: Configured for all origins (can be restricted)', options: { fontSize: 16 } },
    { text: '\n- Rate Limiting: 100 req/hr per IP', options: { fontSize: 16 } },
    { text: '\n- Session & JWT: Secure user sessions', options: { fontSize: 16 } },
    { text: '\n- TypeORM: SQL Injection protection', options: { fontSize: 16 } },
    { text: '\n- Input Validation: On all endpoints', options: { fontSize: 16 } }
  ], { x: 0.5, y: 0.5, w: 9, h: 5 });

  // Slide 5: API Documentation
  pptx.addSlide().addText([
    { text: 'API Documentation', options: { fontSize: 24, bold: true } },
    { text: '\n- Swagger UI: /api-docs', options: { fontSize: 16 } },
    { text: '\n- All endpoints under Auth tag', options: { fontSize: 16 } },
    { text: '\n- Interactive testing from browser', options: { fontSize: 16 } }
  ], { x: 0.5, y: 0.5, w: 9, h: 5 });

  // Slide 6: How to Start
  pptx.addSlide().addText([
    { text: 'How to Start the Project', options: { fontSize: 24, bold: true } },
    { text: '\n1. npm install', options: { fontSize: 16 } },
    { text: '\n2. Configure config.env', options: { fontSize: 16 } },
    { text: '\n3. npm start', options: { fontSize: 16 } },
    { text: '\n4. Open http://localhost:3000/api-docs', options: { fontSize: 16 } }
  ], { x: 0.5, y: 0.5, w: 9, h: 5 });

  // Slide 7: Future Features
  pptx.addSlide().addText([
    { text: 'Future Features', options: { fontSize: 24, bold: true } },
    { text: '\n- Course management', options: { fontSize: 16 } },
    { text: '\n- Advanced roles/permissions', options: { fontSize: 16 } },
    { text: '\n- User profile pictures', options: { fontSize: 16 } },
    { text: '\n- Email notifications', options: { fontSize: 16 } }
  ], { x: 0.5, y: 0.5, w: 9, h: 5 });

  pptx.writeFile({ fileName: 'LMS_Project_Presentation.pptx' });
}

generatePresentation(); 