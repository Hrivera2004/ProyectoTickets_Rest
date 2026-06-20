import { Router, Request, Response } from "express";
import multer from "multer";
import { redmine, DEFAULT_PROJECT_ID } from "../redmineClient";
import {
  CreateIssueRequestBody,
  RedmineUploadResponse,
  RedmineIssuePayload,
} from "../types";

const router = Router();

// Guarda el archivo en memoria; no escribimos a disco porque solo
// lo reenviamos a Redmine.
const upload = multer({ storage: multer.memoryStorage() });

/**
 * GET /api/issues
 * Lista los tickets del proyecto configurado en .env
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const response = await redmine.get("/issues.json", {
      params: { project_id: DEFAULT_PROJECT_ID },
    });
    res.json(response.data);
  } catch (error: any) {
    console.error(
      "Error al listar issues:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "No se pudo obtener la lista de issues" });
  }
});

/**
 * POST /api/issues
 * Crea un ticket. Acepta multipart/form-data con:
 *   - subject: string (requerido)
 *   - image: archivo (opcional)
 * Si viene imagen, primero se sube a Redmine (/uploads.json) y
 * luego se adjunta al issue usando el token devuelto.
 */
router.post(
  "/",
  upload.single("image"),
  async (req: Request<{}, {}, CreateIssueRequestBody>, res: Response) => {
    const { subject } = req.body;

    if (!subject || subject.trim().length === 0) {
      return res.status(400).json({ error: "El campo subject es requerido" });
    }

    try {
      const payload: RedmineIssuePayload = {
        issue: {
          project_id: DEFAULT_PROJECT_ID,
          subject,
        },
      };

      if (req.file) {
        const uploadResponse = await redmine.post<RedmineUploadResponse>(
          "/uploads.json",
          req.file.buffer,
          { headers: { "Content-Type": "application/octet-stream" } }
        );

        payload.issue.uploads = [
          {
            token: uploadResponse.data.upload.token,
            filename: req.file.originalname,
            content_type: req.file.mimetype,
          },
        ];
      }

      const issueResponse = await redmine.post("/issues.json", payload);
      res.status(201).json(issueResponse.data);
    } catch (error: any) {
      console.error(
        "Error al crear issue:",
        error.response?.data || error.message
      );
      res.status(500).json({ error: "No se pudo crear el issue" });
    }
  }
);

export default router;
