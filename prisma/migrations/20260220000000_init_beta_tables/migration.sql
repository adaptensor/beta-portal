-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "beta_testers" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "role" TEXT NOT NULL,
    "aircraft_types" TEXT,
    "current_software" TEXT,
    "interested_products" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "agreed_to_terms" BOOLEAN NOT NULL DEFAULT false,
    "invite_code" TEXT,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP(3),
    "last_active_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "beta_testers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_bug_reports" (
    "id" TEXT NOT NULL,
    "report_number" TEXT NOT NULL,
    "tester_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "steps_to_reproduce" TEXT,
    "expected_behavior" TEXT,
    "actual_behavior" TEXT,
    "browser_os" TEXT,
    "page_url" TEXT,
    "console_errors" TEXT,
    "assigned_to" TEXT,
    "fixed_in_version" TEXT,
    "resolution" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "beta_bug_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_feature_requests" (
    "id" TEXT NOT NULL,
    "request_number" TEXT NOT NULL,
    "tester_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "description" TEXT NOT NULL,
    "use_case" TEXT,
    "target_version" TEXT,
    "admin_response" TEXT,
    "vote_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beta_feature_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_attachments" (
    "id" TEXT NOT NULL,
    "bug_report_id" TEXT,
    "feature_request_id" TEXT,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beta_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_comments" (
    "id" TEXT NOT NULL,
    "bug_report_id" TEXT,
    "feature_request_id" TEXT,
    "tester_id" TEXT,
    "author_name" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beta_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_votes" (
    "id" TEXT NOT NULL,
    "bug_report_id" TEXT,
    "feature_request_id" TEXT,
    "tester_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beta_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_session_prompts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prompt_content" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "estimated_time" TEXT,
    "prerequisites" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beta_session_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'update',
    "version" TEXT,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beta_announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beta_platform_metrics" (
    "id" TEXT NOT NULL,
    "metric_name" TEXT NOT NULL,
    "metric_value" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beta_platform_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "beta_testers_clerk_user_id_key" ON "beta_testers"("clerk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "beta_testers_email_key" ON "beta_testers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "beta_testers_invite_code_key" ON "beta_testers"("invite_code");

-- CreateIndex
CREATE UNIQUE INDEX "beta_bug_reports_report_number_key" ON "beta_bug_reports"("report_number");

-- CreateIndex
CREATE UNIQUE INDEX "beta_feature_requests_request_number_key" ON "beta_feature_requests"("request_number");

-- CreateIndex
CREATE UNIQUE INDEX "beta_votes_tester_id_bug_report_id_key" ON "beta_votes"("tester_id", "bug_report_id");

-- CreateIndex
CREATE UNIQUE INDEX "beta_votes_tester_id_feature_request_id_key" ON "beta_votes"("tester_id", "feature_request_id");

-- AddForeignKey
ALTER TABLE "beta_bug_reports" ADD CONSTRAINT "beta_bug_reports_tester_id_fkey" FOREIGN KEY ("tester_id") REFERENCES "beta_testers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beta_feature_requests" ADD CONSTRAINT "beta_feature_requests_tester_id_fkey" FOREIGN KEY ("tester_id") REFERENCES "beta_testers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beta_attachments" ADD CONSTRAINT "beta_attachments_bug_report_id_fkey" FOREIGN KEY ("bug_report_id") REFERENCES "beta_bug_reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beta_attachments" ADD CONSTRAINT "beta_attachments_feature_request_id_fkey" FOREIGN KEY ("feature_request_id") REFERENCES "beta_feature_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beta_comments" ADD CONSTRAINT "beta_comments_bug_report_id_fkey" FOREIGN KEY ("bug_report_id") REFERENCES "beta_bug_reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beta_comments" ADD CONSTRAINT "beta_comments_feature_request_id_fkey" FOREIGN KEY ("feature_request_id") REFERENCES "beta_feature_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beta_comments" ADD CONSTRAINT "beta_comments_tester_id_fkey" FOREIGN KEY ("tester_id") REFERENCES "beta_testers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beta_votes" ADD CONSTRAINT "beta_votes_bug_report_id_fkey" FOREIGN KEY ("bug_report_id") REFERENCES "beta_bug_reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beta_votes" ADD CONSTRAINT "beta_votes_feature_request_id_fkey" FOREIGN KEY ("feature_request_id") REFERENCES "beta_feature_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beta_votes" ADD CONSTRAINT "beta_votes_tester_id_fkey" FOREIGN KEY ("tester_id") REFERENCES "beta_testers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

