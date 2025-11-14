/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_URL_SEND_ADDRESS?: string;
  readonly VITE_QR_SEND_ADDRESS?: string;
  readonly VITE_QR_ADD_REVIEWS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}