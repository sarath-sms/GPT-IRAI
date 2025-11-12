import swaggerUi from "swagger-ui-express";
import fs from "fs";

export const swaggerDocs = (app) => {
  const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf-8"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("📘 Swagger Docs available at /api-docs");
};
