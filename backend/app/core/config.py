from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "PhishGuard Chain API"
    api_v1_prefix: str = "/api"
    backend_cors_origins: list[str] = ["*"]

    # ML / model settings (stubs for now)
    model_endpoint: str | None = None

    # Blockchain settings (stubs for now)
    blockchain_rpc_url: str | None = None
    contract_address: str | None = None

    class Config:
        env_file = ".env"


settings = Settings()


