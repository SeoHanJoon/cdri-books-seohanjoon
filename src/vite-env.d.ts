// import.meta.env에 앱이 쓰는 환경변수 타입을 더한다.
// strictImportMetaEnv: 여기 적지 않은 이름(오타 포함)을 쓰면 any가 아니라 타입 오류가 난다.
interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_KAKAO_REST_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
