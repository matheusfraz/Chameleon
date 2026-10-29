-- CreateEnum
CREATE TYPE "event_type" AS ENUM ('NEW_SUBSCRIBER', 'NEW_MEMBER', 'LIVE_CHAT_MESSAGE');

-- CreateEnum
CREATE TYPE "event_source" AS ENUM ('REAL', 'SIMULATED');

-- CreateEnum
CREATE TYPE "event_status" AS ENUM ('DISPATCHED', 'NO_ALERT', 'DISABLED');

-- CreateEnum
CREATE TYPE "youtube_connection_status" AS ENUM ('CONNECTED', 'EXPIRED', 'REVOKED', 'ERROR');

-- CreateEnum
CREATE TYPE "members_access" AS ENUM ('UNKNOWN', 'AVAILABLE', 'UNAVAILABLE');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "google_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "overlay_token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "youtube_connections" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "channel_id" TEXT NOT NULL,
    "channel_title" TEXT NOT NULL,
    "channel_thumbnail_url" TEXT,
    "access_token_enc" TEXT NOT NULL,
    "refresh_token_enc" TEXT NOT NULL,
    "access_token_expires_at" TIMESTAMP(3) NOT NULL,
    "scopes" TEXT[],
    "status" "youtube_connection_status" NOT NULL DEFAULT 'CONNECTED',
    "last_error" TEXT,
    "subscribers_checked_until" TIMESTAMP(3),
    "members_access" "members_access" NOT NULL DEFAULT 'UNKNOWN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "youtube_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" UUID NOT NULL,
    "owner_id" UUID,
    "storage_key" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" UUID NOT NULL,
    "owner_id" UUID,
    "system_key" TEXT,
    "name" TEXT NOT NULL,
    "asset_id" UUID NOT NULL,
    "layout" JSONB NOT NULL,
    "default_duration_ms" INTEGER NOT NULL DEFAULT 5000,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_configs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "event_type" "event_type" NOT NULL,
    "template_id" UUID NOT NULL,
    "slot_texts" JSONB NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alert_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "event_type" NOT NULL,
    "source" "event_source" NOT NULL,
    "external_id" TEXT,
    "payload" JSONB NOT NULL,
    "status" "event_status" NOT NULL,
    "alert_config_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_overlay_token_key" ON "users"("overlay_token");

-- CreateIndex
CREATE UNIQUE INDEX "youtube_connections_user_id_key" ON "youtube_connections"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "assets_storage_key_key" ON "assets"("storage_key");

-- CreateIndex
CREATE INDEX "assets_owner_id_idx" ON "assets"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "templates_system_key_key" ON "templates"("system_key");

-- CreateIndex
CREATE INDEX "templates_owner_id_idx" ON "templates"("owner_id");

-- CreateIndex
CREATE INDEX "templates_asset_id_idx" ON "templates"("asset_id");

-- CreateIndex
CREATE INDEX "alert_configs_template_id_idx" ON "alert_configs"("template_id");

-- CreateIndex
CREATE UNIQUE INDEX "alert_configs_user_id_event_type_key" ON "alert_configs"("user_id", "event_type");

-- CreateIndex
CREATE INDEX "events_user_id_created_at_idx" ON "events"("user_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "events_user_id_type_external_id_key" ON "events"("user_id", "type", "external_id");

-- AddForeignKey
ALTER TABLE "youtube_connections" ADD CONSTRAINT "youtube_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_configs" ADD CONSTRAINT "alert_configs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_configs" ADD CONSTRAINT "alert_configs_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_alert_config_id_fkey" FOREIGN KEY ("alert_config_id") REFERENCES "alert_configs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
