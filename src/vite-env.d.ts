interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_KAKAO_REST_API_KEY: string;
  readonly VITE_API_MOCKING?: 'enabled';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
