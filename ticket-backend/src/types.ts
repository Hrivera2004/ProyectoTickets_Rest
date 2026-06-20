export interface RedmineUploadResponse {
  upload: {
    id: number;
    token: string;
  };
}

export interface RedmineUploadPayload {
  token: string;
  filename: string;
  content_type: string;
}

export interface CreateIssueRequestBody {
  subject: string;
}

export interface RedmineIssuePayload {
  issue: {
    project_id: number;
    subject: string;
    uploads?: RedmineUploadPayload[];
  };
}
