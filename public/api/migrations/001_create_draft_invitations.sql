-- Sprint 1B Migration 001
-- Mövcud cədvəllərə toxunulmur

CREATE TABLE IF NOT EXISTS draft_invitations (
    id              BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    draft_code      VARCHAR(20)      DEFAULT NULL,
    session_id      VARCHAR(64)      NOT NULL,
    package         VARCHAR(50)      NOT NULL DEFAULT 'SADE',
    current_step    TINYINT UNSIGNED NOT NULL DEFAULT 1,
    status          ENUM('draft','submitted','approved','rejected')
                                     NOT NULL DEFAULT 'draft',
    customer_phone  VARCHAR(50)      DEFAULT NULL,
    form_data       MEDIUMTEXT       DEFAULT NULL,
    created_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP
                                              ON UPDATE CURRENT_TIMESTAMP,
    submitted_at    DATETIME         DEFAULT NULL,
    approved_at     DATETIME         DEFAULT NULL,
    expires_at      DATETIME         NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY  uq_draft_code   (draft_code),
    INDEX       idx_session_id  (session_id),
    INDEX       idx_status      (status),
    INDEX       idx_expires_at  (expires_at)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
